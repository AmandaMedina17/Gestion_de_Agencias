import { Agency } from "../Entities/Agency";
import { Group } from "../Entities/Group";
import { Apprentice } from "../Entities/Apprentice";
import { Artist } from "../Entities/Artist";
import { IRepository } from "./IRepository";

export interface IAgencyRepository extends IRepository<Agency, string> {
  findByName(name: string): Promise<Agency>;
  getAgencyGroups(id: string): Promise<Group[]>;
  getAgencyApprentices(id: string): Promise<Apprentice[]>;
  getAgencyArtists(id: string): Promise<Artist[]>;
  findActiveArtistsByAgency(agencyId: string): Promise<Artist[]>;
}
