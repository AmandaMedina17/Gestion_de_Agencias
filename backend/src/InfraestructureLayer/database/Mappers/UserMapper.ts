import { User } from "../../../DomainLayer/Entities/User";
import { IMapper } from "./IMapper";
import { UserOrmEntity } from "../Entities/UserEntity";

export class UserMapper implements IMapper<User, UserOrmEntity>{
    toDomainEntity(dataBaseEntity: UserOrmEntity): User {
        return new User(
        dataBaseEntity.id,
        dataBaseEntity.username,
        dataBaseEntity.password,
        dataBaseEntity.role,
        dataBaseEntity.isActive
    );
    }
    toDataBaseEntity(domainEntity: User): UserOrmEntity {
        const userOrm = new UserOrmEntity();
        userOrm.id = domainEntity.getId();
        userOrm.username = domainEntity.getUserName();
        userOrm.password = domainEntity.getPassword();
        userOrm.role = domainEntity.getRole();
    
    return userOrm;
    }
    toDomainEntities(entities: UserOrmEntity[]): User[] {
        throw new Error("Method not implemented.");
    }
    toDataBaseEntities(domains: User[]): UserOrmEntity[] {
        throw new Error("Method not implemented.");
    }
    

}