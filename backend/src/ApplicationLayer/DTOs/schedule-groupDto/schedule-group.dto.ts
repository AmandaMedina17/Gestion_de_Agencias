import { IsString, IsNotEmpty } from 'class-validator';

export class ScheduleGroupDto {
  @IsNotEmpty()
  @IsString()
  groupId!: string;

  @IsNotEmpty()
  @IsString()
  activityId!: string;
}