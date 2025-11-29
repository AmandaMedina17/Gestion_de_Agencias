import { ContractStatus } from "../../../DomainLayer/Enums";
import { CreateArtistDto } from "../artistDto/create-artist.dto";
import { CreateContractDto } from "./create-contract.dto";

export class ContractResponseDto{
    id!:string;
    startDate!: Date;
    endDate!: Date;
    agency!: CreateContractDto;
    artist!: CreateArtistDto;
    distributionPercentage!: number;
    status!: ContractStatus;
    conditions!: string;
}      
