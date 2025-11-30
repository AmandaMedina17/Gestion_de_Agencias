import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from '@application/DTOs/activityDto/create-activity.dto';
import { UpdateActivityDto } from '@application/DTOs/activityDto/update-activity.dto';
import { Activity } from '@domain/Entities/Activity';
import { BaseService } from './base.service';
import { ActivityResponseDto } from '@application/DTOs/activityDto/response-activity.dto';
import { IActivityRepository } from '@domain/Repositories/IActivityRepository';
import { CreateActivityUseCase } from '@domain/UseCases/create_activity.use-case';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';

@Injectable()
export class ActivityService
extends BaseService<Activity, CreateActivityDto, ActivityResponseDto , UpdateActivityDto> {

  constructor(
    @Inject(IActivityRepository)
    private readonly activityRepository: IActivityRepository,
    private readonly activityDtoMapper: ActivityDtoMapper,
    private readonly create_activity_usecase: CreateActivityUseCase
  ) {
    super(activityRepository, activityDtoMapper)
  }

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
    const savedEntity = await this.create_activity_usecase.execute(createActivityDto)
    return this.mapper.toResponse(savedEntity)
  }
}
