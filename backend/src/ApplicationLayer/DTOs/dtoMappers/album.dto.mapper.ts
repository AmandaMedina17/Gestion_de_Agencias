import { Album } from "@domain/Entities/Album";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateAlbumDto } from "../albumDto/create.album.dto";
import { ResponseAlbumDto } from "../albumDto/response.album.dto";
import { error } from "console";
import { Injectable } from "@nestjs/common";
import { Song } from "@domain/Entities/Song";

@Injectable()
export class AlbumDtoMapper extends BaseDtoMapper<Album,CreateAlbumDto,ResponseAlbumDto>{
    fromDto(dto: CreateAlbumDto): Album {
        if(!dto.title)
            throw new Error("Title provided to album")

        if(!dto.mainProducer)
            throw new Error("Main producer not provided to album")

        return Album.create(dto.title,dto.date!,dto.mainProducer,dto.copiesSold)
    }
    toResponse(domain: Album): ResponseAlbumDto {
        return {
            id: domain.getId(),
            title: domain.getTitle(),
            releaseDate : domain.getReleaseDate(),
            mainProducer: domain.getMainProducer(),
            copiesSold: domain.getCopiesSold(),
            numberOfTracks: domain.getNumberOfTracks(),
        };
    }
    
}