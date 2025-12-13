import { BillboardListDtoMapper } from '@application/DTOs/dtoMappers/billboardList.dto.mapper';
import { SongDtoMapper } from '@application/DTOs/dtoMappers/song.dto.mapper';
import { ISongBillboardRepository } from '@domain/Repositories/ISonBillboardRepository';
import { SongBillboardService } from '@application/services/song_billboard/song_billboard.service';
import { AddSongToBillboardUseCase } from '@application/UseCases/add_song_billboard_use_case';
import { IBillboardRepository } from '@domain/Repositories/IBillboardListRepository';
import { ISongRepository } from '@domain/Repositories/ISongRepository';
import { BillboardListEntity } from '@infrastructure/database/Entities/BillboardListEntity';
import { SongBillboardEntity } from '@infrastructure/database/Entities/SongBillboardEntity';
import { SongEntity } from '@infrastructure/database/Entities/SongEntity';
import { BillboardListMapper } from '@infrastructure/database/Mappers/BillboardListMapper';
import { SongBillBoardMapper } from '@infrastructure/database/Mappers/SongBillboardMapper';
import { SongMapper } from '@infrastructure/database/Mappers/SongMapper';
import { BillboardListRepository } from '@infrastructure/database/Repositories/BillboardListRepository';
import { SongBillboardRepository } from '@infrastructure/database/Repositories/SonBillboardrepository';
import { SongRepository } from '@infrastructure/database/Repositories/SongRepository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongBillboardController } from '@presentation/Controllers/song_billboard/song_billboard.controller';
import { SongBillboardDtoMapper } from '@application/DTOs/dtoMappers/song.billboard.dtoMapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([SongEntity,BillboardListEntity,SongBillboardEntity]), 
  ],
  controllers: [SongBillboardController],
  providers: [
    SongBillboardService,
    SongBillBoardMapper,
    SongBillboardDtoMapper,
    SongDtoMapper,
    SongMapper,
    BillboardListMapper,
    BillboardListDtoMapper,
    {
      provide : IBillboardRepository,
      useClass : BillboardListRepository
    },
    {
      provide : ISongBillboardRepository,
      useClass : SongBillboardRepository
    },
    {
      provide : ISongRepository,
      useClass : SongRepository
    },
    AddSongToBillboardUseCase

  ],
  exports: [
      AddSongToBillboardUseCase,
      ISongBillboardRepository,
    
  ]
})
export class SongBillboardModule {}
