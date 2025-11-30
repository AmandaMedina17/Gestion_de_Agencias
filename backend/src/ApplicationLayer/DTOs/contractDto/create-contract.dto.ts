import { IsNotEmpty, IsString,IsEnum, IsDate, IsNumber} from "class-validator";
import { ContractStatus } from "../../../DomainLayer/Enums";

export class CreateContractDto{
    @IsNotEmpty()
    @IsDate()
    startDate!: Date;

    @IsNotEmpty()
    @IsDate()
    endDate!: Date;

    @IsNotEmpty()
    @IsString()
    agencyId!: string;

    @IsNotEmpty()
    @IsString()
    artistId!: string;

    @IsNotEmpty()
    @IsNumber()
    distributionPercentage!: number;
    
    @IsNotEmpty()
    @IsEnum(ContractStatus)
    status!: ContractStatus;

    @IsNotEmpty()
    @IsString()
    conditions!: string;
  
    
}