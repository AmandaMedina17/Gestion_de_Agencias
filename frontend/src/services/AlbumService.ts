import { BaseService } from "./BaseService";
import { CreateAlbumDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/create.album.dto";
import { ResponseAlbumDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/response.album.dto";

export const albumService = new BaseService<
  CreateAlbumDto,
  ResponseAlbumDto
>("http://localhost:3000/album");