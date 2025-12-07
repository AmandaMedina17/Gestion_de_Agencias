import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistEntity } from "@infrastructure/database/Entities/ArtistEntity";
import { IMapper } from "@infrastructure/database/Mappers/IMapper";
import { ArtistMapper } from "@infrastructure/database/Mappers/ArtistMapper";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { ArtistRepository } from "../InfraestructureLayer/database/Repositories/ArtistRepository";
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dtoMapper";
import { ArtistController } from "@presentation/Controllers/artist.controller";
import { ArtistService } from "../ApplicationLayer/services/artist.service";
import { ContractEntity } from "@infrastructure/database/Entities/ContractEntity";

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity,ContractEntity])],
  controllers: [ArtistController],
  providers: [
    ArtistMapper,
    ArtistDtoMapper,
    {
      provide: IArtistRepository,
      useClass: ArtistRepository,
    },
    ArtistService,
  ],
  exports: [IArtistRepository, ArtistDtoMapper, ArtistMapper],
})
export class ArtistModule {}
