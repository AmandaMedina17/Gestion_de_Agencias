import { ResponseBillboardListDto } from "../billboardDto/response.billboard.dto"
import { ResponseSongDto } from "../songDto/response.song.dto"

export class ResponseSongBillboardDto {
    song! : ResponseSongDto
    billBoard! : ResponseBillboardListDto
    place!:number
    date!:Date
}