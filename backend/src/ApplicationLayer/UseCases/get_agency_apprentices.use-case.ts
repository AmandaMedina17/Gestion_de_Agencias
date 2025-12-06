// application/use-cases/get-agency-artists.use-case.ts
import { Injectable } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { Apprentice } from '@domain/Entities/Apprentice';
import { ApprenticeResponseDto } from '@application/DTOs/apprenticeDto/response-apprentice.dto';

@Injectable()
export class GetAgencyApprenticesUseCase {
  constructor(
    private readonly agencyRepository: IAgencyRepository,
  ) {}

  async execute(agencyId: string): Promise<Apprentice[]> {
    // Validar que la agencia existe
    const agency = await this.agencyRepository.findById(agencyId);
    if (!agency) {
      throw new Error('Agency not found');
    }

    // Obtener los aprendices de la agencia
    return  await this.agencyRepository.getAgencyApprentices(agencyId);
    
  }
}