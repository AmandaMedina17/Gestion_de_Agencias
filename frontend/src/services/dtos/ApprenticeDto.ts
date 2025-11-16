import { ApprenticeStatus, ApprenticeTrainingLevel } from "../../../../backend/src/DomainLayer/Enums";

export interface CreateApprenticeDto{
    fullName: string;
    age: number;
    status: ApprenticeStatus;
    trainingLevel: ApprenticeTrainingLevel;
    entryDate: Date;
}

export interface ApprenticeResponseDto{
    id:string;
    fullName: string;
    age: number;
    status: ApprenticeStatus;
    trainingLevel: ApprenticeTrainingLevel;
    entryDate: Date;
}