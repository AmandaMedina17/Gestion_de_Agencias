import { ContractStatus } from "../../../DomainLayer/Enums";
import { AgencyResponseDto } from "../agencyDto/response-agency.dto";
import { ArtistResponseDto } from "../artistDto/response-artist.dto";

export class ContractResponseDto{
    id!:string;
    startDate!: Date;
    endDate?: Date | null;
    agency!: AgencyResponseDto;
    artist!: ArtistResponseDto;
    distributionPercentage!: number;
    status!: ContractStatus;
    conditions!: string;
}      
