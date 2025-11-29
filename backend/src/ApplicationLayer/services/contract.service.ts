import { Injectable, Inject } from '@nestjs/common';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { Contract } from '@domain/Entities/Contract';
import { CreateContractDto} from '../DTOs/contractDto/create-contract.dto';
import { ContractResponseDto } from '@application/DTOs/contractDto/response-contract.dto';
import { BaseService } from './base.service';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { UpdateContractDto } from '@application/DTOs/contractDto/update-contract.dto';

@Injectable()
export class ContractService extends BaseService<Contract, CreateContractDto, ContractResponseDto, UpdateContractDto> {
  constructor(
    @Inject(IContractRepository)
    private readonly contractRepository: IContractRepository,
    private readonly contractDtoMapper: BaseDtoMapper<Contract, CreateContractDto, ContractResponseDto>
  ) {
    super(contractRepository, contractDtoMapper)
  }
}