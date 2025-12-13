import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { IArtistActivityRepository } from '@domain/Repositories/IArtistActivityRepository';
import { ActivityEntity } from '../Entities/ActivityEntity';
import { Activity } from '@domain/Entities/Activity';
import { ArtistActivityEntity } from '../Entities/ArtistActivityEntity';
import { ActivityDateEntity } from '../Entities/ActivityDateEntity';
import { ActivityMapper } from '../Mappers/ActivityMapper';

@Injectable()
export class ArtistActivityRepository implements IArtistActivityRepository {
  constructor(
    @InjectRepository(ArtistActivityEntity)
    private readonly repository: Repository<ArtistActivityEntity>,
    private readonly activityMapper: ActivityMapper 
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
    const conflicts =  await this.repository
        .createQueryBuilder('artistActivity')
        .innerJoinAndSelect('artistActivity.activity', 'conflictActivity')
        .innerJoin('conflictActivity.activityDates', 'conflictDates')
        .innerJoin(
        ActivityDateEntity,
        'newDates',
        'newDates.activity_id = :activityId',
        { activityId }
        )
        .where('artistActivity.artist_id = :artistId', { artistId })
        .andWhere('artistActivity.activity_id != :activityId', { activityId })
        .andWhere('DATE(newDates.date) = DATE(conflictDates.date)')
        .select('conflictActivity')
        .getMany()
        .then(results => results.map(r => r.activity));

    return this.activityMapper.toDomainEntities(conflicts)
  }

    async confirmAttendance(artistId: string, activityId: string): Promise<void> {
    
    }

    cancelAttendance(artistId: string, activityId: string): Promise<void> {
        throw new Error('Method not implemented.');
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
    
}