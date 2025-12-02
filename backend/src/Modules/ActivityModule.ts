import { Module } from '@nestjs/common';
import { ActivityService } from '@application/services/activity.service';
import { ActivityController } from '@presentation/Controllers/activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityMapper } from '@infrastructure/database/Mappers/ActivityMapper';
import { IActivityRepository } from '@domain/Repositories/IActivityRepository';
import { ActivityRepository } from '../InfraestructureLayer/database/Repositories/ActivityRepository';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';
import { ActivityEntity } from '@infrastructure/database/Entities/ActivityEntity';
import { ActivityResponsibleEntity } from '@infrastructure/database/Entities/ActivityResponsibleEntity';
import { ActivityPlaceEntity } from '@infrastructure/database/Entities/ActivityPlaceEntity';
import { ActivityDateEntity } from '@infrastructure/database/Entities/ActivityDateEntity';
import { ResponsibleModule } from './ResponsibleModule';
import { PlaceModule } from './PlaceModule';
import { CreateActivityUseCase } from '@application/UseCases/create_activity.use-case';
import { UpdateActivityUseCase } from '@application/UseCases/update_activity.use-case';

@Module({
  imports: [
      TypeOrmModule.forFeature([ActivityEntity, 
      ActivityResponsibleEntity, 
      ActivityPlaceEntity,
      ActivityDateEntity]),
      ResponsibleModule,
      PlaceModule
  ],
  controllers: [ActivityController],
  providers: [
    ActivityMapper,
    {
      provide: IActivityRepository,
      useClass: ActivityRepository
    },
    ActivityDtoMapper,
    ActivityService, 
    CreateActivityUseCase,
    UpdateActivityUseCase
  ],
  exports:[IActivityRepository]

})
export class ActivityModule {}
