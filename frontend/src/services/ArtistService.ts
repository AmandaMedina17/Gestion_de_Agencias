import { BaseService } from "./BaseService";
import { CreateArtistDto, ArtistResponseDto } from "./dtos/ArtistDto";

export const artistService = new BaseService<
  CreateArtistDto,
  ArtistResponseDto
>("http://localhost:3000/artist");
