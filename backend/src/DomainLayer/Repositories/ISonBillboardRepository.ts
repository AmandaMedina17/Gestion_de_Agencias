import { SongBillboard } from "@domain/Entities/SongBillboard";
import { IRepository } from "@domain/Repositories/IRepository";
import { SongBillboardEntity } from "@infrastructure/database/Entities/SongBillboardEntity";

export abstract class ISongBillboardRepository extends IRepository<SongBillboard>{
    abstract findBySongIdBillboardId(idSong : string, idBillboard : string) : Promise<SongBillboard | null>;
    abstract remove(idSong: string, idBillboard :string): Promise<void>;
    abstract posOcupated(pos : number) : Promise<boolean>; 
}