import { ArtistStatus } from "../../../../backend/src/DomainLayer/Enums";

export interface CreateArtistDto{
    transitionDate: Date;
    status: ArtistStatus;
    stageName: string;
    birthday: Date;
    groupId: string;
    apprenticeId: string;
}

export interface ArtistResponseDto{
    id:string;
    transitionDate: Date;
    status: ArtistStatus;
    stageName: string;
    birthday: Date;
    groupId: string;
    apprenticeId: string;
}