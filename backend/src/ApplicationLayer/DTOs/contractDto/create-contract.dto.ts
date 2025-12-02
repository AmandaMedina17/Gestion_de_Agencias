import { IsNotEmpty, IsString,IsEnum, IsDate, IsNumber} from "class-validator";
import { ContractStatus } from "../../../DomainLayer/Enums";
import { Transform } from "class-transformer";

export class CreateContractDto{
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value)) 
    @IsDate()
    startDate!: Date;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value)) 
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