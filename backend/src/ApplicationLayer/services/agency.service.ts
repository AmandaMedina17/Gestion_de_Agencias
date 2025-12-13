import { Injectable, Inject } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { Agency } from '@domain/Entities/Agency';
import { CreateAgencyDto} from '../DTOs/agencyDto/create-agency.dto';
import { AgencyResponseDto } from '@application/DTOs/agencyDto/response-agency.dto';
import { BaseService } from './base.service';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { UpdateAgencyDto } from '@application/DTOs/agencyDto/update-agency.dto';
import { AgencyDtoMapper } from '@application/DTOs/dtoMappers/agency.dtoMapper';
import { ArtistResponseDto } from '@application/DTOs/artistDto/response-artist.dto';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dtoMapper';
import { ApprenticeResponseDto } from '@application/DTOs/apprenticeDto/response-apprentice.dto';
import { GetAgencyArtistsUseCase } from '../UseCases/get_agency_artists.use-case';
import { ApprenticeDtoMapper } from '../DTOs/dtoMappers/apprentice.dtoMapper';
import { GetAgencyApprenticesUseCase } from '../UseCases/get_agency_apprentices.use-case';
import { GetAgencyGroupsUseCase } from '../UseCases/get_agency_groups.use-case';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { CreateArtistAgencyDto } from '@application/DTOs/artist_agencyDto/create-artist-agency.dto';
import { RelateArtistToAgencyUseCase } from '@application/UseCases/relate_artist_to_agency.use-case.ts';
import { GroupResponseDto } from '@application/DTOs/groupDto/response-group.dto';
import { GroupDtoMapper } from '@application/DTOs/dtoMappers/group.dtoMapper';
import { ArtistDebutContractResponseDto } from '@application/DTOs/artists_debut_contractDto/response-artist_debut_contract.dto';
import { ContractDtoMapper } from '../DTOs/dtoMappers/contract.dtoMapper';
import { GetArtistsWithDebutUseCase } from '../UseCases/get_artists_with_debut.use-case';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { ResponseArtistAgencyDto } from '@application/DTOs/artist_agencyDto/response-artist-agency.dto';
import { AgencyCollaborationsResponseDto } from '@application/DTOs/agencyCollaborationsDto/response-agency-collaborations.dto';
import { GetAgencyCollaborationsUseCase } from '../UseCases/get_agency_collaborations.use-case';

@Injectable()
export class AgencyService extends BaseService<Agency, CreateAgencyDto, AgencyResponseDto, UpdateAgencyDto> {
    constructor(
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
    private readonly agencyDtoMapper: AgencyDtoMapper,
    private readonly artistDtoMapper: ArtistDtoMapper,
    private readonly groupDtoMapper: GroupDtoMapper,
    private readonly contractDtoMapper: ContractDtoMapper,
    private readonly apprenticeDtoMapper: ApprenticeDtoMapper,
    private readonly getAgencyArtistsUseCase: GetAgencyArtistsUseCase,
    private readonly getAgencyApprenticesUseCase: GetAgencyApprenticesUseCase,
    private readonly getAgencyGroupsUseCase: GetAgencyGroupsUseCase,
    private readonly getArtistsWithDebutUseCase: GetArtistsWithDebutUseCase,
    private readonly getAgencyCollaborationsUseCase: GetAgencyCollaborationsUseCase,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    private readonly relateArtistToAgencyUseCase: RelateArtistToAgencyUseCase,
    @Inject(IContractRepository)
    private readonly contractRepository: IContractRepository,

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
  async getAgencyGroups(agencyId: string): Promise<GroupResponseDto[]>{
    const groups = await this.getAgencyGroupsUseCase.execute(agencyId);
    return this.groupDtoMapper.toResponseList(groups);
  }
  
  async getAgencyActiveArtistAndGruopInfo(agencyId: string): Promise<[ArtistResponseDto,GroupResponseDto | null][]>{
    const activeArtists = await this.agencyRepository.findActiveArtistsByAgency(agencyId);
    const result: [ArtistResponseDto, GroupResponseDto | null][] = [];
    for (const artist of activeArtists) {
    // Obtener el grupo actual del artista
    const currentGroup = await this.artistRepository.getArtistCurrentGroup(artist.getId());
    
    // Convertir artista a DTO
    const artistDto = this.artistDtoMapper.toResponse(artist);
    
    // Convertir grupo a DTO (si existe)
    let groupDto: GroupResponseDto | null = null;
    if (currentGroup) {
      groupDto = this.groupDtoMapper.toResponse(currentGroup);
    }
    
    result.push([artistDto, groupDto]);
  }
  
  return result;
  }
  
  async relateArtistToAgency(agencyId: string, createArtistAgencyDto: CreateArtistAgencyDto): Promise<ResponseArtistAgencyDto> {
    return await this.relateArtistToAgencyUseCase.execute(agencyId,createArtistAgencyDto);
  }

  async getArtistsWithDebutAndActiveContracts(agencyId: string): Promise<ArtistDebutContractResponseDto[]> {
    // Obtener artistas que han debutado en esta agencia
    const artistsWithDebut = await this.getArtistsWithDebutUseCase.execute(agencyId);
    
    const result: ArtistDebutContractResponseDto[] = [];

    for (const artist of artistsWithDebut) {
      // Obtener grupos de debut del artista
      const debutGroups = await this.artistRepository.getArtistGroups(artist.getId());
      
      // Obtener contratos activos del artista con esta agencia
      const artistContracts = await this.contractRepository.getArtistContracts(artist.getId());
      const activeContracts = artistContracts.filter((contract) => 
        contract.getStatus() === 'ACTIVO' && 
        contract.getAgencyId().getId() === agencyId
      );

      // Solo incluir si tiene contratos activos
      if (activeContracts.length > 0) {
        result.push({
          artist: this.artistDtoMapper.toResponse(artist),
          debutGroups: debutGroups.map(group => this.groupDtoMapper.toResponse(group)),
          activeContracts: activeContracts.map(contract => {
             return this.contractDtoMapper.toResponse(contract);
          })
        });
      }
    }

    return result;
  }
  async getAgencyCollaborations(agencyId: string): Promise<AgencyCollaborationsResponseDto> {
    return await this.getAgencyCollaborationsUseCase.execute(agencyId);
  }
}