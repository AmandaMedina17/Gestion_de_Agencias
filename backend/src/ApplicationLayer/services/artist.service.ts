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
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { GroupRepository } from '../../InfraestructureLayer/database/Repositories/GroupRepository';
import { CreateArtistCollaborationUseCase } from "@application/UseCases/create_artist_collaboration.use-case";
import { CreateArtistGroupCollaborationUseCase } from "@application/UseCases/create_artist_group_collaboration.use-case";
import { CreateArtistUseCase } from "@application/UseCases/create_artist.use-case";

@Injectable()
export class ArtistService extends BaseService<Artist, CreateArtistDto, ArtistResponseDto, UpdateArtistDto>{
    constructor(
        @Inject(IArtistRepository)
        private readonly artistRepository: IArtistRepository,
        private readonly artistDtoMapper: ArtistDtoMapper,
        private readonly contractDtoMapper:ContractDtoMapper,
        private readonly activityDtoMapper: ActivityDtoMapper,
        private readonly groupDtoMapper: GroupDtoMapper,
        @Inject(IGroupRepository)
        private readonly groupRepository: IGroupRepository,
        private readonly getArtistsWithAgencyChangesAndGroupsUseCase : GetArtistsWithAgencyChangesAndGroupsUseCase,
        private readonly createArtistCollaborationUseCase: CreateArtistCollaborationUseCase,
        private readonly createArtistGroupCollaborationUseCase: CreateArtistGroupCollaborationUseCase,
        private readonly createArtistUseCase : CreateArtistUseCase,
    ){
        super(artistRepository, artistDtoMapper)
    }

    async create(createDto: CreateArtistDto): Promise<ArtistResponseDto> {
        const artist = await this.createArtistUseCase.execute(createDto);
        return this.artistDtoMapper.toResponse(artist);
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
            const artist1Response = this.artistDtoMapper.toResponse(coll.artist1);
            const artist2Response = this.artistDtoMapper.toResponse(coll.artist2);
            
            const collaborationResponse = new ArtistCollaborationResponseDto();
            collaborationResponse.artist1 = artist1Response;
            collaborationResponse.artist2 = artist2Response;
            collaborationResponse.date = coll.collaborationDate;
            
            response.push(collaborationResponse);
        }
        return response;
    }

    async getArtist_GroupCollaborations(artistId: string) : Promise<ArtistGroupCollaborationResponseDto[]>{
        const collaborations = await this.artistRepository.getArtist_GroupsColaborations(artistId);
        
        const response: ArtistGroupCollaborationResponseDto[] = [];
        
        for (const coll of collaborations) {
            const artistResponse = this.artistDtoMapper.toResponse(coll.artist);
            const groupResponse = this.groupDtoMapper.toResponse(coll.group);
            
            const collaborationResponse = new ArtistGroupCollaborationResponseDto();
            collaborationResponse.artist = artistResponse;
            collaborationResponse.group = groupResponse;
            collaborationResponse.date = coll.collaborationDate;
            
            response.push(collaborationResponse);
        }

        return response;
    }

    async createArtistCollaboration(createArtistCollaborationDto: CreateArtistCollaborationDto) {
        const {artist1, artist2, date} = await this.createArtistCollaborationUseCase.execute(createArtistCollaborationDto)
        const artist1Dto = this.artistDtoMapper.toResponse(artist1);
        const artist2Dto = this.artistDtoMapper.toResponse(artist2);
        const response = new ArtistCollaborationResponseDto();
        response.artist1 = artist1Dto;
        response.artist2 = artist2Dto;
        response.date = date;
        return response;
    }

  async createArtistGroupCollaboration(createArtistGroupCollaborationDto: CreateArtistGroupCollaborationDto) {
    const { artist, group, date } = await this.createArtistGroupCollaborationUseCase.execute(createArtistGroupCollaborationDto);
    
    // Mapear a DTOs de respuesta si es necesario
    const artistDto = this.artistDtoMapper.toResponse(artist);
    const groupDto = this.groupDtoMapper.toResponse(group);
    
    const response = new ArtistGroupCollaborationResponseDto();
    response.artist = artistDto;
    response.group = groupDto;
    response.date = date;
    return response;
  }
}