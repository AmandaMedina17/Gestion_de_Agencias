import { GroupStatus } from "@domain/Enums";
import { Injectable } from "@nestjs/common";
import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

@Injectable()
export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    name!: string;

    @IsNotEmpty()
    @IsEnum(GroupStatus)
    status!: GroupStatus;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    debut_date!: Date;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    concept!: string;

    // visual_concept!: 

    @IsNotEmpty()
    @IsBoolean()
    is_created!: boolean;

    @IsNotEmpty()
    @IsString()
    agencyId!: string;

    // @IsOptional()
    // @IsString()
    // proposedByArtistId?: string; 
}
