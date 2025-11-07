import { Agency } from "../Entities/Agency";
import { Group } from "../Entities/Group";
import { Apprentice } from "../Entities/Apprentice";
import { Artist } from "../Entities/Artist";
import { IRepository } from "./IRepository";

export abstract class IAgencyRepository extends IRepository<Agency> {
  abstract findByName(name: string): Promise<Agency>;
  abstract getAgencyGroups(id: string): Promise<Group[]>;
  abstract getAgencyApprentices(id: string): Promise<Apprentice[]>;
  abstract getAgencyArtists(id: string): Promise<Artist[]>;
  abstract findActiveArtistsByAgency(agencyId: string): Promise<Artist[]>;
}
