import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

export class GetGroupCalendaryDto {
  @IsNotEmpty()
  @IsString()
  groupId!: string;

  @IsNotEmpty()
  @IsISO8601()
  start_date!: Date;

  @IsNotEmpty()
  @IsISO8601()
  end_date!: Date;
}