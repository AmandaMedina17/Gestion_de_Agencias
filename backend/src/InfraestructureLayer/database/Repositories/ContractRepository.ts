import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseRepository } from './BaseRepositoryImpl';
import { ContractMapper } from "../Mappers/ContractMapper";
import { ContractEntity } from "@entities/ContractEntity";
import { Contract } from '@domain/Entities/Contract';
import { IContractRepository } from '@domain/Repositories/IContractRepository';

@Injectable()
export class ContractRepositoryImpl 
  extends BaseRepository<Contract, ContractEntity>
  implements IContractRepository 
{
  constructor(
    @InjectRepository(ContractEntity)
    repository: Repository<ContractEntity>,
    mapper: ContractMapper
  ) {
    super(repository, mapper);
  }
}