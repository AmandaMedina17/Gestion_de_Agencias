import { ArtistResponseDto } from "../artistDto/response-artist.dto";
import { ResponseAwardDto } from "../AwardDto/response.award.dto";
import { GroupResponseDto } from "../groupDto/response-group.dto";
import { ResponseSongBillboardDto } from "../SongBillboardDto/response.songBillboard.dto";

export class ArtistMainHitsDTO {
    artist!: ArtistResponseDto;
    aloneMainHits!: {
        songBillboard: ResponseSongBillboardDto[];
        awards: ResponseAwardDto[];
    };
    lastGroupMainHits!: {
        group: GroupResponseDto;
        songBillboard: ResponseSongBillboardDto[];
        awards: ResponseAwardDto[];
    };
}