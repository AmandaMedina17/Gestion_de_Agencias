import { IRepository } from "./IRepository";
import { Activity } from "../Entities/Activity"

export interface IActivityRepository extends IRepository<Activity> {
    getArtistActivities(id: string): Promise<Activity[]>;
    getGroupActivities(id: string): Promise<Activity[]>;
}
