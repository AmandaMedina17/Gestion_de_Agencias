import { ApprenticeID } from "../Value Objects/IDs";
import { Artist } from "../Entities/Artist";
import { Group } from "../Entities/Group";
import { Agency } from "../Entities/Agency";
import { Album } from "../Entities/Album";
import { Contract } from "../Entities/Contract";
import { IRepository } from "./IRepository";

export interface IArtistRepository extends IRepository<Artist, ApprenticeID> {
  findArtistsWithScheduleConflicts(
    startDate: Date,
    endDate: Date
  ): Promise<Artist[]>;

  getArtistAgencies(id: ApprenticeID): Promise<Agency[]>;

  getArtistAlbums(id: ApprenticeID): Promise<Album[]>;

  // Historial profesional de un artista:
  getCurrentArtistContracts(id: ApprenticeID): Promise<Contract[]>;

  getArtistGroups(id: ApprenticeID): Promise<Group[]>;

  getArtistDebutsInOrders(id: ApprenticeID): Promise<null>; //Que hay que devolver??

  getArtist_ArtistColaborations(id: ApprenticeID): Promise<Artist[]>;

  getArtist_GroupsColaborations(id: ApprenticeID): Promise<Group[]>;
}
