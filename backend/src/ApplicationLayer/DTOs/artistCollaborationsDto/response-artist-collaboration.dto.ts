import { ArtistResponseDto } from "../artistDto/response-artist.dto";

export class ArtistCollaborationResponseDto{
    artist1! : ArtistResponseDto;
    artist2! : ArtistResponseDto;
    date!: Date;
}