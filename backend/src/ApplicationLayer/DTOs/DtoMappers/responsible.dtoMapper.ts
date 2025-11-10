import { CreateResponsibleDto } from '../ResponsibleDto/create-responsible.dto';
import { ResponsibleResponseDto } from '../ResponsibleDto/create-responsible.dto';
import { Responsible } from '@domain/Entities/Responsible';
import { BaseDtoMapper } from './DtoMapper';

export class ResponsibleDtoMapper extends BaseDtoMapper<Responsible, CreateResponsibleDto, ResponsibleResponseDto>{
  fromDto(dto: CreateResponsibleDto): Responsible {
    return Responsible.create(dto.name)
  };

  toResponse(domain: Responsible): ResponsibleResponseDto {
    return {
        id: domain.getId(),
        name: domain.getName()
    };
  }
}