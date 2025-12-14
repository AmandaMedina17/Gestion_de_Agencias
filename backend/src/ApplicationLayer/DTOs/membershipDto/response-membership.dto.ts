import { ArtistRole } from "@domain/Enums";

export class ResponseMembershipDto {
  artistId!: string;
  groupId!:string;
  role!: ArtistRole;
  artist_debut_date!: Date;
  startDate!: Date;
  endDate?: Date;
}