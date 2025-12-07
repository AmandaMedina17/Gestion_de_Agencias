import { Injectable, Inject } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { Agency } from '@domain/Entities/Agency';
import { CreateAgencyDto} from '../DTOs/agencyDto/create-agency.dto';
import { AgencyResponseDto } from '@application/DTOs/agencyDto/response-agency.dto';
import { BaseService } from './base.service';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { UpdateAgencyDto } from '@application/DTOs/agencyDto/update-agency.dto';
import { AgencyDtoMapper } from '@application/DTOs/dtoMappers/agency.dtoMapper';
import { Artist } from '@domain/Entities/Artist';
import { ArtistResponseDto } from '@application/DTOs/artistDto/response-artist.dto';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dtoMapper';
import { Apprentice } from '@domain/Entities/Apprentice';
import { ApprenticeResponseDto } from '@application/DTOs/apprenticeDto/response-apprentice.dto';
import { GetAgencyArtistsUseCase } from '../UseCases/get_agency_artists.use-case';
import { ApprenticeDtoMapper } from '../DTOs/dtoMappers/apprentice.dtoMapper';
import { GetAgencyApprenticesUseCase } from '../UseCases/get_agency_apprentices.use-case';
import { GetAgencyGroupsUseCase } from '../UseCases/get_agency_groups.use-case';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { ArtistRepository } from '../../InfraestructureLayer/database/Repositories/ArtistRepository';
import { CreateArtistAgencyDto } from '@application/DTOs/artist_agencyDto/create-artist-agency.dto';
import { RelateArtistToAgencyUseCase } from '@application/UseCases/relate_artist_to_agency.use-case.ts';
@Injectable()
export class AgencyService extends BaseService<Agency, CreateAgencyDto, AgencyResponseDto, UpdateAgencyDto> {
    constructor(
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
    private readonly agencyDtoMapper: AgencyDtoMapper,
    private readonly artistDtoMapper: ArtistDtoMapper,
    // private readonly groupDtoMapper: GroupDtoMapper,
    private readonly apprenticeDtoMapper: ApprenticeDtoMapper,
    private readonly getAgencyArtistsUseCase: GetAgencyArtistsUseCase,
    private readonly getAgencyApprenticesUseCase: GetAgencyApprenticesUseCase,
    private readonly getAgencyGroupsUseCase: GetAgencyGroupsUseCase,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
     private readonly relateArtistToAgencyUseCase: RelateArtistToAgencyUseCase

  ) {
    super(agencyRepository, agencyDtoMapper)
  }
  async getAgencyArtists(agencyId: string): Promise<ArtistResponseDto[]> {
    const artists =  await this.getAgencyArtistsUseCase.execute(agencyId);
    return this.artistDtoMapper.toResponseList(artists);
  }
  async getAgencyApprentices(agencyId: string): Promise<ApprenticeResponseDto[]>{
    const apprentices = await this.getAgencyApprenticesUseCase.execute(agencyId);
    return this.apprenticeDtoMapper.toResponseList(apprentices);
  }
  // async getAgencyGroups(agencyId: string): Promise<GroupResponseDto[]>{
  //   const groups = await this.getAgencyGroupsUseCase.execute(agencyId);
  //   return this.groupDtoMapper.toResponseList(groups);
  // }
  // async getAgencyActiveArtistAndGruopInfo(agencyId: string): Promise<[ArtistResponseDto,GroupResponseDto | null][]>{
  //   const activeArtists = await this.agencyRepository.findActiveArtistsByAgency(agencyId);
  //   const result: [ArtistResponseDto, GroupResponseDto | null][] = [];
  //   for (const artist of activeArtists) {
  //   // Obtener el grupo actual del artista
  //   const currentGroup = await this.artistRepository.getArtistCurrentGroup(artist.getId());
    
  //   // Convertir artista a DTO
  //   const artistDto = this.artistDtoMapper.toResponse(artist);
    
  //   // Convertir grupo a DTO (si existe)
  //   let groupDto: GroupResponseDto | null = null;
  //   if (currentGroup) {
  //     groupDto = this.groupDtoMapper.toResponse(currentGroup);
  //   }
    
  //   result.push([artistDto, groupDto]);
  // }
  
  // return result;
  // }
  async relateArtistToAgency(agencyId: string, artistId: string, createArtistAgencyDto: CreateArtistAgencyDto): Promise<void> {
    return await this.relateArtistToAgencyUseCase.execute(agencyId, artistId,createArtistAgencyDto);
  }
}