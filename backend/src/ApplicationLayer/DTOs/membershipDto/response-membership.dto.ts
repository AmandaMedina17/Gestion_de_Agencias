import { ArtistRole } from "../../../DomainLayer/Enums";

export class ResponseMembershipDto {
  artistId!: string;
  groupId!:string;
  role!: ArtistRole;
  artist_debut_date!: Date;
  startDate!: Date;
  endDate?: Date;
}