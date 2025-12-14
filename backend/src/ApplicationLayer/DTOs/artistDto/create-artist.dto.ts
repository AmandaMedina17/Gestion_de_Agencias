import { Type } from "class-transformer";
import { ArtistStatus } from "../../../DomainLayer/Enums";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateArtistDto{
    @IsNotEmpty()
    @IsString()
    transitionDate!: Date;

    @IsNotEmpty()
    @IsEnum(ArtistStatus)
    status!: ArtistStatus;

    @IsNotEmpty()
    @IsString()
    stageName!: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    birthday!: Date;

    @IsNotEmpty()
    @IsString()
    apprenticeId!: string;
}