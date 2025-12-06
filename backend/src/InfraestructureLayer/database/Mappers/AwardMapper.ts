import { Injectable } from "@nestjs/common";
import { IMapper } from "./IMapper";
import { Award } from "@domain/Entities/Award";
import { AwardEntity } from "../Entities/AwardEntity";

@Injectable()
export class AwardMapper extends IMapper<Award, AwardEntity>{
    toDomainEntity(dataBaseEntity: AwardEntity): Award{
        if(!dataBaseEntity)
        {
            throw new Error('Cannot map null entity to domain');
        }

        return new Award(dataBaseEntity.id,dataBaseEntity.name,dataBaseEntity.date, dataBaseEntity.album.id)
    }

    toDataBaseEntity(domainEntity: Award): AwardEntity{
        const entity = new AwardEntity();

        entity.id = domainEntity.getId();
        entity.name= domainEntity.getName();
        entity.date= domainEntity.getDate();


        return entity;
    }
}