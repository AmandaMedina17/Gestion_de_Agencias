import { ArtistStatus } from "@domain/Enums";

export class ArtistResponseDto{
    id!:string;
    transitionDate!:Date;
    status!:ArtistStatus;
    stageName!:string;
    birthday!:Date;
    groupId!:string;
    apprenticeId!:string;
}