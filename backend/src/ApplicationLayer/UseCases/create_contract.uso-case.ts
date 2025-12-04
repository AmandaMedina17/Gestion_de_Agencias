import { IContractRepository } from "@domain/Repositories/IContractRepository";
import { IAgencyRepository } from "@domain/Repositories/IAgencyRepository";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { Inject, Injectable } from "@nestjs/common";
import { Contract } from "@domain/Entities/Contract";
import { ContractStatus } from "@domain/Enums";


@Injectable()
export class CreateContractUseCase {
  constructor(
    @Inject(IContractRepository)
    private contractRepository: IContractRepository,
    @Inject(IAgencyRepository)
    private agencyRepository: IAgencyRepository,
    @Inject(IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

  async execute(contractData: {
    startDate: Date;
    endDate: Date;
    agencyId: string;
    artistId: string;
    distributionPercentage: number;
    conditions: string;
  }): Promise<Contract> {
    // Validar que agency y artist existen
    const [agency, artist] = await Promise.all([
      this.agencyRepository.findById(contractData.agencyId),
      this.artistRepository.findById(contractData.artistId),
    ]);

    if (!agency || !artist) {
      throw new Error('Agency or Artist not found');
    }

    // Crear contrato usando el método de la entidad
    const contract = Contract.create(
      contractData.startDate,
      contractData.endDate,
      agency,
      artist,
      contractData.distributionPercentage,
      ContractStatus.ACTIVO, 
      contractData.conditions
    );

    return await this.contractRepository.save(contract);
  }
}