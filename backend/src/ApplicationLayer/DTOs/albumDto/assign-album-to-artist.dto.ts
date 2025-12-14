import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AssignAlbumToArtistDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    albumId!: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    artistId!: string;
}