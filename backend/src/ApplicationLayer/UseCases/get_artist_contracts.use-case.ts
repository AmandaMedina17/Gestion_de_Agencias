import { Contract } from "@domain/Entities/Contract";
import { IContractRepository } from "@domain/Repositories/IContractRepository";
import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";

@Injectable()
export class GetArtistContractsUseCase {
  constructor(
    @Inject(IContractRepository)
    private readonly contractRepository: IContractRepository
  ) {}

  async execute(artistId: string): Promise<Contract[]> {
    return await this.contractRepository.getArtistContracts(artistId);    
  }
}