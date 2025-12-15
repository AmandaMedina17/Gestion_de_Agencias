import { Inject, Injectable } from '@nestjs/common';
import { ScheduleArtistUseCase } from '@application/UseCases/schedule-artist.use-case';
import { ScheduleArtistDto } from '@application/DTOs/schedule-artistDto/schedule-artist.dto';
import { IArtistActivityRepository } from '@domain/Repositories/IArtistActivityRepository';
import { ActivityResponseDto } from '@application/DTOs/activityDto/response-activity.dto';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';
import { Income } from '@domain/Entities/Income';
import { ArtistIncomeDto } from '@application/DTOs/schedule-artistDto/artist_income.dto';
import { ConfirmAttendanceDto } from '@application/DTOs/confirm_attendanceDto/create-confirm-attendance.dto';
import { ConfirmAttendanceUseCase } from '@application/UseCases/confirm_attendance.use-case';

@Injectable()
export class ArtistActivityService {
  constructor(
    @Inject(IArtistActivityRepository)
    private readonly artistActivityRepository: IArtistActivityRepository,
    private readonly scheduleArtistUseCase: ScheduleArtistUseCase,
    private readonly activityDtoMapper: ActivityDtoMapper,
    private readonly confirmAttendanceUseCase: ConfirmAttendanceUseCase,
  ) {}

  async scheduleArtist(dto: ScheduleArtistDto): Promise<void> {
    return await this.scheduleArtistUseCase.execute(dto);
  }

  async getArtistSchedule(artistId: string): Promise<ActivityResponseDto[]> {
    const activities = await this.artistActivityRepository.getActivitiesByArtist(artistId);
    return this.activityDtoMapper.toResponseList(activities)
  }

  async calculateArtistIncomes(artistIncomeDto: ArtistIncomeDto)
  : Promise<{ incomes: Income[]; totalIncome: number }> 
  {
    return this.artistActivityRepository.calculateArtistIncomes(artistIncomeDto.artistId, artistIncomeDto.start_date, artistIncomeDto.end_date)
  }

  async confirmAttendance(confirmAttendanceDto: ConfirmAttendanceDto): Promise<void> {
    return await this.confirmAttendanceUseCase.execute(confirmAttendanceDto);
  }
}