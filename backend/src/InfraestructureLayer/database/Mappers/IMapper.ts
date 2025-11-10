export abstract class IMapper <DomainEntity, DataBaseEntity> {
    abstract toDomainEntity(dataBaseEntity : DataBaseEntity) : DomainEntity;
    abstract toDataBaseEntity(domainEntity : DomainEntity) : DataBaseEntity;

    toDomainEntities(entities: DataBaseEntity[]): DomainEntity[]
    {
        return entities.map(entity => this.toDomainEntity(entity));
    }
    
    toDataBaseEntities(domains: DomainEntity[]): DataBaseEntity[]
    {
        return domains.map(domain => this.toDataBaseEntity(domain));
    }
}