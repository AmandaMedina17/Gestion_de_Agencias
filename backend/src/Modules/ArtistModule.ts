import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistEntity } from "@infrastructure/database/Entities/ArtistEntity";
import { ArtistMapper } from "@infrastructure/database/Mappers/ArtistMapper";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { ArtistRepository } from "../InfraestructureLayer/database/Repositories/ArtistRepository";
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dtoMapper";
import { ArtistController } from "@presentation/Controllers/artist.controller";
import { ArtistService } from "../ApplicationLayer/services/artist.service";
import { ContractEntity } from "@infrastructure/database/Entities/ContractEntity";
import { ArtistGroupMembershipEntity } from "@infrastructure/database/Entities/ArtistGroupMembershipEntity";
import { GroupMapper } from "@infrastructure/database/Mappers/GroupMapper";
import { GetArtistsWithAgencyChangesAndGroupsUseCase } from "@application/UseCases/get_artists_with_agency_changes_and_groups.use-case";
import { ActivityEntity } from "@infrastructure/database/Entities/ActivityEntity";
import { ArtistActivityEntity } from "@infrastructure/database/Entities/ArtistActivityEntity";
import { IContractRepository } from "@domain/Repositories/IContractRepository";
import { IArtistActivityRepository } from "@domain/Repositories/IArtistActivityRepository";
import { ArtistActivityRepository } from "@infrastructure/database/Repositories/ArtistActivityRepository";
import { GroupDtoMapper } from "@application/DTOs/dtoMappers/group.dtoMapper";
import { ActivityDtoMapper } from "@application/DTOs/dtoMappers/activity.dtoMapper";
import { ContractDtoMapper } from "@application/DTOs/dtoMappers/contract.dtoMapper";
import { ContractRepositoryImpl } from "@infrastructure/database/Repositories/ContractRepository";
import { AgencyDtoMapper } from "@application/DTOs/dtoMappers/agency.dtoMapper";
import { ResponsibleDtoMapper } from "@application/DTOs/dtoMappers/responsible.dtoMapper";
import { PlaceDtoMapper } from "@application/DTOs/dtoMappers/place.dtoMapper";
import { AgencyEntity } from "@infrastructure/database/Entities/AgencyEntity";
import { ContractMapper } from "@infrastructure/database/Mappers/ContractMapper";
import { AgencyMapper } from "@infrastructure/database/Mappers/AgencyMapper";
import { ActivityMapper } from "@infrastructure/database/Mappers/ActivityMapper";
import { ResponsibleMapper } from "@infrastructure/database/Mappers/ResponsibleMapper";
import { PlaceMapper } from "@infrastructure/database/Mappers/PlaceMapper";
import { AlbumMapper } from "@infrastructure/database/Mappers/AlbumMapper";
import { ArtistCollaborationEntity } from "@infrastructure/database/Entities/ArtistCollaborationEntity";
import { ArtistGroupCollaborationEntity } from "@infrastructure/database/Entities/ArtistGroupCollaborationEntity";
import { GroupRepository } from "@infrastructure/database/Repositories/GroupRepository";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { GroupEntity } from "@infrastructure/database/Entities/GroupEntity";
import { CreateArtistCollaborationUseCase } from '../ApplicationLayer/UseCases/create_artist_collaboration.use-case';
import { CreateArtistGroupCollaborationUseCase } from "@application/UseCases/create_artist_group_collaboration.use-case";
import { CreateArtistUseCase } from "@application/UseCases/create_artist.use-case";
import { ApprenticeModule } from "./ApprenticeModule";
import { GetProfessionalHistoryUseCase } from "@application/UseCases/get_artist_professional_history.use-case";
import { IncomeModule } from "./IncomeModule";
import { GetArtistContractsUseCase } from "@application/UseCases/get_artist_contracts.use-case";
import { GetArtistMainHitsUseCase } from "@application/UseCases/get_artist_main-hits.use-case";
import { AlbumModule } from "./album/album.module";
import { AwardModule } from "./award/award.module";
import { AlbumService } from "@application/services/album/album.service";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { AlbumRepository } from "@infrastructure/database/Repositories/AlbumRepository";
import { AlbumEntity } from "@infrastructure/database/Entities/AlbumEntity";
import { SongEntity } from "@infrastructure/database/Entities/SongEntity";
import { AwardEntity } from "@infrastructure/database/Entities/AwardEntity";

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity,ContractEntity, ArtistGroupMembershipEntity, ActivityEntity,ArtistActivityEntity,AgencyEntity, ArtistCollaborationEntity,ArtistGroupCollaborationEntity, GroupEntity]), 
  ApprenticeModule,
  IncomeModule,
  forwardRef((() => AlbumModule))
],
  controllers: [ArtistController],
  providers: [
    ArtistMapper,
    ArtistDtoMapper,
    GroupMapper,
    ContractMapper,
    AgencyMapper,
    ActivityMapper,
    ResponsibleMapper,
    PlaceMapper,
    ContractDtoMapper,
    ActivityDtoMapper,
    GroupDtoMapper,
    AgencyDtoMapper,
    ResponsibleDtoMapper,
    PlaceDtoMapper,
    {
      provide: IArtistRepository,
      useClass: ArtistRepository,
    },
    {
      provide: IGroupRepository,
      useClass: GroupRepository,
    },
    {
      provide: IContractRepository,
      useClass: ContractRepositoryImpl,
    },
    {
      provide: IArtistActivityRepository,
      useClass: ArtistActivityRepository,
    },
  
    ArtistService,
    GetArtistsWithAgencyChangesAndGroupsUseCase,
    CreateArtistCollaborationUseCase,
    CreateArtistGroupCollaborationUseCase,
    CreateArtistUseCase,
    GetProfessionalHistoryUseCase,
    GetArtistMainHitsUseCase
  ],
  exports: [IArtistRepository, ArtistDtoMapper, ArtistMapper],
})
export class ArtistModule {}