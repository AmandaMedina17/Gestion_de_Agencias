import { ISongBillboardRepository } from "@domain/Repositories/ISonBillboardRepository";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { SongBillboardEntity } from "../Entities/SongBillboardEntity";
import { SongBillBoardMapper } from "../Mappers/SongBillboardMapper";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BillboardList } from "@domain/Entities/BillboardList";
import { BaseRepository } from "./BaseRepositoryImpl";
import { SongBillboard } from "@domain/Entities/SongBillboard";

@Injectable()
export class SongBillboardRepository extends BaseRepository<SongBillboard,SongBillboardEntity> implements ISongBillboardRepository{
    delete(id: string): Promise<void> {
        throw new Error("This method doesn't work for this finctionalitie");
    }
    constructor(
        @InjectRepository(SongBillboardEntity)
        protected readonly repository: Repository<SongBillboardEntity>,
        private readonly songBillboardMapper : SongBillBoardMapper
    ){
        super(repository,songBillboardMapper);
    }
    async posOcupated(pos: number): Promise<boolean> {
        const posOcupated = await this.repository.findOne({where : {place : pos}})  
        return posOcupated ? true : false;
    }

    async findById(id: string): Promise<SongBillboard | null> {
        throw new NotImplementedException("SongBilldoard doesn't has an id by itself")
    }
    async findBySongIdBillboardId(idSong: string, idBillboard: string): Promise<SongBillboard | null> {
        const object = await this.repository.findOne({where :{songId:idSong,billboardListId: idBillboard }, relations : {song : true, billboardList : true}})
        //console.log(object);
        return object ? this.songBillboardMapper.toDomainEntity(object) : null;
    }
    
    async remove(songId: string, billboardListId: string): Promise<void> {
        await this.repository.delete({songId : songId , billboardListId: billboardListId })
    } 

    async findAll(): Promise<SongBillboard[]> {
        const dbEntities = await this.repository.find({ relations : ['song','billboardList']});
        return this.mapper.toDomainEntities(dbEntities);
    }

    async save(entity: SongBillboard): Promise<SongBillboard> {
        const dbEntity = this.mapper.toDataBaseEntity(entity);
        await this.repository.save(dbEntity);
    
        return entity;
    }
}

