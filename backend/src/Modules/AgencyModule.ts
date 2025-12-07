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

@Module({
  imports: [
    TypeOrmModule.forFeature([AgencyEntity]),
    ArtistModule,
    ApprenticeModule
  ],
  controllers: [AgencyController],
  providers: [
    AgencyMapper,
    GroupMapper,
    ApprenticeMapper,
    ArtistMapper,
    
    // Repositorio
    {
      provide: IAgencyRepository,
      useClass: AgencyRepositoryImpl,
    },
    
    // DTO Mapper
    AgencyDtoMapper,
    ArtistDtoMapper,
    ApprenticeDtoMapper,
    
    // Servicio
    AgencyService,

    //Casos de uso
    GetAgencyApprenticesUseCase,
    GetAgencyArtistsUseCase,
    GetAgencyGroupsUseCase
  ],
  exports: [IAgencyRepository, AgencyDtoMapper, AgencyMapper],
})
export class AgencyModule {}