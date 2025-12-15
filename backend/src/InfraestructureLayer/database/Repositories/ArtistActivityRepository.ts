import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { IArtistActivityRepository } from '@domain/Repositories/IArtistActivityRepository';
import { ActivityEntity } from '../Entities/ActivityEntity';
import { Activity } from '@domain/Entities/Activity';
import { ArtistActivityEntity } from '../Entities/ArtistActivityEntity';
import { ActivityDateEntity } from '../Entities/ActivityDateEntity';
import { ActivityMapper } from '../Mappers/ActivityMapper';
import { Income } from '@domain/Entities/Income';
import { IncomeEntity } from '../Entities/IncomeEntity';
import { IncomeMapper } from '../Mappers/IncomeMapper';

@Injectable()
export class ArtistActivityRepository implements IArtistActivityRepository {
  constructor(
    @InjectRepository(ArtistActivityEntity)
    private readonly repository: Repository<ArtistActivityEntity>,
    private readonly activityMapper: ActivityMapper,
    private readonly incomeMapper: IncomeMapper
  ) {}
  
  async scheduleArtist (artistId: string, activityId: string): Promise<void> {

    const entity = new ArtistActivityEntity();
    entity.artistId = artistId;
    entity.activityId = activityId;

    await this.repository.save(entity);
  }

  async isArtistScheduled(artistId: string, activityId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { artistId, activityId }
    });
    return count > 0;
  }

  async checkScheduleConflicts(artistId: string, activityId: string): Promise<Activity[]> {

  const conflicts = await this.repository
    .createQueryBuilder('artistActivity')
    .innerJoinAndSelect('artistActivity.activity', 'conflictActivity')
    .innerJoin('conflictActivity.activityDates', 'conflictDates')
    .where('artistActivity.artist_id = :artistId', { artistId })
    .andWhere('artistActivity.activity_id != :activityId', { activityId })
    .andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('1')
        .from(ActivityDateEntity, 'newDates')
        .where('newDates.activity_id = :activityId')
        .andWhere('DATE(newDates.date) = DATE(conflictDates.date)')
        .getQuery();

      return `EXISTS ${subQuery}`;
    })
    .setParameter('activityId', activityId)
    .getMany();

     const activitiesWithRelations = await Promise.all(
      conflicts.map(async (artist_activity: ArtistActivityEntity) => {
        return await this.repository.manager.findOne(ActivityEntity, {
          where: { id: artist_activity.activity.id },
          relations: [
            'activityDates',
            'activityResponsibles',
            'activityResponsibles.responsible',
            'activityPlaces',
            'activityPlaces.place',
          ]
        });
      })
    );

 return activitiesWithRelations
      .filter(a => a !== null)
      .map(a => this.activityMapper.toDomainWithRelations(a));
}


  async getActivitiesByArtist(artistId: string): Promise<Activity[]> {
  
    const query = `

      WITH artist_memberships AS (
        SELECT 
          group_id,
          "startDate",
          end_date
        FROM artist_group_membership 
        WHERE artist_id = $1
      )
      SELECT DISTINCT a.* 
      FROM activity_entity a
      -- Actividades individuales 
      INNER JOIN artist_activity aa ON a.id = aa.activity_id
      WHERE aa.artist_id = $1

      UNION

      -- Actividades grupales CON validación de fechas
      SELECT DISTINCT a.* 
      FROM activity_entity a
      INNER JOIN group_activity ga ON a.id = ga.activity_id
      INNER JOIN artist_memberships am ON ga.group_id = am.group_id
      INNER JOIN activity_date ad ON a.id = ad.activity_id
      WHERE 
        -- La fecha de actividad debe estar dentro del periodo de membresía
        ad.date >= am."startDate"
        AND (am.end_date IS NULL OR ad.date <= am.end_date)
    `;

    const activities = await this.repository.manager.query(query, [artistId]);
    
    // Obtener relaciones completas para cada actividad
    const activitiesWithRelations = await Promise.all(
      activities.map(async (activity: ActivityEntity) => {
        return await this.repository.manager.findOne(ActivityEntity, {
          where: { id: activity.id },
          relations: [
            'activityDates',
            'activityResponsibles',
            'activityResponsibles.responsible',
            'activityPlaces',
            'activityPlaces.place',
          ]
        });
      })
    );

    return activitiesWithRelations
      .filter(a => a !== null)
      .map(a => this.activityMapper.toDomainWithRelations(a));
  }

  async calculateArtistIncomes(artistId: string, startDate?: Date, endDate?: Date
  ): Promise<{ incomes: Income[]; totalIncome: number }> {
    const query = `
      WITH artist_memberships AS (
        SELECT 
          group_id,
          "startDate",
          end_date
        FROM artist_group_membership 
        WHERE artist_id = $1
      ),
      artist_activities AS (
        -- Actividades individuales
        SELECT DISTINCT a.id
        FROM activity_entity a
        INNER JOIN artist_activity aa ON a.id = aa.activity_id
        WHERE aa.artist_id = $1

        UNION

        -- Actividades grupales 
        SELECT DISTINCT a.id
        FROM activity_entity a
        INNER JOIN group_activity ga ON a.id = ga.activity_id
        INNER JOIN artist_memberships am ON ga.group_id = am.group_id
        INNER JOIN activity_date ad ON a.id = ad.activity_id
        WHERE 
          -- La fecha de actividad debe estar dentro del periodo de membresía
          ad.date >= am."startDate"
          AND (am.end_date IS NULL OR ad.date <= am.end_date)
      )
      SELECT i.*
      FROM income i
      WHERE i.activity_id IN (SELECT id FROM artist_activities)
        AND i.date <= NOW()  -- Filtro por fecha del INGRESO 
        AND ($2::date IS NULL OR i.date >= $2)
        AND ($3::date IS NULL OR i.date <= $3)
      ORDER BY i.date DESC;
    `;

    // Ejecutar consulta
    const rows = await this.repository.query(query, [
      artistId,
      startDate || null,
      endDate || null,
    ]);

    // Mapear cada fila a IncomeEntity y luego a Income del dominio
    const incomes: Income[] = [];
    let totalIncome = 0;

    for (const row of rows) {
      // Crear instancia de IncomeEntity
      const incomeEntity = new IncomeEntity();
      incomeEntity.id = row.id;
      incomeEntity.activityID = row.activity_id;
      incomeEntity.incomeType = row.incomeType;
      incomeEntity.mount = Number(row.mount);
      incomeEntity.date = row.date;
      incomeEntity.responsible = row.responsible;

      // Convertir a dominio usando el mapper
      const income = this.incomeMapper.toDomainEntity(incomeEntity);
      incomes.push(income);
      totalIncome += income.getMount(); 
    }

    return { incomes, totalIncome };
  }

  async confirmAttendance(artistId: string, activityId: string): Promise<void> {
    const attendance = await this.repository.findOne({
      where: { artistId, activityId }
    });

    if (!attendance) {
      throw new NotFoundException(
        `No se encontró la asistencia del artista ${artistId} a la actividad ${activityId}`
      );
    }

    attendance.confirmation = true;
    await this.repository.save(attendance);
  }

  async cancelAttendance(artistId: string, activityId: string): Promise<void> {
    const attendance = await this.repository.findOne({
      where: { artistId, activityId }
    });

    if (!attendance) {
      throw new NotFoundException(
        `No se encontró la asistencia del artista ${artistId} a la actividad ${activityId}`
      );
    }

    attendance.confirmation = false;
    await this.repository.save(attendance);
  }
    
}