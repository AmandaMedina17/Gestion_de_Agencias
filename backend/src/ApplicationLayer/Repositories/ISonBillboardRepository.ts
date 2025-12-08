import { IRepository } from "@domain/Repositories/IRepository";
import { SongBillboardEntity } from "@infrastructure/database/Entities/SongBillboardEntity";

export abstract class ISongBillboardRepository extends IRepository<SongBillboardEntity>{
    abstract findBySongIdBillboardId(idSong : string, idBillboard : string) : Promise<SongBillboardEntity>;
    abstract remove(idSong: string, idBillboard :string): Promise<void>; 
}