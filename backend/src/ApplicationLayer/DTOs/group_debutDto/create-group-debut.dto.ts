import { GroupStatus } from "../../../DomainLayer/Enums";
import { Injectable } from "@nestjs/common";
import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CreateActivityDto } from "../activityDto/create-activity.dto";

@Injectable()
export class CreateGroupDebutDto {
    @IsNotEmpty()
    @IsString()
    groupId!: string;

    @IsArray()
    @IsNotEmpty()
    activities!: string[];

    @IsOptional()
    @IsString()
    albumId!: string;

    @IsNotEmpty()
    @IsString()
    visualConcept!: string;
}
