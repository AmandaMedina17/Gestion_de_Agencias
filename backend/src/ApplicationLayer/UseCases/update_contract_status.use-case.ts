import { Contract } from "@domain/Entities/Contract";
import { ContractStatus } from "@domain/Enums";
import { IContractRepository } from "@domain/Repositories/IContractRepository";
import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";

@Injectable()
export class UpdateContractStatusUseCase {
  constructor(
    @Inject(IContractRepository)
    private readonly contractRepository: IContractRepository
  ) {}

  async execute(contractId: string, newStatus: ContractStatus): Promise<Contract> {
    const contract = await this.contractRepository.findById(contractId);
    
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${contractId} not found`);
    }

    // Validar transiciones de estado permitidas
    this.validateStatusTransition(contract.getStatus(), newStatus);

    // Aplicar cambio de estado según reglas de negocio
    switch (newStatus) {
      case ContractStatus.ACTIVO:
        contract.activate();
        break;
      case ContractStatus.FINALIZADO:
        contract.expire();
        break;
      case ContractStatus.EN_RENOVACION:
        contract.underRenewal();
        break;
      case ContractStatus.RESCINDIDO:
        contract.terminate();
        break;
      default:
        throw new BadRequestException(`Invalid contract status: ${newStatus}`);
    }

    return await this.contractRepository.save(contract);
  }

  private validateStatusTransition(currentStatus: ContractStatus, newStatus: ContractStatus): void {
    const allowedTransitions = {
      [ContractStatus.ACTIVO]: [ContractStatus.FINALIZADO, ContractStatus.EN_RENOVACION, ContractStatus.RESCINDIDO],
      [ContractStatus.EN_RENOVACION]: [ContractStatus.ACTIVO, ContractStatus.RESCINDIDO],
      [ContractStatus.FINALIZADO]: [ContractStatus.EN_RENOVACION],
      [ContractStatus.RESCINDIDO]: [] as ContractStatus[] // No se puede cambiar desde rescindido
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }
}