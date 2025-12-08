import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { CreateArtistAgencyDto } from '@application/DTOs/artist_agencyDto/create-artist-agency.dto';
import { ResponseArtistAgencyDto } from '@application/DTOs/artist_agencyDto/response-artist-agency.dto';

@Injectable()
export class RemoveArtistFromAgencyUseCase {
  constructor(
    private readonly agencyRepository: IAgencyRepository,
    private readonly artistRepository: IArtistRepository,
  ) {}

  async execute(agencyId: string, artistId: string, leaveDate?: Date): Promise<void> {
    // Verificar que la agencia existe
    const agency = await this.agencyRepository.findById(agencyId);
    if (!agency) {
      throw new NotFoundException(`Agency with ID ${agencyId} not found`);
    }

    // Verificar que el artista existe
    const artist = await this.artistRepository.findById(artistId);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    }

    //Verificar que el artista está actualmente en la agencia
    try {
      await this.agencyRepository.removeArtistFromAgency(artistId, agencyId, leaveDate);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to remove artist from agency: ${error}`);
    }
  }
}