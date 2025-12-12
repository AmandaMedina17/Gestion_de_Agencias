import { Injectable, Inject } from '@nestjs/common';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { Artist } from '@domain/Entities/Artist';
import { ArtistResponseDto } from '@application/DTOs/artistDto/response-artist.dto';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dtoMapper';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { IArtistActivityRepository } from '@domain/Repositories/IArtistActivityRepository';
import { Contract } from '@domain/Entities/Contract';
import { Activity } from '@domain/Entities/Activity';
import { Group } from '@domain/Entities/Group';

@Injectable()
export class GetArtistsWithAgencyChangesAndGroupsUseCase {
  constructor(
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    private readonly artistDtoMapper: ArtistDtoMapper,
    @Inject(IContractRepository)
    private readonly contractRepository: IContractRepository,
    @Inject(IArtistActivityRepository)
    private readonly artistActivityRepository: IArtistActivityRepository,
  
  ) {}

  async execute(agencyId: string): Promise<Array<{
    artist: Artist;
    contracts: Contract[];
    activities: Activity[];
    debutHistory: Array<{
      group: Group;
      role: string;
      debutDate: Date;
      startDate: Date;
      endDate: Date | null;
    }>;
  }>> {
    //Obtener artistas que cumplan los criterios
    const artists = await this.artistRepository.getArtists_WithAgencyChangesAndGroups(agencyId);
  
    const result = []

    for(const artist of artists){
      // Obtener contratos del artista
      const contracts = await this.contractRepository.getArtistContracts(artist.getId());

      // Obtener actividades del artista 
      const activities = await this.artistActivityRepository.getActivitiesByArtist(artist.getId());

      // Obtener historial de debuts
      const debutHistory = await this.artistRepository.getArtistDebutHistory(artist.getId());

      result.push({
        artist,
        contracts,
        activities,
        debutHistory
      })
    }
    return result;
  }
}