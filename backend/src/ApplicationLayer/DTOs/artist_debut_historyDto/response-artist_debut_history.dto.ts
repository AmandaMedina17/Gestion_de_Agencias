import { ActivityResponseDto } from "../activityDto/response-activity.dto";
import { ArtistResponseDto } from "../artistDto/response-artist.dto";
import { ContractResponseDto } from "../contractDto/response-contract.dto";
import { GroupResponseDto } from "../groupDto/response-group.dto";

export class ArtistDebutHistoryWithActivitiesAndContractsResponseDto
{
    artist! : ArtistResponseDto;
    contracts! : ContractResponseDto[];
    activities! : ActivityResponseDto[];
    debutHistory! : DebutHistoryItemResponseDto[];
}

export class DebutHistoryItemResponseDto{
    group!: GroupResponseDto;
    role!: string;
    debutDate!: Date;
    startDate!: Date;
    endDate?: Date | null;
}