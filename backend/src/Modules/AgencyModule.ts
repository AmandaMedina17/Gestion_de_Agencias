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