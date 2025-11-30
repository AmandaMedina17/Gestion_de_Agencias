import { ApprenticeStatus, ApprenticeTrainingLevel } from "../../../DomainLayer/Enums";

export class ApprenticeResponseDto{
    id!:string;
    fullName!: string;
    age!: number;
    status!: ApprenticeStatus
    trainingLevel!: ApprenticeTrainingLevel;
    entryDate!: Date;
    agency!: string;
}