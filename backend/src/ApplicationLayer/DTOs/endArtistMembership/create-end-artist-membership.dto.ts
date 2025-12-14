import { IsNotEmpty, IsString,IsEnum, IsDate, IsNumber, IsOptional} from "class-validator";
import { ContractStatus } from "../../../DomainLayer/Enums";
import { Transform } from 'class-transformer';

export class CreateEndMembershipDto{
    @IsNotEmpty()
    @IsString()
    agencyId!: string;

    @IsNotEmpty()
    @IsString()
    artistId!: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
    leaveDate!: Date;

}
