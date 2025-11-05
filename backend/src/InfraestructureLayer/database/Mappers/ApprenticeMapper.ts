import { IMapper } from "../database/IMapper";
import { Apprentice } from "@domain/Entities/Apprentice";
import { ApprenticeEntity } from "@entities/ApprenticeEntity";
import { ApprenticeTrainingLevel } from "@domain/Enums";
import { ApprenticeStatus } from "@domain/Enums";

class ApprenticeMapper implements IMapper<Apprentice, ApprenticeEntity>{
    toDomainEntity(dataBaseEntity: ApprenticeEntity): Apprentice {
        return new Apprentice(
            dataBaseEntity.id,
            dataBaseEntity.fullName,
            dataBaseEntity.age,
            new Date(dataBaseEntity.entryDate),
            dataBaseEntity.trainingLevel ,
            dataBaseEntity.status,
            dataBaseEntity.agencyId
        )
    }
    toDataBaseEntity(domainEntity: Apprentice): ApprenticeEntity {
        const entity = new ApprenticeEntity();
        entity.id = domainEntity.getId();
        entity.fullName = domainEntity.getFullName();
        entity.entryDate = new Date(domainEntity.getJoinDate());
        entity.age = domainEntity.getAge();
        entity.status = domainEntity.getStatus();
        entity.trainingLevel = domainEntity.getTrainingLevel();
        return entity;
    }

} 