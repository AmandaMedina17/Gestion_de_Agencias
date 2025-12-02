import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { SongDtoMapper } from '@application/DTOs/dtoMappers/song.dto.mapper';
import { SongService } from '@application/services/song/song.service';
import { SONG_REPOSITORY } from '@domain/Repositories/ISongRepository';
import { SongEntity } from '@infrastructure/database/Entities/SongEntity';
import { IMapper } from '@infrastructure/database/Mappers/IMapper';
import { SongMapper } from '@infrastructure/database/Mappers/SongMapper';
import { SongRepository } from '@infrastructure/database/Repositories/SongRepository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongController } from '@presentation/Controllers/song/song.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SongEntity])
  ],
  controllers: [SongController],
  providers: [
         
    SongMapper,
    {
      provide:SONG_REPOSITORY,    
      useClass: SongRepository 
    },
    
    SongDtoMapper,

    SongService
  ],
  exports: [
      SONG_REPOSITORY
  ]
})
export class SongModule {}