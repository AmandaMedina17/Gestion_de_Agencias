import { BaseService } from "./BaseService";
import { CreatePlaceDto, PlaceResponseDto } from "./dtos/PlaceDto";

export const placeService = new BaseService<
  CreatePlaceDto,
  PlaceResponseDto
>("http://localhost:3000/place");
