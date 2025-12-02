import { Injectable, Inject } from '@nestjs/common';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { Contract } from '@domain/Entities/Contract';
import { CreateContractDto} from '../DTOs/contractDto/create-contract.dto';
import { ContractResponseDto } from '@application/DTOs/contractDto/response-contract.dto';
import { BaseService } from './base.service';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { UpdateContractDto } from '@application/DTOs/contractDto/update-contract.dto';
import { CreateContractUseCase } from '@domain/UseCases/create_contract.uso-case';
import { UpdateContractStatusUseCase } from '@domain/UseCases/update_contract_status.use-case';
import { ContractStatus } from '@domain/Enums';
import { UpdateContractUseCase } from '@domain/UseCases/update_contract.use-case';

@Injectable()
export class ContractService extends BaseService<Contract, CreateContractDto, ContractResponseDto, UpdateContractDto> {
  constructor(
    @Inject(IContractRepository)
    private readonly contractRepository: IContractRepository,
    @Inject(BaseDtoMapper)
    private readonly contractDtoMapper: BaseDtoMapper<Contract, CreateContractDto, ContractResponseDto>,
    private readonly createContractUseCase: CreateContractUseCase,
    private readonly updateContractStatusUseCase: UpdateContractStatusUseCase,
    private readonly updateContractUseCase: UpdateContractUseCase
  ) {
    super(contractRepository, contractDtoMapper)
  }
  async create(createContractDto: CreateContractDto): Promise<ContractResponseDto> {
    const contract = await this.createContractUseCase.execute(createContractDto);
    return this.contractDtoMapper.toResponse(contract);
  }
  async updateStatus(contractId: string, status: ContractStatus): Promise<ContractResponseDto> {
    const contract = await this.updateContractStatusUseCase.execute(contractId, status);
    return this.contractDtoMapper.toResponse(contract);
  }
  async update(id: string, updateContractDto: UpdateContractDto): Promise<ContractResponseDto> {
    const contract = await this.updateContractUseCase.execute(id, updateContractDto);
    return this.contractDtoMapper.toResponse(contract);
  }

}