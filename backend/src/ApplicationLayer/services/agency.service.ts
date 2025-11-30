import { Injectable, Inject } from '@nestjs/common';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { Agency } from '@domain/Entities/Agency';
import { CreateAgencyDto} from '../DTOs/agencyDto/create-agency.dto';
import { AgencyResponseDto } from '@application/DTOs/agencyDto/response-agency.dto';
import { BaseService } from './base.service';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { UpdateAgencyDto } from '@application/DTOs/agencyDto/update-agency.dto';
import { AgencyDtoMapper } from '@application/DTOs/dtoMappers/agency.dtoMapper';

@Injectable()
export class AgencyService extends BaseService<Agency, CreateAgencyDto, AgencyResponseDto, UpdateAgencyDto> {
  constructor(
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
    private readonly agencyDtoMapper: AgencyDtoMapper
  ) {
    super(agencyRepository, agencyDtoMapper)
  }
}