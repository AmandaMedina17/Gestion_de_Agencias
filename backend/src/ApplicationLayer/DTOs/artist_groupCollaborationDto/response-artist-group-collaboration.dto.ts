import { ArtistResponseDto } from "../artistDto/response-artist.dto";
import { GroupResponseDto } from "../groupDto/response-group.dto";

export class ArtistGroupCollaborationResponseDto{
    artist! : ArtistResponseDto;
    group! : GroupResponseDto;
    date!: Date;
}