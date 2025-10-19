import { AgencyEntity } from "../Entities/Agency";
import { GroupEntity } from "../Entities/Group";
import { ApprenticeEntity } from "../Entities/Apprentice";
import { ArtistEntity } from "../Entities/Artist";
import { AgencyID } from "../Value Objects/IDs";
import { IRepository } from "./IRepository";

export interface IAgencyRepository extends IRepository<AgencyEntity, AgencyID> {
  findByName(name: string): Promise<AgencyEntity | null>;

  getAgencyGroups(id: AgencyID): Promise<GroupEntity[]>;
  getAgencyApprentices(id: AgencyID): Promise<ApprenticeEntity[]>;
  getAgencyArtists(id: AgencyID): Promise<ArtistEntity[]>;

  findActiveArtistsByAgency(agencyId: AgencyID): Promise<ArtistEntity[]>;
}
