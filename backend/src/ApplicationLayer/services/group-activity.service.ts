import { Injectable, Inject } from '@nestjs/common';
import { ScheduleGroupUseCase } from '@application/UseCases/schedule-group.use-case';
import { ScheduleGroupDto } from '@application/DTOs/schedule-groupDto/schedule-group.dto';
import { IGroupActivityRepository } from '@domain/Repositories/IGroupActivityRepository';
import { ActivityResponseDto } from '@application/DTOs/activityDto/response-activity.dto';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';

@Injectable()
export class GroupActivityService {
  constructor(
    @Inject(IGroupActivityRepository)
    private readonly groupActivityRepository: IGroupActivityRepository,
    private readonly scheduleGroupUseCase: ScheduleGroupUseCase,
    private readonly activityDtoMapper: ActivityDtoMapper
  ) {}

  async scheduleGroup(dto: ScheduleGroupDto): Promise<void> {
    return await this.scheduleGroupUseCase.execute(dto);
  }

  async getGroupActivities(groupId: string): Promise<ActivityResponseDto[]> {
    const activities = await this.groupActivityRepository.getActivitiesByGroup(groupId);
    return this.activityDtoMapper.toResponseList(activities)
  }
  
}