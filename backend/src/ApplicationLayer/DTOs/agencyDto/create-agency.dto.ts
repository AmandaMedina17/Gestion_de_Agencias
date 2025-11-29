import { IsNotEmpty, IsString } from "class-validator";

export class CreateAgencyDto{
    @IsNotEmpty()
    @IsString()
    place!: string;
    
    nameAgency!: string;
    
    dateFundation!: Date;
    
}