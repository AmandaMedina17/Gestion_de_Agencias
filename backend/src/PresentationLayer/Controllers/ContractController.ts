// // presentation/controllers/AgencyController.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
// import { ContractService } from '../../../application/agency/services/ContractService';
// import { CreateContractUseCase } from '../../../application/agency/use-cases/CreateAgencyUseCase';
import { Contract } from '../../DomainLayer/Entities/Contract';

@Controller('contracts')
export class ContractController {
  constructor(
    // private readonly contractService: ContractService,
    // private readonly createContractUseCase: CreateContractUseCase
  ) {}
}