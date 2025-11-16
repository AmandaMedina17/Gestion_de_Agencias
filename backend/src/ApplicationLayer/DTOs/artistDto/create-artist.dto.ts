import { ArtistStatus } from "../../../DomainLayer/Enums";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateArtistDto{
    @IsNotEmpty()
    @IsString()
    transitionDate!: Date;

    status!: ArtistStatus;

    stageName!: string;

    birthday!: Date;

    groupId!: string;

    apprenticeId!: string;
}