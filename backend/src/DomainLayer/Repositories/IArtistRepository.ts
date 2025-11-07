import { Artist } from "../Entities/Artist";
import { Group } from "../Entities/Group";
import { Agency } from "../Entities/Agency";
import { Album } from "../Entities/Album";
import { Contract } from "../Entities/Contract";
import { IRepository } from "./IRepository";

export interface IArtistRepository extends IRepository<Artist, string> {
  findArtistsWithScheduleConflicts(
    startDate: Date,
    endDate: Date
  ): Promise<Artist[]>;

  getArtistAgencies(id: string): Promise<Agency[]>;

  getArtistAlbums(id: string): Promise<Album[]>;

  // Historial profesional de un artista:
  getCurrentArtistContracts(id: string): Promise<Contract[]>;

  getArtistGroups(id: string): Promise<Group[]>;

  getArtistDebutsInOrders(id: string): Promise<null>; //Que hay que devolver??

  getArtist_ArtistColaborations(id: string): Promise<Artist[]>;

  getArtist_GroupsColaborations(id: string): Promise<Group[]>;
}
