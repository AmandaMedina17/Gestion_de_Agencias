import { ActivityEntity } from "../Entities/ActivityEntity"
import { AlbumEntity } from "../Entities/AlbumEntity"
import { ArtistEntity } from "../Entities/ArtistEntity"
import { GroupEntity } from "../Entities/GroupEntity"
import { GroupID } from "../Value Objects/IDs"
import { IRepository } from "./IRepository"

export interface IGroupRepository extends IRepository<GroupEntity,GroupID>
{
    getGroupMembers(id : GroupID): Promise<ArtistEntity[]>;
    getGroupColaborations(id : GroupID): Promise<ArtistEntity[]>;
    getGroupActivities(id: GroupID): Promise<ActivityEntity[]>;
    getGroupAlbums(id: GroupID): Promise<AlbumEntity[]>;
}