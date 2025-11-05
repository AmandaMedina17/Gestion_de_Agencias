export interface IMapper <DomainEntity, DataBaseEntity> {
    toDomainEntity(dataBaseEntity : DataBaseEntity) : DomainEntity;
    toDataBaseEntity(domainEntity : DomainEntity) : DataBaseEntity;
    toDomainEntities(entities: DataBaseEntity[]): DomainEntity[];
    toDataBaseEntities(domains: DomainEntity[]): DataBaseEntity[]
}