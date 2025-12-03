import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAlbumDto {
   @IsNotEmpty()
   @IsString()
   title! : string

   @IsOptional()
   @IsDate()
   @Transform(({ value }) => new Date(value))
   date? : Date

   @IsNotEmpty()
   @IsString()
   mainProducer!: string

   @IsOptional()
   @IsNumber()
   @Transform(({ value }) => parseInt(value, 10))
   copiesSold!:number

}