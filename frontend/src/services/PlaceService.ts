import { BaseService } from "./BaseService";
import { CreatePlaceDto } from "../../../backend/src/ApplicationLayer/DTOs/placeDto/create-place.dto";
import { PlaceResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/placeDto/response-place.dto";

export const placeService = new BaseService<
  CreatePlaceDto,
  PlaceResponseDto
>("http://localhost:3000/places");