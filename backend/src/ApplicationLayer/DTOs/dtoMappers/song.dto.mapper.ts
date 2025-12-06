import { Song } from "@domain/Entities/Song";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateSongDto } from "../songDto/create.song.dto";
import { ResponseSongDto } from "../songDto/response.song.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SongDtoMapper extends BaseDtoMapper<Song, CreateSongDto, ResponseSongDto>{

  fromDto(dto: CreateSongDto): Song { 
    throw new Error('Song creation requires complex logic. Use CreateIncomeUseCase instead.');
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