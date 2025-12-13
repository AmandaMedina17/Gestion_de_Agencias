import { ActivityResponseDto } from "../activityDto/response-activity.dto";
import { DebutHistoryItemResponseDto } from "../artist_debut_historyDto/response-artist_debut_history.dto";
import { ArtistGroupCollaborationResponseDto } from "../artist_groupCollaborationDto/response-artist-group-collaboration.dto";
import { ArtistCollaborationResponseDto } from "../artistCollaborationsDto/response-artist-collaboration.dto";
import { ArtistResponseDto } from "../artistDto/response-artist.dto";
import { ContractResponseDto } from "../contractDto/response-contract.dto";

export class ProfessionalHistoryResponseDto {
  artist!: ArtistResponseDto;
  
  activeContracts!: ContractResponseDto[];

  debutHistory!: DebutHistoryItemResponseDto[];
  
  artistCollaborations!: ArtistCollaborationResponseDto[];
  
  groupCollaborations!: ArtistGroupCollaborationResponseDto[];
  
  activities!: ActivityResponseDto[];
  
}