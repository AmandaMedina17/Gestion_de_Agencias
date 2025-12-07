import { ApprenticeStatus, ApprenticeTrainingLevel } from "../../../DomainLayer/Enums";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateApprenticeDto{
    @IsNotEmpty()
    @IsString()
    fullName!: string;

    age!:number;

    @IsNotEmpty()
    @IsEnum(ApprenticeStatus)
    status!: ApprenticeStatus;

    @IsNotEmpty()
    @IsEnum(ApprenticeTrainingLevel)
    trainingLevel!:ApprenticeTrainingLevel;

    entryDate!: Date;

    @IsNotEmpty()
    @IsString()
    agency!: string;
    
}