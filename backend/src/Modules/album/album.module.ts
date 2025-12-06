import { AlbumDtoMapper } from '@application/DTOs/dtoMappers/album.dto.mapper';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { AlbumService } from '@application/services/album/album.service';
import { IAlbumRepository } from '@domain/Repositories/IAlbumRepository';
import { AlbumEntity } from '@infrastructure/database/Entities/AlbumEntity';
import { AlbumMapper } from '@infrastructure/database/Mappers/AlbumMapper';
import { IMapper } from '@infrastructure/database/Mappers/IMapper';
import { SongMapper } from '@infrastructure/database/Mappers/SongMapper';
import { AlbumRepository } from '@infrastructure/database/Repositories/AlbumRepository';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from '@presentation/Controllers/album/album.controller';
import { SongModule } from '../song/song.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity]),
  ],
  controllers: [AlbumController],
  providers: [ 
    SongMapper,
    AlbumMapper,
    {
      provide: IAlbumRepository,    
      useClass: AlbumRepository 
    },    
    AlbumDtoMapper,
    AlbumService
  ],
  exports: [
      IAlbumRepository
  ]
})
export class AlbumModule {}