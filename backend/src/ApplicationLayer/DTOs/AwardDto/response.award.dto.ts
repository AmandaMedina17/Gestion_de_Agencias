import { ResponseAlbumDto } from "../albumDto/response.album.dto";

export class ResponseAwardDto{
    id!: string;
    name!:string;
    date!: Date;
    album? : ResponseAlbumDto
}