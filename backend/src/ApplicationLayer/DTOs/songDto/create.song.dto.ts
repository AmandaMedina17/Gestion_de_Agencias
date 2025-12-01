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
   releaseDate? : Date
}