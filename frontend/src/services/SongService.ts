import { BaseService } from "./BaseService";
import { CreateSongDto } from "../../../backend/src/ApplicationLayer/DTOs/songDto/create.song.dto";
import { ResponseSongDto } from "../../../backend/src/ApplicationLayer/DTOs/songDto/response.song.dto";

export const songService = new BaseService<
  CreateSongDto,
  ResponseSongDto
>("http://localhost:3000/song");