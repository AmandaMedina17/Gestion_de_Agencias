import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from '@application/DTOs/activityDto/create-activity.dto';
import { UpdateActivityDto } from '@application/DTOs/activityDto/update-activity.dto';
import { Activity } from '@domain/Entities/Activity';
import { BaseService } from './base.service';
import { ActivityResponseDto } from '@application/DTOs/activityDto/response-activity.dto';
import { IActivityRepository } from '@domain/Repositories/IActivityRepository';
import { CreateActivityUseCase } from '@application/UseCases/create_activity.use-case';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';
import { UpdateActivityUseCase } from '@application/UseCases/update_activity.use-case';

@Injectable()
export class ActivityService
extends BaseService<Activity, CreateActivityDto, ActivityResponseDto , UpdateActivityDto> {

  constructor(
    @Inject(IActivityRepository)
    private readonly activityRepository: IActivityRepository,
    private readonly activityDtoMapper: ActivityDtoMapper,
    private readonly create_activity_usecase: CreateActivityUseCase,
    private readonly update_activity_usecase: UpdateActivityUseCase
  ) {
    super(activityRepository, activityDtoMapper)
  }

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
    const savedEntity = await this.create_activity_usecase.execute(createActivityDto)
    return this.mapper.toResponse(savedEntity)
  }

  async update(id: string, updateActivityDto: UpdateActivityDto): Promise<ActivityResponseDto>{
    const savedEntity = await this.update_activity_usecase.execute(id, updateActivityDto)
    return this.mapper.toResponse(savedEntity)
  }
}
