import { ActivityEntity } from "../Entities/Activity";
import { AlbumEntity } from "../Entities/Album";
import { ArtistEntity } from "../Entities/Artist";
import { GroupEntity } from "../Entities/Group";
import { GroupID } from "../Value Objects/IDs";
import { IRepository } from "./IRepository";

export interface IGroupRepository extends IRepository<GroupEntity, GroupID> {
  getGroupMembers(id: GroupID): Promise<ArtistEntity[]>;
  getGroupColaborations(id: GroupID): Promise<ArtistEntity[]>;
  getGroupActivities(id: GroupID): Promise<ActivityEntity[]>;
  getGroupAlbums(id: GroupID): Promise<AlbumEntity[]>;
}
