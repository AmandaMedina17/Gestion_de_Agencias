import { Activity } from "@domain/Entities/Activity";
import { Artist } from "@domain/Entities/Artist";

export abstract class IGroupActivityRepository {
  abstract scheduleGroup( groupId: string, activityId: string): Promise<void>;
  
  abstract isGroupScheduled(groupId: string, activityId: string): Promise<boolean>;
  
  abstract getActivitiesByGroupId(groupId: string, start_date: Date, end_date: Date): Promise<Activity[]>;

  abstract getAllActivitiesByGroupId(groupId: string): Promise<Activity[]>

  abstract checkGroupMembersConflicts(groupId: string, activityId: string): Promise<Artist[]>; 

  abstract confirmAttendance(artistId: string, activityId: string): Promise<void>;
  
  abstract cancelAttendance(artistId: string, activityId: string): Promise<void>;
}