import { Injectable, Inject } from '@nestjs/common';
import { IResponsibleRepository } from '@domain/Repositories/IResponsibleRepository';
import { Responsible } from '@domain/Entities/Responsible';
import { CreateResponsibleDto} from '../DTOs/responsibleDto/create-responsible.dto';
import { ResponsibleResponseDto } from '@application/DTOs/responsibleDto/response-responsible.dto';
import { BaseService } from './base.service';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';

@Injectable()
export class ResponsibleService extends BaseService<Responsible, CreateResponsibleDto, ResponsibleResponseDto> {
  constructor(
    @Inject(IResponsibleRepository)
    private readonly responsibleRepository: IResponsibleRepository,
    private readonly responsibleDtoMapper: BaseDtoMapper<Responsible, CreateResponsibleDto, ResponsibleResponseDto>
  ) {
    super(responsibleRepository, responsibleDtoMapper)
  }
}
