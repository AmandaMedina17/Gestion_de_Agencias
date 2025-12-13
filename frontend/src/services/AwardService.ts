// src/services/AwardService.ts
import { BaseService } from "./BaseService";
import { CreateAwardDto } from "../../../backend/src/ApplicationLayer/DTOs/AwardDto/create.award.dto";
import { ResponseAwardDto } from "../../../backend/src/ApplicationLayer/DTOs/AwardDto/response.award.dto";

export class AwardService extends BaseService<
  CreateAwardDto,
  ResponseAwardDto
> {
  constructor() {
    super("http://localhost:3000/award");
  }

  // Método para asignar un premio a un álbum
  async assignAwardToAlbum(awardId: string, albumId: string): Promise<ResponseAwardDto> {
    return this.postCustom<ResponseAwardDto>(`${awardId}/${albumId}`, {});
  }

  // Método para obtener premios por álbum
  async getAwardsByAlbumId(albumId: string): Promise<ResponseAwardDto[]> {
    return this.getCustom<ResponseAwardDto[]>(`album/${albumId}`);
  }

  // Método para obtener premios por artista
  async getAwardsByArtistId(artistId: string): Promise<ResponseAwardDto[]> {
    return this.getCustom<ResponseAwardDto[]>(`artist/${artistId}`);
  }

  // Método para obtener premios por grupo
  async getAwardsByGroupId(groupId: string): Promise<ResponseAwardDto[]> {
    return this.getCustom<ResponseAwardDto[]>(`group/${groupId}`);
  }
}

// Instancia del servicio
export const awardService = new AwardService();