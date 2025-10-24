import { ApprenticeID, GroupID, ActivityID } from "./Value Objects/IDs";
export interface IIdGenerator {
  generateArtistId(): Promise<ApprenticeID>;
  generateGroupId(): Promise<GroupID>;
  generateActivityId(): Promise<ActivityID>;
}