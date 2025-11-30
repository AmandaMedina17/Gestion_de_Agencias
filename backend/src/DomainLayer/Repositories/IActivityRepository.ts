import { IRepository } from "./IRepository";
import { Activity } from "../Entities/Activity"

export abstract class IActivityRepository extends IRepository<Activity> {
    abstract getArtistActivities(id: string): Promise<Activity[]>;
    abstract getGroupActivities(id: string): Promise<Activity[]>;
}
