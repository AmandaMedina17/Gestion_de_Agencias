import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class AddSongToBillboardDto {
    @IsString()
    songId!:string

    @IsString()
    billboardId!:string

    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    place!:number

    @IsDate()
    @Transform(({ value }) => new Date(value))
    date! : Date
}