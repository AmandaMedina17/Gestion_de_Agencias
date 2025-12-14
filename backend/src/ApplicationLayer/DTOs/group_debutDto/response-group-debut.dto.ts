import { ActivityResponseDto } from "../activityDto/response-activity.dto";
import { ResponseAlbumDto } from "../albumDto/response.album.dto";
import { GroupResponseDto } from "../groupDto/response-group.dto";

export class GroupDebutResponseDto{
    group!: GroupResponseDto;
    activities!: ActivityResponseDto[];
    album!: ResponseAlbumDto;
}