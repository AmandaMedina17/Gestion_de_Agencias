import { Award } from "@domain/Entities/Award";
import { IRepository } from "./IRepository";

export abstract class IAwardRepository extends IRepository<Award> {
    abstract findByAlbumId (albumId : string) : Promise<Award[]>;
    abstract findUnassigned(): Promise<Award[]>;
}
