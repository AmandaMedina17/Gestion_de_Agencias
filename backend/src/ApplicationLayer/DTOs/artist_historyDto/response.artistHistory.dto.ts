import { ResponseAlbumDto } from "../albumDto/response.album.dto";
import { ArtistResponseDto } from "../artistDto/response-artist.dto";
import { ContractResponseDto } from "../contractDto/response-contract.dto";
import { GroupResponseDto } from "../groupDto/response-group.dto";

export class ResponseArtistHistoryDto {
    artist! : ArtistResponseDto;
    groups! : GroupResponseDto[];
    contracts! : ContractResponseDto[];
    albums! :ResponseAlbumDto[];
    
}