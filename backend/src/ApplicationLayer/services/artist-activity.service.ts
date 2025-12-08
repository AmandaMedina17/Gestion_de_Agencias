import { Inject, Injectable } from '@nestjs/common';
import { ScheduleArtistUseCase } from '@application/UseCases/schedule-artist.use-case';
import { ScheduleArtistDto } from '@application/DTOs/schedule-artistDto/schedule-artist.dto';
import { IArtistActivityRepository } from '@domain/Repositories/IArtistActivityRepository';
import { ActivityResponseDto } from '@application/DTOs/activityDto/response-activity.dto';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';

@Injectable()
export class ArtistActivityService {
  constructor(
    @Inject(IArtistActivityRepository)
    private readonly artistActivityRepository: IArtistActivityRepository,
    private readonly scheduleArtistUseCase: ScheduleArtistUseCase,
    private readonly activityDtoMapper: ActivityDtoMapper
  ) {}

  async scheduleArtist(dto: ScheduleArtistDto): Promise<void> {
    return await this.scheduleArtistUseCase.execute(dto);
  }

  async getArtistSchedule(artistId: string): Promise<ActivityResponseDto[]> {
    const activities = await this.artistActivityRepository.getActivitiesByArtist(artistId);
    return this.activityDtoMapper.toResponseList(activities)
  }

  async confirmAttendance(dto: ScheduleArtistDto): Promise<void> {
    // Implementar
  }
}