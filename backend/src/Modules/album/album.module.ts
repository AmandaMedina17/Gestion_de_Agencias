import { AlbumDtoMapper } from '@application/DTOs/dtoMappers/album.dto.mapper';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { AlbumService } from '@application/services/album/album.service';
import { ALBUM_REPOSITORY } from '@domain/Repositories/IAlbumRepository';
import { AlbumEntity } from '@infrastructure/database/Entities/AlbumEntity';
import { AlbumMapper } from '@infrastructure/database/Mappers/AlbumMapper';
import { IMapper } from '@infrastructure/database/Mappers/IMapper';
import { AlbumRepository } from '@infrastructure/database/Repositories/AlbumRepository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from '@presentation/Controllers/album/album.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity])
  ],
  controllers: [AlbumController],
  providers: [
          
    AlbumMapper,
    {
      provide:ALBUM_REPOSITORY,    
      useClass: AlbumRepository 
    },    
    AlbumDtoMapper,

    AlbumService
  ],
  exports: [
      ALBUM_REPOSITORY
  ]
})
export class AlbumModule {}