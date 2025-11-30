// src/PresentationLayer/Modules/AgencyModule.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgencyEntity } from "@infrastructure/database/Entities/AgencyEntity";
import { AgencyMapper } from "@infrastructure/database/Mappers/AgencyMapper";
import { GroupMapper } from "@infrastructure/database/Mappers/GroupMapper";
import { ApprenticeMapper } from "@infrastructure/database/Mappers/ApprenticeMapper";
import { ArtistMapper } from "@infrastructure/database/Mappers/ArtistMapper";
import { IAgencyRepository } from "@domain/Repositories/IAgencyRepository";
import { AgencyRepositoryImpl } from "@infrastructure/database/Repositories/AgencyRepository";
import { AgencyController } from "@presentation/Controllers/agency.controller";
import { AgencyService } from "@application/services/agency.service";
import { AgencyDtoMapper } from "@application/DTOs/dtoMappers/agency.dtoMapper";

@Module({
  imports: [TypeOrmModule.forFeature([AgencyEntity])],
  controllers: [AgencyController],
  providers: [
    AgencyMapper,
    GroupMapper,
    ApprenticeMapper,
    ArtistMapper,
    
    // Repositorio (igual que en ActivityModule)
    {
      provide: IAgencyRepository,
      useClass: AgencyRepositoryImpl,
    },
    
    // DTO Mapper (igual que en ActivityModule)
    AgencyDtoMapper,
    
    // Servicio
    AgencyService,
  ],
  exports: [IAgencyRepository],
})
export class AgencyModule {}