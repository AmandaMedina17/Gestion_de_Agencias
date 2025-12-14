import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateArtistCollaborationDto {
  @IsNotEmpty()
  @IsString()
  artist1Id!: string;

  @IsNotEmpty()
  @IsString()
  artist2Id!: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
  date!: Date;

}