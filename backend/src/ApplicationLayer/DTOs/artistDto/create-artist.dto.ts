import { ArtistStatus } from "../../../DomainLayer/Enums";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

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
    birthday!: Date;

    @IsNotEmpty()
    @IsString()
    apprenticeId!: string;
}