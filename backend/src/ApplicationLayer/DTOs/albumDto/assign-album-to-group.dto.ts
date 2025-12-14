import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AssignAlbumToGroupDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    albumId!: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    groupId!: string;
}