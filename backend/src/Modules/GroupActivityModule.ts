import { GroupActivityEntity } from "@infrastructure/database/Entities/GroupActivity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityModule } from "./ActivityModule";
import { GroupModule } from "./GroupModule";
import { GroupActivityController } from "@presentation/Controllers/group-activity.controller";
import { ScheduleGroupUseCase } from "@application/UseCases/schedule-group.use-case";
import { GroupActivityService } from "@application/services/group-activity.service";
import { IGroupActivityRepository } from "@domain/Repositories/IGroupActivityRepository";
import { GroupActivityRepository } from "@infrastructure/database/Repositories/GroupActivityRepository";
import { ArtistActivityModule } from "./ArtistActivityModule";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupActivityEntity,
      ]),   
    GroupModule,
    ActivityModule,
    ArtistActivityModule
  ],
  controllers: [GroupActivityController],
  providers: [
    ScheduleGroupUseCase,
    GroupActivityService,
    {
      provide: IGroupActivityRepository,
      useClass: GroupActivityRepository
    }
  ],
  exports: [
    IGroupActivityRepository
  ]
})
export class GroupActivityModule {}