import { ScheduleArtistDto } from "@application/DTOs/schedule-artistDto/schedule-artist.dto";
import { ArtistActivityService } from "@application/services/artist-activity.service";
import { Body, Controller, Get, Param, Post, ValidationPipe } from "@nestjs/common";

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
}