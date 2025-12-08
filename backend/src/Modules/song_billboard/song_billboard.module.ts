import { ISongBillboardRepository } from '@application/Repositories/ISonBillboardRepository';
import { SongBillboardService } from '@application/services/song_billboard/song_billboard.service';
import { AddSongToBillboardUseCase } from '@application/UseCases/add_song_billboard_use_case';
import { BillboardListEntity } from '@infrastructure/database/Entities/BillboardListEntity';
import { SongBillboardEntity } from '@infrastructure/database/Entities/SongBillboardEntity';
import { SongEntity } from '@infrastructure/database/Entities/SongEntity';
import { SongBillBoardMapper } from '@infrastructure/database/Mappers/SongBillBoardMapper';
import { SongBillboardRepository } from '@infrastructure/database/Repositories/SonBillboardrepository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongBillboardController } from '@presentation/Controllers/song_billboard/song_billboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SongEntity,BillboardListEntity,SongBillboardEntity]), 
  ],
  controllers: [SongBillboardController],
  providers: [
    SongBillboardService,
    SongBillBoardMapper,
    {
      provide : ISongBillboardRepository,
      useClass : SongBillboardRepository
    },
    AddSongToBillboardUseCase
  ],
  exports: [
      AddSongToBillboardUseCase,
      ISongBillboardRepository,
      SongBillBoardMapper, 
  ]
})
export class SongBillboardModule {}
