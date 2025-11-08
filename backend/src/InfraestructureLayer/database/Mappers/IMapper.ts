export abstract class IMapper <DomainEntity, DataBaseEntity> {
    abstract toDomainEntity(dataBaseEntity : DataBaseEntity) : DomainEntity;
    abstract toDataBaseEntity(domainEntity : DomainEntity) : DataBaseEntity;
    abstract toDomainEntities(entities: DataBaseEntity[]): DomainEntity[];
    abstract toDataBaseEntities(domains: DomainEntity[]): DataBaseEntity[]
}