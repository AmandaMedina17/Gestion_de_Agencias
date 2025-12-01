import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAlbumDto {
   @IsNotEmpty()
   @IsString()
   title! : string

   @IsOptional()
   @IsDate()
   date! : Date

   @IsOptional()
   @IsNumber()
   numberOfSongs! : Number

   
}