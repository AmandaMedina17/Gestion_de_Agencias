import { IsString, IsNotEmpty } from 'class-validator';

export class ScheduleArtistDto {
  @IsNotEmpty()
  @IsString()
  artistId!: string;

  @IsNotEmpty()
  @IsString()
  activityId!: string;

}