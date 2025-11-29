import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgencyEntity } from "../InfraestructureLayer/database/Entities/AgencyEntity";
import { IMapper } from "../InfraestructureLayer/database/Mappers/IMapper";
import { AgencyMapper } from "../InfraestructureLayer/database/Mappers/AgencyMapper";
import { IAgencyRepository } from "../DomainLayer/Repositories/IAgencyRepository";
import { AgencyRepositoryImpl } from "../InfraestructureLayer/database/Repositories/AgencyRepository";
import { AgencyController } from "../PresentationLayer/Controllers/agency.controller";
import { AgencyService } from '@application/services/agency.service';
import { BaseDtoMapper } from "@application/DTOs/dtoMappers/DtoMapper";
import { AgencyDtoMapper } from "@application/DTOs/dtoMappers/agency.dtoMapper";

@Module({
  imports: [TypeOrmModule.forFeature([AgencyEntity])],
  controllers: [AgencyController],
  providers: [
    {
      provide: IMapper,
      useClass: AgencyMapper, 
    },
    {
      provide: IAgencyRepository,
      useClass: AgencyRepositoryImpl,
    },
    {
      provide: BaseDtoMapper,
      useClass: AgencyDtoMapper,
    },
    AgencyService,
  ],
  exports: [IAgencyRepository],
})
export class AgencyModule {}

