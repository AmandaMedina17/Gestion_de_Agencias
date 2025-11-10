import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from '@entities/ArtistEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ArtistMapper } from 'src/InfraestructureLayer/database/Mappers/ArtistMapper';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { ArtistRepositoryImpl} from 'src/InfraestructureLayer/database/Repositories/ArtistRepository';
import {ArtistController } from '@presentation/Controllers/ArtistController';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistEntity])
  ],
  controllers: [ArtistController],
  providers: [
    {
      provide: IMapper,      // ✅ Interfaz como token
      useClass: ArtistMapper   // ✅ Implementación concreta
    },
    {
      provide: IArtistRepository,      // ✅ Interfaz como token
      useClass: ArtistRepositoryImpl   // ✅ Implementación concreta
    }
  ],
  exports: [
    IArtistRepository 
  ]
})
export class ArtistModule {}
