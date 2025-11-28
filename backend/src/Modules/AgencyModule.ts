import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgencyEntity } from "../InfraestructureLayer/database/Entities/AgencyEntity";
import { IMapper } from "../InfraestructureLayer/database/Mappers/IMapper";
import { AgencyMapper } from "../InfraestructureLayer/database/Mappers/AgencyMapper";
import { IAgencyRepository } from "../DomainLayer/Repositories/IAgencyRepository";
import { AgencyRepositoryImpl } from "../InfraestructureLayer/database/Repositories/AgencyRepository";
import { AgencyController } from "../PresentationLayer/Controllers/agency.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AgencyEntity])],
  controllers: [AgencyController],
  providers: [
    {
      provide: IMapper, // ✅ Interfaz como token
      useClass: AgencyMapper, // ✅ Implementación concreta
    },
    {
      provide: IAgencyRepository, // ✅ Interfaz como token
      useClass: AgencyRepositoryImpl, // ✅ Implementación concreta
    },
  ],
  exports: [IAgencyRepository],
})
export class AgencyModule {}

// // AgencyModule.ts  OTRA VERSION
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AgencyEntity } from '@entities/AgencyEntity';
// import { AgencyMapper } from 'src/InfraestructureLayer/database/Mappers/AgencyMapper';
// import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
// import { AgencyRepositoryImpl } from 'src/InfraestructureLayer/database/Repositories/AgencyRepository';
// import { AgencyController } from '@presentation/Controllers/AgencyController';
// import { AgencyService } from '@application/services/AgencyService';
// import { ApprenticeMapper } from '../Mappers/ApprenticeMapper';
// import { ArtistMapper } from '../Mappers/ArtistMapper';
// import { GroupMapper } from '../Mappers/GroupMapper';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([AgencyEntity])
//   ],
//   controllers: [AgencyController],
//   providers: [
//     AgencyMapper,
//     ApprenticeMapper,
//     ArtistMapper,
//     GroupMapper,
//     {
//       provide: 'IAgencyRepository',
//       useClass: AgencyRepositoryImpl
//     },
//     AgencyService
//   ],
//   exports: [
//     'IAgencyRepository',
//     AgencyService
//   ]
// })
// export class AgencyModule {}
