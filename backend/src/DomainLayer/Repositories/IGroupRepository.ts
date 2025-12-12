import { Album } from "../Entities/Album";
import { Artist } from "../Entities/Artist";
import { Group } from "../Entities/Group";
import { IRepository } from "./IRepository";

export abstract class IGroupRepository extends IRepository<Group> {
  abstract findByIdWithMembers(id: string): Promise<Group | null> 
  abstract getGroupMembers(id: string): Promise<Artist[]>;
  abstract getGroupColaborations(id: string): Promise<Artist[]>;
  abstract getGroupAlbums(id: string): Promise<Album[]>;
}
