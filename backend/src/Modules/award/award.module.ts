import { AwardEntity } from '@infrastructure/database/Entities/AwardEntity';
import { AwardMapper } from '@infrastructure/database/Mappers/AwardMapper';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardController } from '@presentation/Controllers/award/award.controller';

// @Module({
//     imports: [
//       TypeOrmModule.forFeature([AwardEntity])
//     ],
//     controllers: [AwardController],
//     providers: [
//       AwardMapper,
//       {
//         provide:BILLBOARD_LIST_REPOSITORY,    
//         useClass: BillboardListRepository
//       },
//       BillboardListDtoMapper,
//       BillboardListService
//     ],
//     exports: [
//         BILLBOARD_LIST_REPOSITORY
//     ]
//   })
//   export class BillboardListModule {}