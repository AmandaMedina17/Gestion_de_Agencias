import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from '@entities/ContractEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ContractMapper } from 'src/InfraestructureLayer/database/Mappers/ContractMapper';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { ContractRepositoryImpl} from 'src/InfraestructureLayer/database/Repositories/ContractRepository';
import { ContractController } from '../PresentationLayer/controllers/ContractController';
import { Contract } from '../DomainLayer/Entities/Contract';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity])
  ],
  controllers: [ContractController],
  providers: [
    {
      provide: IMapper,      // ✅ Interfaz como token
      useClass: ContractMapper   // ✅ Implementación concreta
    },
    {
      provide: IContractRepository,      // ✅ Interfaz como token
      useClass: ContractRepositoryImpl   // ✅ Implementación concreta
    }
  ],
  exports: [
    IContractRepository 
  ]
})
export class ContractModule {}