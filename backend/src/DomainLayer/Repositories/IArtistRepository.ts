import { Artist } from "../Entities/Artist";
import { Group } from "../Entities/Group";
import { Agency } from "../Entities/Agency";
import { Album } from "../Entities/Album";
import { Contract } from "../Entities/Contract";
import { IRepository } from "./IRepository";
import { ArtistCollaborationEntity } from "@infrastructure/database/Entities/ArtistCollaborationEntity";

export abstract class IArtistRepository extends IRepository<Artist> {
  abstract findArtistsWithScheduleConflicts(
    startDate: Date,
    endDate: Date
  ): Promise<Artist[]>;

  abstract getArtistAlbums(id: string): Promise<Album[]>;

  abstract getArtistGroups(id: string): Promise<Group[]>;

  abstract getArtist_ArtistColaborations(id: string): Promise<Array<{
      collaborator: Artist;
      collaborationDate: Date;
    }>>

  abstract getArtist_GroupsColaborations(id: string): Promise<Array<{
      collaborator: Group;
      collaborationDate: Date;
    }>>

  abstract getArtistCurrentGroup(id: string): Promise<Group | null>;

  abstract getArtists_WithAgencyChangesAndGroups(agencyId: string): Promise<Artist[]>;

  abstract getArtistsWithDebut(agencyId?: string): Promise<Artist[]> ;

  abstract getArtistDebutHistory(agencyId: string): Promise<Array<{
    group: Group,
    role: string,
    debutDate: Date,
    startDate: Date,
    endDate: Date | null,
  }>>

  abstract createArtistCollaboration(artistId1: string, artist2Id: string, date: Date) : Promise<void>;

  abstract createArtistGroupCollaboration(artistId: string, groupId: string, date: Date) : Promise<void>;
}
