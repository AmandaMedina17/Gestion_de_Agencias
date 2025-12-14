import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateAgencyDto{
    @IsNotEmpty()
    @IsUUID()
    placeId!: string;
    
    @IsNotEmpty()
    @IsString()
    nameAgency!: string;
    
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
    dateFundation!: Date;

}