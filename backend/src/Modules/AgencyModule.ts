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
import { ArtistModule } from "./ArtistModule";
import { ApprenticeModule } from "./ApprenticeModule";

@Module({
  imports: [TypeOrmModule.forFeature([AgencyEntity]),
  ArtistModule,
  ApprenticeModule],
  controllers: [AgencyController],
  providers: [
    AgencyMapper,
    GroupMapper, //importar el modulo
    {
      provide: IAgencyRepository,
      useClass: AgencyRepositoryImpl,
    },
    AgencyDtoMapper,
    AgencyService,
  ],
  exports: [IAgencyRepository, AgencyDtoMapper, AgencyMapper],
})
export class AgencyModule {}