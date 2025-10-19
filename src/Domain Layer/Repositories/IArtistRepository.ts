import { ApprenticeID } from "../Value Objects/IDs";
import { ArtistEntity } from "../Entities/ArtistEntity";
import { GroupEntity } from "../Entities/Group";
import { AgencyEntity } from "../Entities/AgencyEntity";
import {AlbumEntity} from "../Entities/Album";
import {ActivityEntity} from "../Entities/Activity";
import { ContractEntity } from "../Entities/Contract";
import { IRepository } from "./IRepository";

export interface IArtistRepository extends IRepository<ArtistEntity,ApprenticeID>
{
  findArtistsWithScheduleConflicts(startDate: Date, endDate: Date): Promise<ArtistEntity[]>;

  getArtistAgencies(id: ApprenticeID): Promise<AgencyEntity[]>;

  getArtistAlbums(id: ApprenticeID): Promise<AlbumEntity[]>;

  getArtistActivities(id: ApprenticeID): Promise<ActivityEntity[]>

  // Historial profesional de un artista:
  getCurrentArtistContracts(id: ApprenticeID): Promise<ContractEntity[]>

  getArtistGroups(id: ApprenticeID): Promise<GroupEntity[]>

  getArtistDebutsInOrders(id: ApprenticeID): Promise<null> //Que hay que devolver??

  getArtist_ArtistColaborations(id: ApprenticeID): Promise<ArtistEntity[]> 

  getArtist_GroupsColaborations(id: ApprenticeID): Promise<GroupEntity[]>
}