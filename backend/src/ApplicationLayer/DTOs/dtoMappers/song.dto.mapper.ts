import { Song } from "@domain/Entities/Song";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateSongDto } from "../songDto/create.song.dto";
import { ResponseSongDto } from "../songDto/response.song.dto";
import { IRepository } from "@domain/Repositories/IRepository";
import { Inject } from "@nestjs/common";
import { SONG_REPOSITORY } from "@domain/Repositories/ISongRepository";
import { SongRepository } from "@infrastructure/database/Repositories/SongRepository";
import { ALBUM_REPOSITORY, IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { Album } from "@domain/Entities/Album";

export class SongDtoMapper extends BaseDtoMapper<Song, CreateSongDto, ResponseSongDto>{

    constructor(
      private albumRepository :IAlbumRepository
    ) 
    {
      super();
    }
    
    //Este metodo esta peligroso posible problema 

   fromDto(dto: CreateSongDto): Song {
    //tengo puesto que la cancion tiene que tener album obligado en el create dto 
    //Revisar que en la SongEntity esto ultimo se pueda meter en la base de datos como null 
    const album = this.albumRepository.findByTitle(dto.nameAlbum);

    return Song.create(dto.nameSong,(album as unknown as Album).getId(), 
                        dto.releaseDate ==  undefined ? new Date() : dto.releaseDate )//verificar que con then creo que se pue hacer 
  };

  toResponse(domain: Song): ResponseSongDto {
    return {
        id: domain.getId(),
        name: domain.getName(),
        albumId : domain.getAlbumId(),
        fecha : domain.getDate()
    };
  }
 
}