import { ApprenticeStatus, ApprenticeTrainingLevel } from "@domain/Enums";

export class ApprenticeResponseDto{
    id!:string;
    fullName!: string;
    age!: number;
    status!: ApprenticeStatus
    trainingLevel!: ApprenticeTrainingLevel;
    entryDate!: Date;
}