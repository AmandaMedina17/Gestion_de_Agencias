import { Injectable } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { Group} from '@domain/Entities/Group';

@Injectable()
export class GetAgencyGroupsUseCase {
  constructor(
    private readonly agencyRepository: IAgencyRepository,
   ) {}

  async execute(agencyId: string): Promise<Group[]> {
    // Validar que la agencia existe
    const agency = await this.agencyRepository.findById(agencyId);
    if (!agency) {
      throw new Error('Agency not found');
    }

    // Obtener los artistas de la agencia
    return  await this.agencyRepository.getAgencyGroups(agencyId);
    
  }
}