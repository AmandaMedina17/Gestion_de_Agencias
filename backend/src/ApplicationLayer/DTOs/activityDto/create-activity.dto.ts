import { ActivityClassification, ActivityType } from "../../../DomainLayer/Enums";
import { ArrayNotEmpty, IsArray, IsEnum } from "class-validator";

export class CreateActivityDto{
  @IsEnum(ActivityClassification)
  classification!: ActivityClassification

  @IsEnum(ActivityType)
  type!: ActivityType

  @IsArray()
  @ArrayNotEmpty()
  responsibleIds!: string[];

  @IsArray()
  @ArrayNotEmpty()
  placeIds!: string[];

  @IsArray()
  @ArrayNotEmpty()
  dates!: Date[];
}

