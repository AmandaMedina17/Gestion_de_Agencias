import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddMemberToGroupDto {
  @IsNotEmpty()
  @IsString()
  artistId!: string;

  @IsNotEmpty()
  @IsString()
  role!: string;

  // @IsDateString()
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  endDate?: Date;
}