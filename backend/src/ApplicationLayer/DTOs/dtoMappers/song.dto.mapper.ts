import { Song } from "@domain/Entities/Song";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateSongDto } from "../songDto/create.song.dto";
import { ResponseSongDto } from "../songDto/response.song.dto";

export class SongDtoMapper extends BaseDtoMapper<Song, CreateSongDto, ResponseSongDto>{

  fromDto(dto: CreateSongDto): Song { 
    
    if(!dto.nameSong)
      throw new Error("Name of the song is missing");

    if(!dto.idAlbum)
      throw new Error("Album not provided")

    return Song.create(dto.nameSong, dto.idAlbum, dto.releaseDate != undefined ? dto.releaseDate   : new Date())
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