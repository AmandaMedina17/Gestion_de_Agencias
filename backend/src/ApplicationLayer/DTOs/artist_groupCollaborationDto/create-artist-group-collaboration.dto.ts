import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateArtistGroupCollaborationDto {
  @IsNotEmpty()
  @IsString()
  artistId!: string;

  @IsNotEmpty()
  @IsString()
  groupId!: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
  date!: Date;

}