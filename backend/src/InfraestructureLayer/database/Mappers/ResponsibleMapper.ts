import { IMapper } from "./IMapper";
import { ResponsibleEntity } from "@infrastructure/database/Entities/ResponsibleEntity";
import { Responsible } from "@domain/Entities/Responsible";
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponsibleMapper extends IMapper<Responsible, ResponsibleEntity>{
    toDomainEntity(dataBaseEntity: ResponsibleEntity): Responsible {
        if(!dataBaseEntity)
        {
            throw new Error('Cannot map null entity to domain');
        }

        return new Responsible(
            dataBaseEntity.id,
            dataBaseEntity.name
        )
    }

    toDataBaseEntity(domainEntity: Responsible): ResponsibleEntity {
        const entity = new ResponsibleEntity();

        entity.id = domainEntity.getId();
        entity.name = domainEntity.getName();

        return entity;
    }
}