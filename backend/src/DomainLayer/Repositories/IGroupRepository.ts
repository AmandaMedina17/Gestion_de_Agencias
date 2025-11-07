import { Album } from "../Entities/Album";
import { Artist } from "../Entities/Artist";
import { Group } from "../Entities/Group";
import { IRepository } from "./IRepository";

export interface IGroupRepository extends IRepository<Group, string> {
  getGroupMembers(id: string): Promise<Artist[]>;
  getGroupColaborations(id: string): Promise<Artist[]>;
  getGroupAlbums(id: string): Promise<Album[]>;
}
