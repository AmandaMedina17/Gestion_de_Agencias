// application/use-cases/get-agency-artists.use-case.ts
import { Injectable } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { Artist } from '@domain/Entities/Artist';

@Injectable()
export class GetAgencyArtistsUseCase {
  constructor(
    private readonly agencyRepository: IAgencyRepository,
   ) {}

  async execute(agencyId: string): Promise<Artist[]> {
    // Validar que la agencia existe
    const agency = await this.agencyRepository.findById(agencyId);
    if (!agency) {
      throw new Error('Agency not found');
    }

    // Obtener los artistas de la agencia
    return  await this.agencyRepository.getAgencyArtists(agencyId);
    
  }
}