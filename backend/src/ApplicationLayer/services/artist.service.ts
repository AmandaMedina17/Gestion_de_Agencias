import { CreateArtistDto } from "@application/DTOs/artistDto/create-artist.dto";
import { ArtistResponseDto } from "@application/DTOs/artistDto/response-artist.dto";
import { UpdateArtistDto } from "@application/DTOs/artistDto/update-artist.dto";
import { Artist } from "@domain/Entities/Artist";
import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "./base.service";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { ContractDtoMapper } from '../DTOs/dtoMappers/contract.dtoMapper';
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dtoMapper";
import { GetArtistsWithAgencyChangesAndGroupsUseCase } from '@application/UseCases/get_artists_with_agency_changes_and_groups.use-case';
import { ArtistDebutHistoryWithActivitiesAndContractsResponseDto, DebutHistoryItemResponseDto } from "@application/DTOs/artist_debut_historyDto/response-artist_debut_history.dto";
import { ActivityDtoMapper } from "@application/DTOs/dtoMappers/activity.dtoMapper";
import { GroupDtoMapper } from "@application/DTOs/dtoMappers/group.dtoMapper";
import { ArtistCollaborationResponseDto } from "@application/DTOs/artistCollaborationsDto/response-artist-collaboration.dto";
import { ArtistGroupCollaborationResponseDto } from "@application/DTOs/artist_groupCollaborationDto/response-artist-group-collaboration.dto";
import { CreateArtistGroupCollaborationDto } from "@application/DTOs/artist_groupCollaborationDto/create-artist-group-collaboration.dto";
import { CreateArtistCollaborationDto } from "@application/DTOs/artistCollaborationsDto/create-artist-collaboration.dto";

@Injectable()
export class ArtistService extends BaseService<Artist, CreateArtistDto, ArtistResponseDto, UpdateArtistDto>{
    constructor(
        @Inject(IArtistRepository)
        private readonly artistRepository: IArtistRepository,
        private readonly artistDtoMapper: ArtistDtoMapper,
        private readonly contractDtoMapper:ContractDtoMapper,
        private readonly activityDtoMapper: ActivityDtoMapper,
        private readonly groupDtoMapper: GroupDtoMapper,
        private readonly getArtistsWithAgencyChangesAndGroupsUseCase : GetArtistsWithAgencyChangesAndGroupsUseCase,
    ){
        super(artistRepository, artistDtoMapper)
    }
    async getArtistsWithAgencyChangesAndGroups(agencyId: string): Promise<ArtistDebutHistoryWithActivitiesAndContractsResponseDto[]> {
        const artistsData = await this.getArtistsWithAgencyChangesAndGroupsUseCase.execute(agencyId);
        
        return artistsData.map(data => {
            const artistDto = this.artistDtoMapper.toResponse(data.artist);
            const contractDtos = data.contracts.map(contract => 
                this.contractDtoMapper.toResponse(contract)
            );
            const activityDtos = data.activities.map(activity => 
                this.activityDtoMapper.toResponse(activity)
            );
            const debutHistoryDtos: DebutHistoryItemResponseDto[] = data.debutHistory.map(historyItem => ({
                group: this.groupDtoMapper.toResponse(historyItem.group),
                role: historyItem.role,
                debutDate: historyItem.debutDate,
                startDate: historyItem.startDate,
                endDate: historyItem.endDate,
            }));

            return {
                artist: artistDto,
                contracts: contractDtos,
                activities: activityDtos,
                debutHistory: debutHistoryDtos,
            };
        });
    }

    async getArtist_ArtistCollaborations(artistId: string) : Promise<ArtistCollaborationResponseDto[]>{
        const collaborations = await this.artistRepository.getArtist_ArtistColaborations(artistId);
        
        const response: ArtistCollaborationResponseDto[] = [];
        
        for (const coll of collaborations) {
                const artistResponse = this.artistDtoMapper.toResponse(coll.collaborator);
       
            response.push({
            artist: artistResponse,
            date: coll.collaborationDate
            });
        }

        return response;
    }

    async getArtist_GroupCollaborations(artistId: string) : Promise<ArtistGroupCollaborationResponseDto[]>{
        const collaborations = await this.artistRepository.getArtist_GroupsColaborations(artistId);
        
        const response: ArtistGroupCollaborationResponseDto[] = [];
        
        for (const coll of collaborations) {
                const groupResponse = this.groupDtoMapper.toResponse(coll.collaborator);
       
            response.push({
            group: groupResponse,
            date: coll.collaborationDate
            });
        }

        return response;
    }

    async createArtistCollaboration(createArtistCollaborationDto: CreateArtistCollaborationDto) {
    const { artist1Id, artist2Id, date } = createArtistCollaborationDto;
    
    // Validar que los artistas sean diferentes
    if (artist1Id === artist2Id) {
      throw new Error('Un artista no puede colaborar consigo mismo');
    }

    // Ordenar los IDs para evitar duplicados (opcional)
    const [firstId, secondId] = [artist1Id, artist2Id].sort();
    
    return await this.artistRepository.createArtistCollaboration(firstId, secondId, date);
  }

  async createArtistGroupCollaboration(createArtistGroupCollaborationDto: CreateArtistGroupCollaborationDto) {
    const { artistId, groupId, date } = createArtistGroupCollaborationDto;
    
    return await this.artistRepository.createArtistGroupCollaboration(artistId, groupId, date);
  }
}