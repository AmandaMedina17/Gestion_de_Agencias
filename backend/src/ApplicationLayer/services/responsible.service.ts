import { Injectable, Inject } from '@nestjs/common';
import { IResponsibleRepository } from '@domain/Repositories/IResponsibleRepository';
import { Responsible } from '@domain/Entities/Responsible';
import { CreateResponsibleDto} from '../DTOs/responsibleDto/create-responsible.dto';
import { ResponsibleResponseDto } from '@application/DTOs/responsibleDto/response-responsible.dto';
import { BaseService } from './base.service';
import { UpdateResponsibleDto } from '@application/DTOs/responsibleDto/update-responsible.dto';
import { ResponsibleDtoMapper } from '@application/DTOs/dtoMappers/responsible.dtoMapper';

@Injectable()
export class ResponsibleService extends BaseService<Responsible, CreateResponsibleDto, ResponsibleResponseDto, UpdateResponsibleDto> {
  constructor(
    @Inject(IResponsibleRepository)
    private readonly responsibleRepository: IResponsibleRepository,
    private readonly responsibleDtoMapper: ResponsibleDtoMapper
  ) {
    super(responsibleRepository, responsibleDtoMapper)
  }
}