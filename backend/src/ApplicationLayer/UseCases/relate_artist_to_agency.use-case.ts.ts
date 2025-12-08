import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { CreateArtistAgencyDto } from '@application/DTOs/artist_agencyDto/create-artist-agency.dto';
import { ResponseArtistAgencyDto } from '@application/DTOs/artist_agencyDto/response-artist-agency.dto';

@Injectable()
export class RelateArtistToAgencyUseCase {
  constructor(
    private readonly agencyRepository: IAgencyRepository,
    private readonly artistRepository: IArtistRepository,
  ) {}

  async execute(agencyId: string, createArtistAgencyDto: CreateArtistAgencyDto): Promise<ResponseArtistAgencyDto> {
    const {startDate, endDate } = createArtistAgencyDto;

    // Verificar que la agencia existe
    const agency = await this.agencyRepository.findById(agencyId);
    if (!agency) {
      throw new NotFoundException(`Agency with ID ${agencyId} not found`);
    }

    const artistId = createArtistAgencyDto.artistid;
    // Verificar que el artista existe
    const artist = await this.artistRepository.findById(artistId);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    }

    // Verificar que el artista no esté ya en la misma agencia en el mismo período
    try {
      await this.agencyRepository.addArtistToAgency(artistId, agencyId, startDate, endDate);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to add artist to agency: ${error}`);
    }
    return {
      artistId: artistId,
      agencyId: agencyId,
      startDate: createArtistAgencyDto.startDate,
      endDate: createArtistAgencyDto.endDate
    }
  }
}