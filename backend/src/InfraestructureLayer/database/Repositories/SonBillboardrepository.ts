import { ISongBillboardRepository } from "@application/Repositories/ISonBillboardRepository";
import { Injectable } from "@nestjs/common";
import { SongBillboardEntity } from "../Entities/SongBillboardEntity";
import { SongBillBoardMapper } from "../Mappers/SongBillBoardMapper";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BillboardList } from "@domain/Entities/BillboardList";

@Injectable()
export class SongBillboardRepository extends ISongBillboardRepository{
    delete(id: string): Promise<void> {
        throw new Error("This method doesn't work for this finctionalitie");
    }
    constructor(
        @InjectRepository(SongBillboardEntity)
        protected readonly repository: Repository<SongBillboardEntity>,
        private readonly songBillboardMapper : SongBillBoardMapper
    ){
        super();
    }
    async findBySongIdBillboardId(idSong: string, idBillboard: string): Promise<SongBillboardEntity> {
        const object = await this.repository.findOne({where :{songId:idSong,billboardListId: idBillboard }})

        return object!;
     }
     findById(id: string): Promise<SongBillboardEntity | null> {
         throw new Error("Method not implemented.");
     }
    async findAll(): Promise<SongBillboardEntity[]> {
        return await this.repository.find()
     }
    async save(entity: SongBillboardEntity): Promise<SongBillboardEntity> {
        return await this.repository.save(entity)
    }
     update(entity: SongBillboardEntity): Promise<SongBillboardEntity> {
         throw new Error("Method not implemented.");
     }
    async remove(songId: string, billboardListId: string): Promise<void> {
        await this.repository.delete({songId : songId , billboardListId: billboardListId })
    }    
}
