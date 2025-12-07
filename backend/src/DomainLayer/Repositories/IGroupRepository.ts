import { Album } from "../Entities/Album";
import { Artist } from "../Entities/Artist";
import { Group } from "../Entities/Group";
import { IRepository } from "./IRepository";

export abstract class IGroupRepository extends IRepository<Group> {
  abstract getGroupMembers(id: string): Promise<Artist[]>;
  abstract getGroupColaborations(id: string): Promise<Artist[]>;
  abstract getGroupAlbums(id: string): Promise<Album[]>;
  abstract getArtistCurrentGroup(id: string): Promise<Group | null>;
  abstract addMember(idGroup: string, idArtist: string, startDate: Date, rol: string, artist_debut_date: Date, endDate: Date | null): Promise<void>;
  // abstract updateMembership(idGroup: string, idArtist: string, startDate: Date, rol: string | undefinded, endDate: Date | undefined): Promise<void>;
}
