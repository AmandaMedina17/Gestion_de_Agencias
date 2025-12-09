import { User } from "../../../DomainLayer/Entities/User";
import { IMapper } from "./IMapper";
import { UserOrmEntity } from "../Entities/UserEntity";

export class UserMapper extends IMapper<User, UserOrmEntity>{

    toDomainEntity(dataBaseEntity: UserOrmEntity): User {
        return new User(
        dataBaseEntity.id,
        dataBaseEntity.username,
        dataBaseEntity.password,
        dataBaseEntity.role,
        dataBaseEntity.isActive,
        dataBaseEntity.agency
    );
    }
    toDataBaseEntity(domainEntity: User): UserOrmEntity {
        const userOrm = new UserOrmEntity();
        userOrm.id = domainEntity.getId();
        userOrm.username = domainEntity.getUserName();
        userOrm.password = domainEntity.getPassword();
        userOrm.role = domainEntity.getRole();
        userOrm.agency = domainEntity.getAgency();
    
    return userOrm;
    }
}