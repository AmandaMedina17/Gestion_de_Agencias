import { BillboardListDtoMapper } from '@application/DTOs/dtoMappers/billboardList.dto.mapper';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { BillboardListService } from '@application/services/billboard-list/billboard-list.service';
import { BILLBOARD_LIST_REPOSITORY } from '@domain/Repositories/IBillboardListRepository';
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
      {
        provide: IMapper,      
        useClass: BillboardListMapper
      },
      {
        provide:BILLBOARD_LIST_REPOSITORY,    
        useClass: BillboardListRepository
      },
      {
        provide: BaseDtoMapper,    
        useClass: BillboardListDtoMapper
      },
      BillboardListService
    ],
    exports: [
        BILLBOARD_LIST_REPOSITORY
    ]
  })
  export class BillboardListModule {}