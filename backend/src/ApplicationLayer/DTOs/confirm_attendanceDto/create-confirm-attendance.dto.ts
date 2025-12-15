import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmAttendanceDto {
  @IsNotEmpty()
  @IsString()
  artistId!: string;

  @IsNotEmpty()
  @IsString()
  activityId!: string;

  @IsNotEmpty()
  @IsBoolean()
  confirm!: boolean; // true para confirmar, false para negar
}