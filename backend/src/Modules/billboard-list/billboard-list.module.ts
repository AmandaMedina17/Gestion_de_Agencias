import { BillboardListDtoMapper } from '@application/DTOs/dtoMappers/billboardList.dto.mapper';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { BillboardListService } from '@application/services/billboard-list/billboard-list.service';
import { IBillboardRepository } from '@domain/Repositories/IBillboardListRepository';
import { IRepository } from '@domain/Repositories/IRepository';
import { BillboardListEntity } from '@infrastructure/database/Entities/BillboardListEntity';
import { BillboardListMapper } from '@infrastructure/database/Mappers/BillboardListMapper';
import { IMapper } from '@infrastructure/database/Mappers/IMapper';
import { BillboardListRepository } from '@infrastructure/database/Repositories/BillboardListRepository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillboardListController } from '@presentation/Controllers/billboard-list/billboard-list.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([BillboardListEntity])
    ],
    controllers: [BillboardListController],
    providers: [
      BillboardListMapper,
      {
        provide:IBillboardRepository,    
        useClass: BillboardListRepository
      },
      BillboardListDtoMapper,
      BillboardListService
    ],
    exports: [
        IBillboardRepository
    ]
  })
  export class BillboardListModule {}