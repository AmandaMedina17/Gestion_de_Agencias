import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGroupActivityRepository } from '@domain/Repositories/IGroupActivityRepository';
import { GroupActivityEntity } from '../Entities/GroupActivity';
import { ActivityMapper } from '../Mappers/ActivityMapper';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { Artist } from '@domain/Entities/Artist';
import { IArtistActivityRepository } from '@domain/Repositories/IArtistActivityRepository';
import { Activity } from '@domain/Entities/Activity';

@Injectable()
export class GroupActivityRepository implements IGroupActivityRepository {
  constructor(
    @InjectRepository(GroupActivityEntity)
    private readonly repository: Repository<GroupActivityEntity>,
    private readonly groupRepository: IGroupRepository,
    private readonly artistActivityRepository: IArtistActivityRepository,

    private readonly activityMapper: ActivityMapper,
  ) {}

  async getActivitiesByGroupId( groupId: string, start_date: Date, end_date: Date): Promise<Activity[]> {

    // Crear query builder
    const query = this.repository
      .createQueryBuilder('groupActivity')
      .innerJoinAndSelect('groupActivity.activity', 'activity')
      .innerJoinAndSelect('activity.activityDates', 'activityDate')
      .leftJoinAndSelect('activity.activityResponsibles', 'activityResponsible')
      .leftJoinAndSelect('activityResponsible.responsible', 'responsible')
      .leftJoinAndSelect('activity.activityPlaces', 'activityPlace')
      .leftJoinAndSelect('activityPlace.place', 'place')
      .where('groupActivity.groupId = :groupId', { groupId });

    // Agregar condición de fechas
    query.andWhere('activityDate.date >= :start_date', { start_date });
    query.andWhere('activityDate.date <= :end_date', { end_date });
    
    // Ordenar por fecha
    query.orderBy('activityDate.date', 'ASC');

    const groupActivities = await query.getMany();

    return groupActivities.map(ga => this.activityMapper.toDomainWithRelations(ga.activity));
  }

  async scheduleGroup(groupId: string, activityId: string): Promise<void> {
    const entity = new GroupActivityEntity();
    entity.groupId = groupId;
    entity.activityId = activityId;
    await this.repository.save(entity);
  }

  async isGroupScheduled(groupId: string, activityId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { groupId, activityId }
    });
    return count > 0;
  }

  async checkGroupMembersConflicts(groupId: string, activityId: string): Promise<Artist[]> {

    // Obtener todos los artistas del grupo
    const group_members = await this.groupRepository.getGroupMembers(groupId)

    if (group_members.length === 0) {
      return [];
    }

    const conflicts: Artist[] = [];

    // Para cada artista, verificar conflictos con la nueva actividad
    for (const artist of group_members) {
      const artistConflicts = await this.artistActivityRepository.checkScheduleConflicts(artist.getId(), activityId);
      if (artistConflicts.length > 0) {
        conflicts.push(artist);
      }
    }

    return conflicts;
  }

  async getAllActivitiesByGroupId(groupId: string): Promise<Activity[]> {
    const groupActivities = await this.repository.find({
      where: { groupId },
      relations: [
        'activity',
        'activity.activityDates',
        'activity.activityResponsibles',
        'activity.activityResponsibles.responsible',
        'activity.activityPlaces',
        'activity.activityPlaces.place',
      ]
    });

    return groupActivities.map(ga => this.activityMapper.toDomainWithRelations(ga.activity));
  }
}