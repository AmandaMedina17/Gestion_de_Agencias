import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from './base.service';
import { Place } from '@domain/Entities/Place';
import { CreatePlaceDto } from '@application/DTOs/placeDto/create-place.dto';
import { PlaceResponseDto } from '@application/DTOs/placeDto/response-place.dto';
import { IPlaceRepository } from '@domain/Repositories/IPlaceRepository';
import { UpdatePlaceDto } from '@application/DTOs/placeDto/update-place.dto';
import { PlaceDtoMapper } from '@application/DTOs/dtoMappers/place.dtoMapper';

@Injectable()
export class PlaceService extends BaseService<Place, CreatePlaceDto, PlaceResponseDto, UpdatePlaceDto> {
  constructor(
    @Inject(IPlaceRepository)
    private readonly placeRepository: IPlaceRepository,
    private readonly placeDtoMapper: PlaceDtoMapper
  ) {
    super(placeRepository, placeDtoMapper)
  }
}