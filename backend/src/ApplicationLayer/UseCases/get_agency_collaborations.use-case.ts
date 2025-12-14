import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dtoMapper';
import { GroupDtoMapper } from '@application/DTOs/dtoMappers/group.dtoMapper';
import { AgencyCollaborationsResponseDto } from '@application/DTOs/agencyCollaborationsDto/response-agency-collaborations.dto';
import { ArtistCollaborationResponseDto } from '@application/DTOs/artistCollaborationsDto/response-artist-collaboration.dto';
import { ArtistGroupCollaborationResponseDto } from '@application/DTOs/artist_groupCollaborationDto/response-artist-group-collaboration.dto';
import { AgencyDtoMapper } from '@application/DTOs/dtoMappers/agency.dtoMapper';

@Injectable()
export class GetAgencyCollaborationsUseCase {
  constructor(
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    private readonly artistDtoMapper: ArtistDtoMapper,
    private readonly groupDtoMapper: GroupDtoMapper,
    private readonly agencyDtoMapper: AgencyDtoMapper,
  ) {}
  async execute(agencyId: string): Promise<AgencyCollaborationsResponseDto> {
    // Verificar que la agencia existe
    const agency = await this.agencyRepository.findById(agencyId);
    if (!agency) {
      throw new NotFoundException(`Agency with ID ${agencyId} not found`);
    }

    //  Obtener todos los artistas de la agencia
    const agencyArtists = await this.agencyRepository.getAgencyArtists(agencyId);
    
    // Arrays para almacenar las colaboraciones
    const artistCollaborations: ArtistCollaborationResponseDto[] = [];
    const artistGroupCollaborations: ArtistGroupCollaborationResponseDto[] = [];
    
    for (const artist of agencyArtists) {
      const artistId = artist.getId();

      // Obtener colaboraciones con otros artistas
      const artistCollaborationsData = await this.artistRepository.getArtist_ArtistColaborations(artistId);
      for (const coll of artistCollaborationsData) {
        const dto = new ArtistCollaborationResponseDto();
          dto.artist1 = this.artistDtoMapper.toResponse(coll.artist1);
          dto.artist2 = this.artistDtoMapper.toResponse(coll.artist2);
          dto.date = coll.collaborationDate;
          
          artistCollaborations.push(dto);
       }
      const groupCollaborationsData = await this.artistRepository.getArtist_GroupsColaborations(artistId);
      for (const coll of groupCollaborationsData) {
         const dto = new ArtistGroupCollaborationResponseDto();
          dto.artist = this.artistDtoMapper.toResponse(coll.artist);
          dto.group = this.groupDtoMapper.toResponse(coll.group);
          dto.date = coll.collaborationDate;
          
          artistGroupCollaborations.push(dto);
        }
    }
    // // Ordenar por fecha (más reciente primero)
    // artistCollaborations.sort((a, b) => b.date.getTime() - a.date.getTime());
    // artistGroupCollaborations.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Crear respuesta
    const response = new AgencyCollaborationsResponseDto();
    response.agency = this.agencyDtoMapper.toResponse(agency);
    response.artistCollaborations = artistCollaborations;
    response.artist_groupCollaborations = artistGroupCollaborations;

    return response;
  }
}