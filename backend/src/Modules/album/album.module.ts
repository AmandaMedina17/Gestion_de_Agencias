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
import { SongBillboardRepository } from '@infrastructure/database/Repositories/SonBillboardrepository';
import { SongBillboardEntity } from '@infrastructure/database/Entities/SongBillboardEntity';
import { SongBillBoardMapper } from '@infrastructure/database/Mappers/SongBillboardMapper';
import { SongBillboardDtoMapper } from '@application/DTOs/dtoMappers/song.billboard.dtoMapper';
import { ISongBillboardRepository } from '@domain/Repositories/ISonBillboardRepository';
import { SongBillboardModule } from '../song_billboard/song_billboard.module';
import { SongEntity } from '@infrastructure/database/Entities/SongEntity';
import { SongDtoMapper } from '@application/DTOs/dtoMappers/song.dto.mapper';
import { BillboardListMapper } from '@infrastructure/database/Mappers/BillboardListMapper';
import { BillboardListDtoMapper } from '@application/DTOs/dtoMappers/billboardList.dto.mapper';
import { Song } from '@domain/Entities/Song';

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