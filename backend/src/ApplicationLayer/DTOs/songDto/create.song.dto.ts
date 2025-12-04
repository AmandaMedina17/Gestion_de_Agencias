import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSongDto {
   
   @IsNotEmpty()
   @IsString()
   nameSong!: string 

   @IsNotEmpty()
   @IsString()
   idAlbum! : string

   @IsOptional()
   @IsDate()
   @Transform(({ value }) => new Date(value))
   releaseDate! : Date
}