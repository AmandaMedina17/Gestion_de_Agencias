import { ApprenticeStatus, ApprenticeTrainingLevel } from "../../../DomainLayer/Enums";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateApprenticeDto{
    @IsNotEmpty()
    @IsString()
    fullName!: string;

    age!:number;

    status!: ApprenticeStatus;

    trainingLevel!:ApprenticeTrainingLevel;

    entryDate!: Date;

    agency!: string;
    
}