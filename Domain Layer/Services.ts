export interface IIdGenerator {
  generateArtistId(): Promise<ArtistId>;
  generateGroupId(): Promise<GroupId>;
  generateActivityId(): Promise<ActivityId>;
}