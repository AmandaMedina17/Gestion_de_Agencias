// src/services/AlbumService.ts
import { BaseService } from "./BaseService";
import { CreateAlbumDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/create.album.dto";
import { ResponseAlbumDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/response.album.dto";
import { UpdateAlbumDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/update.album.dto";
import { AssignAlbumToArtistDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/assign-album-to-artist.dto";
import { AssignAlbumToGroupDto } from "../../../backend/src/ApplicationLayer/DTOs/albumDto/assign-album-to-group.dto";

export class AlbumService extends BaseService<CreateAlbumDto, ResponseAlbumDto> {
  constructor() {
    super("http://localhost:3000/album");
  }

  // Método para actualizar un álbum - Usa el método update heredado del BaseService
  async update(id: string, updateData: CreateAlbumDto): Promise<ResponseAlbumDto> {
    return super.update(id, updateData);
  }

  // Método para eliminar un álbum - Usa el método remove heredado del BaseService
  async remove(id: string): Promise<void> {
    return super.remove(id);
  }

  // Método para asignar álbum a artista - Usa putCustom
  async assignToArtist(dto: AssignAlbumToArtistDto): Promise<ResponseAlbumDto> {
    return this.putCustom<ResponseAlbumDto>("assign-to-artist", dto);
  }

  // Método para asignar álbum a grupo - Usa putCustom
  async assignToGroup(dto: AssignAlbumToGroupDto): Promise<ResponseAlbumDto> {
    return this.putCustom<ResponseAlbumDto>("assign-to-group", dto);
  }

  // Método para obtener álbumes por artista
  async getAlbumsByArtist(artistId: string): Promise<ResponseAlbumDto[]> {
    return this.getCustom<ResponseAlbumDto[]>(`artist/${artistId}`);
  }

  // Método para obtener álbumes por grupo
  async getAlbumsByGroup(groupId: string): Promise<ResponseAlbumDto[]> {
    return this.getCustom<ResponseAlbumDto[]>(`group/${groupId}`);
  }

  // Método para obtener los hits de un álbum
  async getAlbumHits(albumId: string): Promise<any[]> {
    return this.getCustom<any[]>(`hits/${albumId}`);
  }

  // Método para obtener las canciones de un álbum
  async getAlbumSongs(albumId: string): Promise<any[]> {
    return this.getCustom<any[]>(`songs/${albumId}`);
  }

  // Método para obtener los premios de un álbum
  async getAlbumAwards(albumId: string): Promise<any[]> {
    return this.getCustom<any[]>(`awards/${albumId}`);
  }

  // Método para buscar álbumes por título
  async searchAlbumsByTitle(title: string): Promise<ResponseAlbumDto[]> {
    return this.getCustom<ResponseAlbumDto[]>(`search/${encodeURIComponent(title)}`);
  }
}

// Instancia del servicio
export const albumService = new AlbumService();