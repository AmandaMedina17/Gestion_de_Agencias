export class ResponseMembershipDto {
  artistId!: string;
  groupId!:string;
  role!: string;
  artist_debut_date!: Date;
  startDate!: Date;
  endDate?: Date;
}