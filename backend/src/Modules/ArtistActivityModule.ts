import { ArtistActivityEntity } from "@infrastructure/database/Entities/ArtistActivityEntity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistModule } from "./ArtistModule";
import { Activity } from "@domain/Entities/Activity";
import { ActivityModule } from "./ActivityModule";
import { ArtistActivityController } from "@presentation/Controllers/artistactivity.controller";
import { ScheduleArtistUseCase } from "@application/UseCases/schedule-artist.use-case";
import { IArtistActivityRepository } from "@domain/Repositories/IArtistActivityRepository";
import { ArtistActivityRepository } from "@infrastructure/database/Repositories/ArtistActivityRepository";
import { ArtistActivityService } from "@application/services/artist-scheduling.service.";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArtistActivityEntity,
      ]), ArtistModule,
    ActivityModule
  ],
  controllers: [ArtistActivityController],
  providers: [
    ScheduleArtistUseCase,
    ArtistActivityService,
    {
      provide: IArtistActivityRepository,
      useClass: ArtistActivityRepository
    }
  ],
  exports: [
    IArtistActivityRepository
  ]
})
export class ArtistActivityModule {}