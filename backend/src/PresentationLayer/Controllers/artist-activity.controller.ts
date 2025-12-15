import { ConfirmAttendanceDto } from "@application/DTOs/confirm_attendanceDto/create-confirm-attendance.dto";
import { ArtistIncomeDto } from "@application/DTOs/schedule-artistDto/artist_income.dto";
import { ScheduleArtistDto } from "@application/DTOs/schedule-artistDto/schedule-artist.dto";
import { ArtistActivityService } from "@application/services/artist-activity.service";
import { Body, Controller, Get, Param, Patch, Post, ValidationPipe } from "@nestjs/common";

@Controller('artist-scheduling')
export class ArtistActivityController {
  constructor(
    private readonly artistActivityService : ArtistActivityService,
  ) {}

  @Post('schedule')
  scheduleArtist(@Body(ValidationPipe) scheduleArtistDto: ScheduleArtistDto) {
    return this.artistActivityService.scheduleArtist(scheduleArtistDto)
  }

  @Get(':artistId/activities')
  async getArtistActivities(
    @Param('artistId') artistId: string) {
    return this.artistActivityService.getArtistSchedule(artistId);
  }

  @Post('/incomes')
  async getArtistIncomes(@Body(ValidationPipe) artistIncomeDto: ArtistIncomeDto) {
    return this.artistActivityService.calculateArtistIncomes(artistIncomeDto);
  }

  @Patch('confirm-attendance')
  async confirmAttendance(
    @Body(ValidationPipe) confirmAttendanceDto: ConfirmAttendanceDto
  ) {
    return this.artistActivityService.confirmAttendance(confirmAttendanceDto);
  }
}