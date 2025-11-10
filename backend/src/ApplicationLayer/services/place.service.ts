import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from './base.service';
import { Place } from '@domain/Entities/Place';
import { CreatePlaceDto } from '@application/DTOs/placeDto/create-place.dto';
import { PlaceResponseDto } from '@application/DTOs/placeDto/response-place.dto';
import { IPlaceRepository } from '@domain/Repositories/IPlaceRepository';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';

@Injectable()
export class PlaceService extends BaseService<Place, CreatePlaceDto, PlaceResponseDto> {
  constructor(
    @Inject(IPlaceRepository)
    private readonly placeRepository: IPlaceRepository,
    private readonly placeDtoMapper: BaseDtoMapper<Place, CreatePlaceDto, PlaceResponseDto>
  ) {
    super(placeRepository, placeDtoMapper)
  }
}
