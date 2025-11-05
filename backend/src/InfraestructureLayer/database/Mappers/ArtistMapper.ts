import { IMapper } from "../database/IMapper";
import { Artist } from "@domain/Entities/Artist";
import { ArtistEntity } from "@entities/ArtistEntity";
import { ArtistStatus } from "@domain/Enums";

class ArtistMapper implements IMapper<Artist, ArtistEntity>{
    toDomainEntity(dataBaseEntity: ArtistEntity): Artist {
        return new Artist(
            dataBaseEntity.id,
            dataBaseEntity.apprenticeId.entryDate,
            dataBaseEntity.apprenticeId.agencyId,
            dataBaseEntity.statusArtist,
            dataBaseEntity.stageName,
            dataBaseEntity.apprenticeId.fullName,
            dataBaseEntity.birthDate,
            dataBaseEntity.transitionDate
        );
    }
    toDataBaseEntity(domainEntity: Artist): ArtistEntity {
        const entity = new ArtistEntity();
        entity.id = domainEntity.getId();
        entity.stageName = domainEntity.getStageName();
        entity.statusArtist = domainEntity.getStatusArtist();
        entity.birthDate = domainEntity.getBirthDate();
        entity.transitionDate = domainEntity.getDebutDate();
        return entity;
    }
    
}