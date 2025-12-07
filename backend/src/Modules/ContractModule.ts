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
import { CreateContractUseCase } from '@application/UseCases/create_contract.uso-case';
import { UpdateContractStatusUseCase } from '@application/UseCases/update_contract_status.use-case';
import { ArtistModule } from './ArtistModule';
import { AgencyModule } from './AgencyModule';
import { AgencyEntity } from '@infrastructure/database/Entities/AgencyEntity';
import { ArtistEntity } from '@infrastructure/database/Entities/ArtistEntity';
import { UpdateContractUseCase } from '../ApplicationLayer/UseCases/update_contract.use-case';
import { GetArtistContractsUseCase } from '@application/UseCases/get_artist_contracts.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity, AgencyEntity, ArtistEntity]),
    AgencyModule, 
    ArtistModule
  ],
  controllers: [ContractController],
  providers: [
    ContractMapper,
    ContractDtoMapper,
    {
      provide: IContractRepository,  
      useClass: ContractRepositoryImpl  
    },
    CreateContractUseCase,
    UpdateContractStatusUseCase,
    UpdateContractUseCase,
    ContractService,
    GetArtistContractsUseCase,
  ],
  exports: [
    IContractRepository,
    ContractDtoMapper,
    ContractMapper
  ]
})
export class ContractModule {}