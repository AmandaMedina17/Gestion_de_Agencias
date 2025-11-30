import { IncomeType } from "@domain/Enums"
import { Transform } from "class-transformer"
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class CreateIncomeDto {
    @IsNotEmpty()
    @IsEnum(IncomeType)
    type!: IncomeType

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    mount!: number

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date!: Date

    @IsNotEmpty()
    @IsString()
    responsible!: string

    @IsNotEmpty()
    @IsString()
    activityId!: string
}


