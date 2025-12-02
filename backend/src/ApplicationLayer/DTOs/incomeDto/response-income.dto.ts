import { IncomeType } from "../../../DomainLayer/Enums";

export class IncomeResponseDto {
    id!: string;
    activityId!: string
    incomeType!: IncomeType
    mount!: number
    date!: Date
    responsible!: string
    
}