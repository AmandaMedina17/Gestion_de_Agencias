import { Activity } from "@domain/Entities/Activity";
import { Artist } from "@domain/Entities/Artist";

export abstract class IGroupActivityRepository {
  abstract scheduleGroup( groupId: string, activityId: string): Promise<void>;
  
  abstract isGroupScheduled(groupId: string, activityId: string): Promise<boolean>;
  
  abstract getActivitiesByGroup(groupId: string): Promise<Activity[]>;

  abstract checkGroupMembersConflicts(groupId: string, activityId: string): Promise<Artist[]>; 
}