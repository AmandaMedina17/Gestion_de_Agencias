import { Injectable, Inject } from '@nestjs/common';
import { IGroupActivityRepository } from '@domain/Repositories/IGroupActivityRepository';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { IActivityRepository } from '@domain/Repositories/IActivityRepository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ScheduleGroupDto } from '@application/DTOs/schedule-groupDto/schedule-group.dto';
import { ActivityType } from '@domain/Enums';

@Injectable()
export class ScheduleGroupUseCase {
  constructor(
    @Inject(IGroupActivityRepository)
    private readonly groupActivityRepository: IGroupActivityRepository,
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    @Inject(IActivityRepository)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(scheduleGroupDto: ScheduleGroupDto): Promise<void> {
    const { groupId, activityId } = scheduleGroupDto;

    // Verificar que existen
    const group = await this.groupRepository.findById(groupId);
    const activity = await this.activityRepository.findById(activityId);

    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    if (!activity) {
      throw new NotFoundException(`Actividad con ID ${activityId} no encontrada`);
    }

    // 2. Verificar que la actividad sea de tipo GRUPAL
    if (activity.getType() !== ActivityType.GRUPAL) {
      throw new ConflictException(
        'Solo se pueden programar grupos en actividades de tipo GRUPAL'
      );
    }

    // 3. Verificar que no esté ya programado
    const alreadyScheduled = await this.groupActivityRepository.isGroupScheduled(
      groupId,
      activityId
    );

    if (alreadyScheduled) {
      throw new ConflictException(
        'El grupo ya está programado para esta actividad'
      );
    }

    // Verificar conflictos de los miembros del grupo
    // const memberConflicts = await this.groupActivityRepository.checkGroupMembersConflicts(
    //   groupId,
    //   activityId
    // );

    // if (memberConflicts.length > 0) {
    //   throw new ConflictException(
    //     `Algunos miembros del grupo tienen conflictos de horario: ${memberConflicts.length} artistas afectados`
    //   );
    // }

    // 6. Programar el grupo
    await this.groupActivityRepository.scheduleGroup(
      groupId,
      activityId
    );
  }
}