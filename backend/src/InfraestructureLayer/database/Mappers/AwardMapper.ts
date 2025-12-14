import { Injectable } from "@nestjs/common";
import { IMapper } from "./IMapper";
import { Award } from "@domain/Entities/Award";
import { AwardEntity } from "../Entities/AwardEntity";
import { AlbumMapper } from "./AlbumMapper";

@Injectable()
export class AwardMapper extends IMapper<Award, AwardEntity>{
    constructor(
        private readonly albumMapper : AlbumMapper
    ){super();}

    toDomainEntity(dataBaseEntity: AwardEntity): Award{
        if(!dataBaseEntity)
        {
            throw new Error('Cannot map null entity to domain');
        }

        return new Award(dataBaseEntity.id,dataBaseEntity.name,dataBaseEntity.date, dataBaseEntity ? this.albumMapper.toDomainEntity(dataBaseEntity.album!) : undefined!)
    }

    toDataBaseEntity(domainEntity: Award): AwardEntity{
        const entity = new AwardEntity();

        entity.id = domainEntity.getId();
        entity.name= domainEntity.getName();
        entity.date= domainEntity.getDate();
        entity.album = this.albumMapper.toDataBaseEntity(domainEntity.getAlbum());


        return entity;
    }
}