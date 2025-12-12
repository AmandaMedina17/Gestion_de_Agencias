import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateArtistAgencyDto{
    @IsNotEmpty()
    @IsString()
    artistid!: string;
    
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
    startDate!: Date;

    @IsOptional()
    @IsDate()
    @IsOptional()
    @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
    endDate?: Date;
}
