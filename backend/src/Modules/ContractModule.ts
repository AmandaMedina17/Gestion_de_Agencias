import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from '@entities/ContractEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ContractMapper } from 'src/InfraestructureLayer/database/Mappers/ContractMapper';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { ContractRepositoryImpl} from 'src/InfraestructureLayer/database/Repositories/ContractRepository';
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
    TypeOrmModule.forFeature([ContractEntity]),
    AgencyModule, 
    ArtistModule
  ],
  controllers: [ContractController],
  providers: [
    ContractMapper,
    
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

    ContractService,
  ],
  exports: [
    IContractRepository 
  ]
})
export class ContractModule {}