import { ArtistStatus } from "../../../DomainLayer/Enums";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateArtistAgencyDto{
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
    startDate!: Date;

    @IsDate()
    @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
    endDate?: Date;
}
 