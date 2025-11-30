import { ContractStatus } from "../../../DomainLayer/Enums";
import { CreateArtistDto } from "../artistDto/create-artist.dto";
import { CreateAgencyDto } from "../agencyDto/create-agency.dto";

export class ContractResponseDto{
    id!:string;
    startDate!: Date;
    endDate!: Date;
    agency!: CreateAgencyDto;
    artist!: CreateArtistDto;
    distributionPercentage!: number;
    status!: ContractStatus;
    conditions!: string;
}      
