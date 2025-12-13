import { AgencyResponseDto } from '../agencyDto/response-agency.dto';
import { ArtistCollaborationResponseDto } from '../artistCollaborationsDto/response-artist-collaboration.dto';
import { ArtistGroupCollaborationResponseDto } from '../artist_groupCollaborationDto/response-artist-group-collaboration.dto';
export class AgencyCollaborationsResponseDto {
    agency!: AgencyResponseDto;
    artistCollaborations!: ArtistCollaborationResponseDto[];
    artist_groupCollaborations!: ArtistGroupCollaborationResponseDto[];
}