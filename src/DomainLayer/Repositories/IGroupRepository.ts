import { Album } from "../Entities/Album";
import { Artist } from "../Entities/Artist";
import { Group } from "../Entities/Group";
import { GroupID } from "../Value Objects/IDs";
import { IRepository } from "./IRepository";

export interface IGroupRepository extends IRepository<Group, string> {
  getGroupMembers(id: string): Promise<Artist[]>;
  getGroupColaborations(id: GroupID): Promise<Artist[]>;
  getGroupAlbums(id: GroupID): Promise<Album[]>;
}
