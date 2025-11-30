import { ArtistStatus } from "../../../DomainLayer/Enums";

export class ArtistResponseDto{
    id!:string;
    transitionDate!:Date;
    status!:ArtistStatus;
    stageName!:string;
    birthday!:Date;
    groupId!:string;
    apprenticeId!:string;
}