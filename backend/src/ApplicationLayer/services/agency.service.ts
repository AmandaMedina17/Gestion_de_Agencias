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
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dto';
import { Apprentice } from '@domain/Entities/Apprentice';
import { ApprenticeResponseDto } from '@application/DTOs/apprenticeDto/response-apprentice.dto';
import { GetAgencyArtistsUseCase } from '../UseCases/get_agency_artists.use-case';
import { ApprenticeDtoMapper } from '../DTOs/dtoMappers/apprentice.dtoMapper';
import { GetAgencyApprenticesUseCase } from '../UseCases/get_agency_apprentices.use-case';
@Injectable()
export class AgencyService extends BaseService<Agency, CreateAgencyDto, AgencyResponseDto, UpdateAgencyDto> {
    constructor(
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
    private readonly agencyDtoMapper: AgencyDtoMapper,
    private readonly artistDtoMapper: ArtistDtoMapper,
    private readonly apprenticeDtoMapper: ApprenticeDtoMapper,
    private readonly getAgencyArtistsUseCase: GetAgencyArtistsUseCase,
    private readonly getAgencyApprenticesUseCase: GetAgencyApprenticesUseCase

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
}