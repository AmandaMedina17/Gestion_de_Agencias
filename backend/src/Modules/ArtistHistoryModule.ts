import { Module } from '@nestjs/common';
import { ArtistsHistoryService } from '@application/services/artist-history.service';
import { ArtistHistoryController } from '@presentation/Controllers/artists.history.controller';
import { IArtistHistoryRepository } from '@domain/Repositories/IArtistHistoryRepository';
import { ArtistHistoryRepository } from '@infrastructure/database/Repositories/ArtistHistoryRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from '@domain/Entities/Artist';
import { Contract } from '@domain/Entities/Contract';
import { Album } from '@domain/Entities/Album';
import { Group } from '@domain/Entities/Group';
import { ArtistModule } from './ArtistModule';
import { ContractModule } from './ContractModule';
import { AlbumModule } from './album/album.module';
import { GroupDtoMapper } from '@application/DTOs/dtoMappers/group.dtoMapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Artist,
      Contract,
      Album,
      Group
    ]),
    ArtistModule,
    ContractModule,
    AlbumModule
  ],
  controllers: [ArtistHistoryController],
  providers: [
    ArtistsHistoryService,
    GroupDtoMapper,
    {
      provide: IArtistHistoryRepository,
      useClass: ArtistHistoryRepository
    },
  ],
  exports: [ArtistsHistoryService]
})
export class ArtistHistoryModule {}