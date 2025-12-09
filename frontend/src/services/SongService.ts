// src/services/SongService.ts
import { BaseService } from "./BaseService";
import { CreateSongDto } from "../../../backend/src/ApplicationLayer/DTOs/songDto/create.song.dto";
import { ResponseSongDto } from "../../../backend/src/ApplicationLayer/DTOs/songDto/response.song.dto";

export class SongService extends BaseService<
  CreateSongDto,
  ResponseSongDto
> {
  constructor() {
    super("http://localhost:3000/song");
  }

  // Método para obtener canciones por álbum
  async getSongsByAlbumId(albumId: string): Promise<ResponseSongDto[]> {
    return this.getCustom<ResponseSongDto[]>(`album/${albumId}`);
  }

  // Método para obtener canciones por artista
  async getSongsByArtistId(artistId: string): Promise<ResponseSongDto[]> {
    return this.getCustom<ResponseSongDto[]>(`artist/${artistId}`);
  }

  // Método para obtener canciones por grupo
  async getSongsByGroupId(groupId: string): Promise<ResponseSongDto[]> {
    return this.getCustom<ResponseSongDto[]>(`group/${groupId}`);
  }

  // Método para buscar canciones por nombre
  async searchSongsByName(name: string): Promise<ResponseSongDto[]> {
    return this.getCustom<ResponseSongDto[]>(`search/${encodeURIComponent(name)}`);
  }
}

// Instancia del servicio
export const songService = new SongService();