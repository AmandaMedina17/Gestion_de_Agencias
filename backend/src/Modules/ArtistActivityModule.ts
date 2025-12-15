import { ArtistActivityEntity } from "@infrastructure/database/Entities/ArtistActivityEntity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistModule } from "./ArtistModule";
import { Activity } from "@domain/Entities/Activity";
import { ActivityModule } from "./ActivityModule";
import { ArtistActivityController } from "@presentation/Controllers/artist-activity.controller";
import { ScheduleArtistUseCase } from "@application/UseCases/schedule-artist.use-case";
import { IArtistActivityRepository } from "@domain/Repositories/IArtistActivityRepository";
import { ArtistActivityRepository } from "@infrastructure/database/Repositories/ArtistActivityRepository";
import { ArtistActivityService } from "@application/services/artist-activity.service";
import { IncomeModule } from "./IncomeModule";
import { ConfirmAttendanceUseCase } from '../ApplicationLayer/UseCases/confirm_attendance.use-case';
import { GroupActivityModule } from "./GroupActivityModule";
import { IGroupActivityRepository } from "@domain/Repositories/IGroupActivityRepository";
import { GroupActivityRepository } from "@infrastructure/database/Repositories/GroupActivityRepository";
import { GroupActivityEntity } from "@infrastructure/database/Entities/GroupActivity";
import { GroupModule } from "./GroupModule";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArtistActivityEntity, GroupActivityEntity,
      ]), ArtistModule,
    ActivityModule,
    IncomeModule,
    GroupModule,
  ],
  controllers: [ArtistActivityController],
  providers: [
    ScheduleArtistUseCase,
    ArtistActivityService,
    {
      provide: IArtistActivityRepository,
      useClass: ArtistActivityRepository
    },
    {
      provide: IGroupActivityRepository,
      useClass: GroupActivityRepository
    },
    ConfirmAttendanceUseCase,
  ],
  exports: [
    IArtistActivityRepository
  ]
})
export class ArtistActivityModule {}