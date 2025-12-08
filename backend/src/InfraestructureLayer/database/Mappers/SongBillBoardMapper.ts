import { BaseDtoMapper } from "@application/DTOs/dtoMappers/DtoMapper";
import { SongBillboardEntity } from "../Entities/SongBillboardEntity";
import { AddSongToBillboardDto } from "@application/DTOs/SongBillboardDto/add.sonBillboard.dto";
import { ResponseSongBillboardDto } from "@application/DTOs/SongBillboardDto/response.songBillboard.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SongBillBoardMapper extends BaseDtoMapper<SongBillboardEntity, AddSongToBillboardDto, ResponseSongBillboardDto>{

  fromDto(dto: AddSongToBillboardDto): SongBillboardEntity { 
    throw new Error('Song creation requires complex logic. Use AddSongBillboardUseCase instead.');
  };

  toResponse(infr: SongBillboardEntity): ResponseSongBillboardDto{
    return {
        songId: infr.songId,
        billBoardId: infr.billboardListId,
        place : infr.place,
        date : infr.entryDate
    };
  }

 
}