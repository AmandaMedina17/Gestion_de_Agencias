import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, EntityManager } from 'typeorm';
import { Activity } from '@domain/Entities/Activity';
import { IActivityRepository } from '@domain/Repositories/IActivityRepository';
import { ActivityEntity } from '../Entities/ActivityEntity';
import { ActivityResponsibleEntity } from '../Entities/ActivityResponsibleEntity';
import { ActivityPlaceEntity } from '../Entities/ActivityPlaceEntity';
import { ActivityDateEntity } from '../Entities/ActivityDateEntity';
import { ActivityMapper } from '../Mappers/ActivityMapper';
import { BaseRepository } from './BaseRepositoryImpl';

@Injectable()
export class ActivityRepository extends BaseRepository<Activity, ActivityEntity> implements IActivityRepository {

  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepo: Repository<ActivityEntity>,
    @InjectRepository(ActivityResponsibleEntity)
    private readonly activityResponsibleRepo: Repository<ActivityResponsibleEntity>,
    @InjectRepository(ActivityPlaceEntity)
    private readonly activityPlaceRepo: Repository<ActivityPlaceEntity>,
    @InjectRepository(ActivityDateEntity)
    private readonly activityDateRepo: Repository<ActivityDateEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly activityMapper: ActivityMapper,
  ) {
    super(activityRepo, activityMapper);
  }

  getArtistActivities(id: string): Promise<Activity[]> {
    throw new Error('Method not implemented.');
  }

  getGroupActivities(id: string): Promise<Activity[]> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Activity | null> {
    const entity: ActivityEntity | null = await this.activityRepo.findOne({
      where: { id },
      relations: this.getDefaultRelations(),
    });

    if (!entity) {
      return null;
    }

    return this.activityMapper.toDomainWithRelations(entity);
  }

  async findAll(): Promise<Activity[]> {
    const entities: ActivityEntity[] = await this.activityRepo.find({
      relations:this.getDefaultRelations(),
    });
    
    return entities.map(entity => this.activityMapper.toDomainWithRelations(entity));
  }

  async update(entity: Activity): Promise<Activity> {
    return await this.save(entity);
  }

  async save(activity: Activity): Promise<Activity> {
    
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      try {
        // Guardar actividad principal
        const activityEntity: ActivityEntity = this.activityMapper.toDataBaseEntity(activity);
        const savedActivityEntity: ActivityEntity = await transactionalEntityManager.save(ActivityEntity, activityEntity);

        // Guardar relaciones dentro de la misma transacción
        await this.saveRelations(transactionalEntityManager, activity);

        // Cargar la actividad completa con relaciones dentro de la transacción
        const fullActivityEntity = await this.loadFullActivity(
          transactionalEntityManager, 
          activity.getId()
        );

        return fullActivityEntity;
     
      } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
      }
    });
  }

  private async saveRelations(
    transactionalEntityManager: EntityManager, 
    activity: Activity
  ): Promise<void> {
    const activityId: string = activity.getId();

    // 📍 GUARDAR RESPONSABLES
    
    const activityResponsibles: ActivityResponsibleEntity[] = activity.getResponsibles().map(responsible => {
      const entity = new ActivityResponsibleEntity();
      entity.activityId = activityId;
      entity.responsibleId = responsible.getId();
      return entity;
    });
    
    if (activityResponsibles.length > 0) {
      await transactionalEntityManager.save(ActivityResponsibleEntity, activityResponsibles);
    }

    // 📍 GUARDAR LUGARES
    
    const activityPlaces: ActivityPlaceEntity[] = activity.getPlaces().map(place => {
      const entity = new ActivityPlaceEntity();
      entity.activityId = activityId;
      entity.placeId = place.getId();
      return entity;
    });
    
    if (activityPlaces.length > 0) {
      await transactionalEntityManager.save(ActivityPlaceEntity, activityPlaces);
    }

    // 📍 GUARDAR FECHAS
    
    const activityDates: ActivityDateEntity[] = activity.getDates().map((date: Date) => {
      const entity = new ActivityDateEntity();
      entity.activityId = activityId;
      entity.date = date; 
      return entity;
    });
    
    if (activityDates.length > 0) {
      await transactionalEntityManager.save(ActivityDateEntity, activityDates);
    }
  }

  private getDefaultRelations(): string[] {
    return [
      'activityResponsibles',
      'activityResponsibles.responsible',
      'activityPlaces', 
      'activityPlaces.place',
      'activityDates'
    ];
  }

  private async loadFullActivity(manager: EntityManager, id: string): Promise<Activity> {
    const entity = await manager.findOne(ActivityEntity, {
      where: { id },
      relations: this.getDefaultRelations(),
    });

    if (!entity) {
      throw new Error(`Activity with id ${id} not found after save`);
    }

    return this.activityMapper.toDomainWithRelations(entity)
  }

}