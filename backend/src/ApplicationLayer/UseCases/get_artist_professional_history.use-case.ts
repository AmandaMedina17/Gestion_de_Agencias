import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { IArtistActivityRepository } from '@domain/Repositories/IArtistActivityRepository';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dtoMapper';
import { ContractDtoMapper } from '@application/DTOs/dtoMappers/contract.dtoMapper';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';
import { GroupDtoMapper } from '@application/DTOs/dtoMappers/group.dtoMapper';
import { ProfessionalHistoryResponseDto } from '@application/DTOs/professional_historyDto/response-professional-history.dto';
import { ArtistCollaborationResponseDto } from '@application/DTOs/artistCollaborationsDto/response-artist-collaboration.dto';
import { ArtistGroupCollaborationResponseDto } from '@application/DTOs/artist_groupCollaborationDto/response-artist-group-collaboration.dto';

@Injectable()
export class GetProfessionalHistoryUseCase {
  constructor(
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    @Inject(IContractRepository)
    private readonly contractRepository: IContractRepository,
    @Inject(IArtistActivityRepository)
    private readonly artistActivityRepository: IArtistActivityRepository,
    private readonly artistDtoMapper: ArtistDtoMapper,
    private readonly contractDtoMapper: ContractDtoMapper,
    private readonly activityDtoMapper: ActivityDtoMapper,
    private readonly groupDtoMapper: GroupDtoMapper,
  ) {}

  async execute(artistId: string): Promise<ProfessionalHistoryResponseDto> {
    //Obtener artista
    const artist = await this.artistRepository.findById(artistId);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    }

    // Obtener contratos del artista y filtrar los activos
    const allContracts = await this.contractRepository.getArtistContracts(artistId);
    const today = new Date()
    const activeContracts = allContracts.filter(contract => {
      const status = contract.getStatus();
      const startDate = contract.getStartDate();
      const endDate = contract.getEndDate();
      
      // Verificar que el estado sea ACTIVO
      if (status !== 'ACTIVO') {
        return false;
      }
      
      // Verificar que la fecha actual sea posterior o igual al inicio
      if (startDate > today) {
        return false;
      }
      
      // Si tiene fecha de fin, verificar que sea posterior o igual a la fecha actual
      // Si es null, es vigente indefinidamente
      if (endDate !== null && endDate < today) {
        return false;
      }
      
      return true;
    });

    // Obtener historial de debut (grupos en orden cronológico)
    const debutHistory = await this.artistRepository.getArtistDebutHistory(artistId);

    // Obtener colaboraciones con otros artistas
    const artistCollaborationsData = await this.artistRepository.getArtist_ArtistColaborations(artistId);

    // Obtener colaboraciones con grupos
    const groupCollaborationsData = await this.artistRepository.getArtist_GroupsColaborations(artistId);

    // Obtener actividades profesionales del artista
    const activities = await this.artistActivityRepository.getActivitiesByArtist(artistId);
    
    // Filtrar actividades que ya han ocurrido (historial)
    const now = new Date();
    const professionalActivities = activities.filter(activity => {
      // Obtener la fecha más reciente de la actividad
      const activityDates = activity.getDates();
      if (!activityDates || activityDates.length === 0) return false;
      
      const latestActivityDate = new Date(Math.max(...activityDates.map(d => d.getTime())));
      return latestActivityDate < now;
    });

    //Ordenar todo cronológicamente
    artistCollaborationsData.sort((a, b) => 
      a.collaborationDate.getTime() - b.collaborationDate.getTime()
    );
    
    groupCollaborationsData.sort((a, b) => 
      a.collaborationDate.getTime() - b.collaborationDate.getTime()
    );
    
    professionalActivities.sort((a, b) => {
      const aDate = new Date(Math.max(...a.getDates().map(d => d.getTime())));
      const bDate = new Date(Math.max(...b.getDates().map(d => d.getTime())));
      return bDate.getTime() - aDate.getTime(); // Más reciente primero
    });

    //Mapear a DTOs de respuesta
    const response = new ProfessionalHistoryResponseDto();
    response.artist = this.artistDtoMapper.toResponse(artist);
    response.activeContracts = activeContracts.map(contract => 
      this.contractDtoMapper.toResponse(contract)
    );
    response.debutHistory = debutHistory.map(item => ({
      group: this.groupDtoMapper.toResponse(item.group),
      role: item.role,
      debutDate: item.debutDate,
      startDate: item.startDate,
      endDate: item.endDate,
    }));
    response.artistCollaborations = artistCollaborationsData.map(coll => {
      const dto = new ArtistCollaborationResponseDto();
      dto.artist1 = this.artistDtoMapper.toResponse(coll.artist1);
      dto.artist2 = this.artistDtoMapper.toResponse(coll.artist2);
      dto.date = coll.collaborationDate;
      return dto;
    });
    response.groupCollaborations = groupCollaborationsData.map(coll => {
      const dto = new ArtistGroupCollaborationResponseDto();
      dto.artist = this.artistDtoMapper.toResponse(coll.artist);
      dto.group = this.groupDtoMapper.toResponse(coll.group);
      dto.date = coll.collaborationDate;
      return dto;
    });
    response.activities = this.activityDtoMapper.toResponseList(professionalActivities);
    
    return response;
  }
}