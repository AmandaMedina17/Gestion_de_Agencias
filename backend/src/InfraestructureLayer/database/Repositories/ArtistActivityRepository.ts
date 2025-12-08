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
  
      // Encontrar todas las actividades del artista con sus relaciones completas
      const artistActivities = await this.repository.find({
        where: { artistId },
        relations: [
          'activity',
          'activity.activityDates',
          'activity.activityResponsibles',
          'activity.activityResponsibles.responsible',
          'activity.activityPlaces',
          'activity.activityPlaces.place', 
        ]
      });

      if (!artistActivities || artistActivities.length === 0) {
        return [];
      }

      // Extraer solo las actividades
      const activityEntities = artistActivities.map(aa => aa.activity);

      // Mapear a dominio
      return activityEntities.map(a => this.activityMapper.toDomainWithRelations(a));
    }
    
}