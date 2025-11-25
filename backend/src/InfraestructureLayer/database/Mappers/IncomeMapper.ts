import { IMapper } from "./IMapper";
import { Income } from "@domain/Entities/Income";
import { IncomeEntity } from "@entities/IncomeEntity";

export class IncomeMapper extends IMapper<Income, IncomeEntity>{

    toDomainEntity(dataBaseEntity: IncomeEntity): Income {
        if (!dataBaseEntity) {
            throw new Error('Cannot map null entity to domain');
        }

        return new Income(
            dataBaseEntity.id,
            dataBaseEntity.activityID,
            dataBaseEntity.mount,
            dataBaseEntity.date,
            dataBaseEntity.responsible
        )
    }

    toDataBaseEntity(domainEntity: Income): IncomeEntity {
        const entity = new IncomeEntity();

        entity.id = domainEntity.getID();
        entity.activityID = domainEntity.GetActivityID();
        entity.mount = domainEntity.getMount();
        entity.date = domainEntity.getDate();
        entity.responsible = domainEntity.getResponsible();

        return entity;
    }
}
