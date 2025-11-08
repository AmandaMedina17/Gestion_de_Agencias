// // presentation/controllers/ContractController.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
// import { ContractService } from '../../../application/contract/services/ContractService';
// import { CreateContractUseCase } from '../../../application/contract/use-cases/CreateContractUseCase';
import { Contract } from '../../DomainLayer/Entities/Contract';

@Controller('contracts')
export class ContractController {
  constructor(
    // private readonly contractService: ContractService,
    // private readonly createContractUseCase: CreateContractUseCase
  ) {}
}