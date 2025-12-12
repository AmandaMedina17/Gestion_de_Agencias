import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsUUID, IsDate, IsISO8601 } from 'class-validator';

export class GetGroupCalendaryDto {
  @IsNotEmpty()
  @IsUUID()
  groupId!: string;

  @IsNotEmpty()
  @IsISO8601()
  start_date!: Date;

  @IsNotEmpty()
  @IsISO8601()
  end_date!: Date;
}