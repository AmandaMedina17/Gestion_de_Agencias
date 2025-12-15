import { IsNotEmpty, IsString,IsEnum, IsDate, IsNumber, IsOptional} from "class-validator";
import { ContractStatus } from "../../../DomainLayer/Enums";
import { Transform } from 'class-transformer';

export class CreateContractDto{
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
    startDate!: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
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