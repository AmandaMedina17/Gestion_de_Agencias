import { Artist } from "../Entities/Artist";
import { Group } from "../Entities/Group";
import { Agency } from "../Entities/Agency";
import { Album } from "../Entities/Album";
import { Contract } from "../Entities/Contract";
import { IRepository } from "./IRepository";

export abstract class IArtistRepository extends IRepository<Artist> {
  abstract findArtistsWithScheduleConflicts(
    startDate: Date,
    endDate: Date
  ): Promise<Artist[]>;

  abstract getArtistAgencies(id: string): Promise<Agency[]>;

  abstract getArtistAlbums(id: string): Promise<Album[]>;

  // Historial profesional de un artista:
  abstract getCurrentArtistContracts(id: string): Promise<Contract[]>;

  abstract getArtistGroups(id: string): Promise<Group[]>;

  abstract getArtistDebutsInOrders(id: string): Promise<any[]>; //Que hay que devolver??

  abstract getArtist_ArtistColaborations(id: string): Promise<Artist[]>;

  abstract getArtist_GroupsColaborations(id: string): Promise<Group[]>;

  
}
