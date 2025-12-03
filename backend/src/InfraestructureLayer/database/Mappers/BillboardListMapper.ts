import { Injectable } from "@nestjs/common";
import { IMapper } from "./IMapper";
import { BillboardList } from "@domain/Entities/BillboardList";
import { BillboardListEntity } from "../Entities/BillboardListEntity";

@Injectable()
export class BillboardListMapper extends IMapper<BillboardList, BillboardListEntity>{
    toDomainEntity(dataBaseEntity: BillboardListEntity): BillboardList{
        if(!dataBaseEntity)
        {
            throw new Error('Cannot map null entity to domain');
        }

        return new BillboardList(dataBaseEntity.id,dataBaseEntity.entryDate,
            dataBaseEntity.scope,dataBaseEntity.name,dataBaseEntity.endList)
    }

    toDataBaseEntity(domainEntity: BillboardList): BillboardListEntity{
        const entity = new BillboardListEntity();

        entity.id = domainEntity.getId();
        entity.entryDate= domainEntity.getPublicDate();
        entity.scope = domainEntity.getScope();
        entity.name = domainEntity.getNameList()
        entity.endList = domainEntity.getEndList();

        return entity;
    }
}