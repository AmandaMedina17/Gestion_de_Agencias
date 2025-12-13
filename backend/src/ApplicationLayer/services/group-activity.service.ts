import { Injectable, Inject } from '@nestjs/common';
import { ScheduleGroupUseCase } from '@application/UseCases/schedule-group.use-case';
import { ScheduleGroupDto } from '@application/DTOs/schedule-groupDto/schedule-group.dto';
import { IGroupActivityRepository } from '@domain/Repositories/IGroupActivityRepository';
import { ActivityResponseDto } from '@application/DTOs/activityDto/response-activity.dto';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';
import { GetGroupCalendaryDto } from '@application/DTOs/schedule-groupDto/group_calendary.dto';

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

  async getGroupActivities(dto: GetGroupCalendaryDto): Promise<ActivityResponseDto[]> {
    const activities = await this.groupActivityRepository.getActivitiesByGroupId(dto.groupId, dto.start_date, dto.end_date);
    return this.activityDtoMapper.toResponseList(activities)
  }
  
}