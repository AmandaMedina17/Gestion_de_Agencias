import { Place } from '@domain/Entities/Place';
import { BaseDtoMapper } from './DtoMapper';
import { CreatePlaceDto } from '../placeDto/create-place.dto';
import { PlaceResponseDto } from '../placeDto/response-place.dto';

export class PlaceDtoMapper extends BaseDtoMapper<Place, CreatePlaceDto, PlaceResponseDto>{
    
  fromDto(dto: CreatePlaceDto): Place {
    return Place.create(dto.name)
  };

  toResponse(domain: Place): PlaceResponseDto {
    return {
        id: domain.getId(),
        name: domain.getName()
    };
  }
}