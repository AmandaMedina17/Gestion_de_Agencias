import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from '@entities/ArtistEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ArtistMapper } from 'src/InfraestructureLayer/database/Mappers/ArtistMapper';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { ArtistRepository} from 'src/InfraestructureLayer/database/Repositories/ArtistRepository';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dto';
import { ArtistController } from '@presentation/controllers/artist.controller';
import { ArtistService } from '../ApplicationLayer/services/artist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistEntity])
  ],
  controllers: [ArtistController],
  providers: [
    {
      provide: IMapper,      
      useClass: ArtistMapper   
    },
    {
      provide: IArtistRepository,      
      useClass: ArtistRepository  
    },
    {
      provide: BaseDtoMapper,
      useClass:ArtistDtoMapper
    },
    ArtistService
  ],
  exports: [
    IArtistRepository 
  ]
})
export class ArtistModule {}
