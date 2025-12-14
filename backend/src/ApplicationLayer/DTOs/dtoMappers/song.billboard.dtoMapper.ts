import { SongBillboard } from "@domain/Entities/SongBillboard"
import { BaseDtoMapper } from "./DtoMapper"
import { ResponseSongBillboardDto } from "../SongBillboardDto/response.songBillboard.dto"
import { AddSongToBillboardDto } from "../SongBillboardDto/add.sonBillboard.dto"
import { Injectable, NotImplementedException } from "@nestjs/common"
import { SongDtoMapper } from "./song.dto.mapper"
import { BillboardListDtoMapper } from "./billboardList.dto.mapper"
import { console } from "inspector"

@Injectable()
export class SongBillboardDtoMapper extends BaseDtoMapper<SongBillboard,AddSongToBillboardDto,ResponseSongBillboardDto> {
    constructor(
        private readonly songDtoMapper : SongDtoMapper,
        private readonly billboardDtoMapper : BillboardListDtoMapper
    ){
        super()
    }
    fromDto(dto: AddSongToBillboardDto): SongBillboard {
        throw new NotImplementedException("The inclution of a song on billboard have a logic to much complex")
    }
    toResponse(domain: SongBillboard): ResponseSongBillboardDto {
        
        console.log(domain);

        return {
            song: this.songDtoMapper.toResponse(domain.getSong()),
            billBoard :  this.billboardDtoMapper.toResponse(domain.getBillboard()),
            place : domain.getPlace(),
            date : domain.getEntryDate()
        };
    }
}