import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { SongService } from '@application/services/song/song.service';
import { CreateSongUseCase } from '@application/UseCases/create_song.use-case';
import { ISongRepository } from '@domain/Repositories/ISongRepository';
import { SongEntity } from '@infrastructure/database/Entities/SongEntity';
import { SongMapper } from '@infrastructure/database/Mappers/SongMapper';
import { SongRepository } from '@infrastructure/database/Repositories/SongRepository';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongController } from '@presentation/Controllers/song/song.controller';
import { AlbumModule } from '../album/album.module';
import { UpdateSongUseCase } from '@application/UseCases/update_song.use-case';
import { AlbumMapper } from '@infrastructure/database/Mappers/AlbumMapper';
import { IAlbumRepository } from '@domain/Repositories/IAlbumRepository';
import { AlbumRepository } from '@infrastructure/database/Repositories/AlbumRepository';
import { AlbumEntity } from '@infrastructure/database/Entities/AlbumEntity';
import { SongDtoMapper } from '@application/DTOs/dtoMappers/song.dto.mapper';
import { SongBillboardModule } from '../song_billboard/song_billboard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SongEntity,AlbumEntity]), 
  ],
  controllers: [SongController],
  providers: [
    AlbumMapper,
    SongMapper,
    {
      provide : IAlbumRepository,
      useClass : AlbumRepository
    },
    {
      provide: ISongRepository,    
      useClass: SongRepository 
    },
    SongDtoMapper,
    SongService,
    CreateSongUseCase,
    UpdateSongUseCase
  ],
  exports: [
      ISongRepository,
      SongMapper
  ]
})
export class SongModule {}