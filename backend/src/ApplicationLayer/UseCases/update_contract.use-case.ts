// @domain/UseCases/update_contract.use-case.ts
import { IContractRepository } from "@domain/Repositories/IContractRepository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Contract } from "@domain/Entities/Contract";
import { UpdateContractDto } from "@application/DTOs/contractDto/update-contract.dto";

@Injectable()
export class UpdateContractUseCase {
  constructor(
    private readonly contractRepository: IContractRepository,
  ) {}

  async execute(contractId: string, updateContractDto: UpdateContractDto): Promise<Contract> {
    // 1. Buscar el contrato existente
    const existingContract = await this.contractRepository.findById(contractId);
    
    if (!existingContract) {
      throw new NotFoundException(`Contract with ID ${contractId} not found`);
    }


    // 3. Aplicar las actualizaciones al contrato
    this.applyUpdates(existingContract, updateContractDto);

    // 4. Guardar el contrato actualizado
    return await this.contractRepository.update(existingContract);
  }

 

  private applyUpdates(contract: Contract, updateContractDto: UpdateContractDto): void {
    // Usar el método update de la entidad Contract que ya implementa las validaciones
    contract.update({
      startDate: updateContractDto.startDate,
      endDate: updateContractDto.endDate,
      distributionPercentage: updateContractDto.distributionPercentage,
      status: updateContractDto.status,
      conditions: updateContractDto.conditions
    });
  }
}