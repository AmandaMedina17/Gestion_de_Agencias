import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistEntity } from "@infrastructure/database/Entities/ArtistEntity";
import { IMapper } from "@infrastructure/database/Mappers/IMapper";
import { ArtistMapper } from "@infrastructure/database/Mappers/ArtistMapper";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { ArtistRepository } from "../InfraestructureLayer/database/Repositories/ArtistRepository";
import { BaseDtoMapper } from "@application/DTOs/dtoMappers/DtoMapper";
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dto";
import { ArtistController } from "@presentation/Controllers/artist.controller";
import { ArtistService } from "../ApplicationLayer/services/artist.service";
import { ContractEntity } from "@infrastructure/database/Entities/ContractEntity";
import { ContractMapper } from "@infrastructure/database/Mappers/ContractMapper";
import { AgencyMapper } from "@infrastructure/database/Mappers/AgencyMapper";
import { ContractDtoMapper } from "@application/DTOs/dtoMappers/contract.dtoMapper";
import { AgencyDtoMapper } from "@application/DTOs/dtoMappers/agency.dtoMapper";
import { ContractModule } from "./ContractModule";
import { GetArtistsWithAgencyChangesAndGroupsUseCase } from "@application/UseCases/get_artists_with_agency_changes_and_groups.use-case";

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
    GetArtistsWithAgencyChangesAndGroupsUseCase,
  ],
  exports: [IArtistRepository, ArtistDtoMapper, ArtistMapper], //quiza necesito exportar GetArtistsWithAgencyChangesAndGroupsUseCase
})
export class ArtistModule {}
