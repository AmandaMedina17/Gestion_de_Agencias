// src/PresentationLayer/Modules/AgencyModule.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgencyEntity } from "../InfraestructureLayer/database/Entities/AgencyEntity";
import { IMapper } from "../InfraestructureLayer/database/Mappers/IMapper";
import { AgencyMapper } from "../InfraestructureLayer/database/Mappers/AgencyMapper";
import { IAgencyRepository } from "../DomainLayer/Repositories/IAgencyRepository";
import { AgencyRepositoryImpl } from "../InfraestructureLayer/database/Repositories/AgencyRepository";
import { AgencyController } from "../PresentationLayer/Controllers/agency.controller";
import { AgencyService } from '@application/services/agency.service';
import { AgencyDtoMapper } from "@application/DTOs/dtoMappers/agency.dtoMapper";
import { ApprenticeMapper } from "@infrastructure/database/Mappers/ApprenticeMapper";
import { ArtistMapper } from "@infrastructure/database/Mappers/ArtistMapper";
import { GroupMapper } from "@infrastructure/database/Mappers/GroupMapper";
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dtoMapper";
import { ArtistModule } from "./ArtistModule";
import { GetAgencyApprenticesUseCase } from "@application/UseCases/get_agency_apprentices.use-case";
import { GetAgencyArtistsUseCase } from "@application/UseCases/get_agency_artists.use-case";
import { ApprenticeModule } from "./ApprenticeModule";
import { ApprenticeDtoMapper } from "@application/DTOs/dtoMappers/apprentice.dtoMapper";
import { GetAgencyGroupsUseCase } from "@application/UseCases/get_agency_groups.use-case";
import { ArtistAgencyMembershipEntity } from "@infrastructure/database/Entities/ArtistAgencyMembershipEntity";
import { RelateArtistToAgencyUseCase } from "@application/UseCases/relate_artist_to_agency.use-case.ts";
import { ArtistEntity } from "@infrastructure/database/Entities/ArtistEntity";
import { GroupDtoMapper } from "@application/DTOs/dtoMappers/group.dtoMapper";
import { GroupModule } from "./GroupModule";
import { ArtistGroupMembershipEntity } from "@infrastructure/database/Entities/ArtistGroupMembershipEntity";
import { GetArtistsWithDebutUseCase } from "@application/UseCases/get_artists_with_debut.use-case";
import { Contract } from "@domain/Entities/Contract";
import { ContractModule } from "./ContractModule";
import { ContractDtoMapper } from "@application/DTOs/dtoMappers/contract.dtoMapper";
import { ContractEntity } from "@infrastructure/database/Entities/ContractEntity";
import { ContractMapper } from "@infrastructure/database/Mappers/ContractMapper";
import { IContractRepository } from "@domain/Repositories/IContractRepository";
import { ContractRepositoryImpl } from "@infrastructure/database/Repositories/ContractRepository";
import { GetAgencyCollaborationsUseCase } from '../ApplicationLayer/UseCases/get_agency_collaborations.use-case';
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { GroupRepository } from "@infrastructure/database/Repositories/GroupRepository";
import { GroupEntity } from "@infrastructure/database/Entities/GroupEntity";
import { RemoveArtistFromAgencyUseCase } from "@application/UseCases/remove_artist_from_agency.use-case";

@Module({
  imports: [
    TypeOrmModule.forFeature([AgencyEntity, ArtistAgencyMembershipEntity, ArtistEntity, ContractEntity, GroupEntity, ArtistGroupMembershipEntity]),
    ArtistModule,
    ApprenticeModule, 
  ],
  controllers: [AgencyController],
  providers: [
    AgencyMapper,
    GroupMapper,
    ApprenticeMapper,
    ArtistMapper,
    ContractMapper,
    
    // Repositorio
    {
      provide: IAgencyRepository,
      useClass: AgencyRepositoryImpl,
    },
    {
      provide: IContractRepository,
      useClass: ContractRepositoryImpl,
    },
    {
      provide: IGroupRepository,
      useClass: GroupRepository,
    },
    // DTO Mapper
    AgencyDtoMapper,
    ArtistDtoMapper,
    ApprenticeDtoMapper,
    GroupDtoMapper,
    ContractDtoMapper,
    
    // Servicio
    AgencyService,

    //Casos de uso
    GetAgencyApprenticesUseCase,
    GetAgencyArtistsUseCase,
    GetAgencyGroupsUseCase,
    RelateArtistToAgencyUseCase,
    GetArtistsWithDebutUseCase,
    GetAgencyCollaborationsUseCase,
    RemoveArtistFromAgencyUseCase,
  ],
  exports: [IAgencyRepository, AgencyDtoMapper, AgencyMapper],
})
export class AgencyModule {}