import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from '@infrastructure/database/Entities/ContractEntity';
import { IMapper } from '@infrastructure/database/Mappers/IMapper';
import { ContractMapper } from '@infrastructure/database/Mappers/ContractMapper';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { ContractRepositoryImpl} from '@infrastructure/database/Repositories/ContractRepository';
import { ContractController } from '@presentation/Controllers/contract.controller';
import { BaseDtoMapper } from "@application/DTOs/dtoMappers/DtoMapper";
import { ContractDtoMapper } from "@application/DTOs/dtoMappers/contract.dtoMapper";
import { ContractService} from "../ApplicationLayer/services/contract.service";
import { CreateContractUseCase } from '@domain/UseCases/create_contract.uso-case';
import { UpdateContractStatusUseCase } from '@domain/UseCases/update_contract_status.use-case';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dto';
import { AgencyDtoMapper } from '@application/DTOs/dtoMappers/agency.dtoMapper';
import { ArtistModule } from './ArtistModule';
import { AgencyModule } from './AgencyModule';
import { AgencyMapper } from '@infrastructure/database/Mappers/AgencyMapper';
import { ArtistMapper } from '@infrastructure/database/Mappers/ArtistMapper';
import { AgencyEntity } from '@infrastructure/database/Entities/AgencyEntity';
import { ArtistEntity } from '@infrastructure/database/Entities/ArtistEntity';
import { UpdateContractUseCase } from '@domain/UseCases/update_contract.use-case';
// @Module({
//   imports: [
//     TypeOrmModule.forFeature([ContractEntity])
//   ],
//   controllers: [ContractController],
//   providers: [
//     {
//       provide: IMapper, 
//       useClass: ContractMapper 
//     },
//     {
//       provide: IContractRepository,  
//       useClass: ContractRepositoryImpl  
//     },
//     {
//       provide: BaseDtoMapper,     
//       useClass: ContractDtoMapper,
//     },
//     ContractService,
//   ],
//   exports: [
//     IContractRepository 
//   ]
// })
// export class ContractModule {}

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity, AgencyEntity, ArtistEntity]),
    AgencyModule, 
    ArtistModule
  ],
  controllers: [ContractController],
  providers: [
    ContractMapper,
    AgencyMapper,
    ArtistMapper,
    
    {
      provide: IContractRepository,  
      useClass: ContractRepositoryImpl  
    },
      
    {
      provide: BaseDtoMapper,     
      useClass: ContractDtoMapper,
    },
    
    ArtistDtoMapper,
    AgencyDtoMapper,
    CreateContractUseCase,
    UpdateContractStatusUseCase,
    UpdateContractUseCase,

    ContractService,
  ],
  exports: [
    IContractRepository 
  ]
})
export class ContractModule {}