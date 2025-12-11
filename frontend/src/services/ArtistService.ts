import { BaseService } from "./BaseService";
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';

export const artistService = new BaseService<
  CreateArtistDto,
  ArtistResponseDto
>("http://localhost:3000/artists");
