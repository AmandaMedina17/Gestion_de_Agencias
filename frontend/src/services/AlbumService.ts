// src/services/AlbumService.ts
import { BaseService } from "./BaseService";
import { CreateAlbumDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/create.album.dto";
import { ResponseAlbumDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/response.album.dto";

export class AlbumService extends BaseService<
  CreateAlbumDto,
  ResponseAlbumDto
> {
  constructor() {
    super("http://localhost:3000/album");
  }

  // Método para obtener álbumes por artista
  async getAlbumsByArtistId(artistId: string): Promise<ResponseAlbumDto[]> {
    return this.getCustom<ResponseAlbumDto[]>(`artist/${artistId}`);
  }

  // Método para obtener álbumes por grupo
  async getAlbumsByGroupId(groupId: string): Promise<ResponseAlbumDto[]> {
    return this.getCustom<ResponseAlbumDto[]>(`group/${groupId}`);
  }

  // Método para obtener los premios de un álbum
  async getAlbumAwards(albumId: string): Promise<any[]> {
    return this.getCustom<any[]>(`${albumId}/awards`);
  }

  // Método para obtener las canciones de un álbum
  async getAlbumSongs(albumId: string): Promise<any[]> {
    return this.getCustom<any[]>(`${albumId}/songs`);
  }

  // Método para buscar álbumes por título
  async searchAlbumsByTitle(title: string): Promise<ResponseAlbumDto[]> {
    return this.getCustom<ResponseAlbumDto[]>(`search/${encodeURIComponent(title)}`);
  }
}

// Instancia del servicio
export const albumService = new AlbumService();