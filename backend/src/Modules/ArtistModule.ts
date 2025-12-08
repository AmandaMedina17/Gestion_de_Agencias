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
import { ArtistGroupCollaborationEntity } from "@infrastructure/database/Entities/ArtistGroupCollaborationEntity";
import { GroupModule } from "./GroupModule";
import { ArtistGroupMembershipEntity } from "@infrastructure/database/Entities/ArtistGroupMembershipEntity";
import { GroupMapper } from "@infrastructure/database/Mappers/GroupMapper";
import { GetArtistsWithAgencyChangesAndGroupsUseCase } from "@application/UseCases/get_artists_with_agency_changes_and_groups.use-case";

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity,ContractEntity, ArtistGroupMembershipEntity]),],
  controllers: [ArtistController],
  providers: [
    ArtistMapper,
    ArtistDtoMapper,
    GroupMapper,
    {
      provide: IArtistRepository,
      useClass: ArtistRepository,
    },
    ArtistService,
    GetArtistsWithAgencyChangesAndGroupsUseCase,
  ],
  exports: [IArtistRepository, ArtistDtoMapper, ArtistMapper],
})
export class ArtistModule {}
