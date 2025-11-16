import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { PlaceDtoMapper } from '@application/DTOs/dtoMappers/place.dtoMapper';
import { PlaceService } from '@application/services/place.service';
import { IPlaceRepository } from '@domain/Repositories/IPlaceRepository';
import { PlaceEntity } from '@infrastructure/database/Entities/PlaceEntity';
import { IMapper } from '@infrastructure/database/Mappers/IMapper';
import { PlaceMapper } from '@infrastructure/database/Mappers/PlaceMapper';
import { PlaceRepository } from '@infrastructure/database/Repositories/PlaceRepository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceController } from '@presentation/Controllers/place.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlaceEntity])
  ],
  controllers: [PlaceController],
  providers: [
    {
      provide: IMapper,      
      useClass: PlaceMapper 
    },
    {
      provide: IPlaceRepository,    
      useClass: PlaceRepository
    },
    {
      provide: BaseDtoMapper,    
      useClass: PlaceDtoMapper
    },
    PlaceService
  ],
  exports: [
    IPlaceRepository
  ]
})
export class PlaceModule {}