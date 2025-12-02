import { IMapper } from "./IMapper";
import { Artist } from "@domain/Entities/Artist";
import { ArtistEntity } from "@infrastructure/database/Entities/ArtistEntity";
import { Injectable } from "@nestjs/common";
import { ApprenticeEntity } from "../Entities/ApprenticeEntity";

@Injectable()
export class ArtistMapper extends IMapper<Artist, ArtistEntity>{
    
    toDomainEntity(dataBaseEntity: ArtistEntity): Artist {
        return new Artist(
            dataBaseEntity.id,
            dataBaseEntity.transitionDate,
            dataBaseEntity.statusArtist,
            dataBaseEntity.stageName,
            dataBaseEntity.birthDate,
            dataBaseEntity.groupId,
            dataBaseEntity.apprenticeId
            
        );
    }
    toDataBaseEntity(domainEntity: Artist): ArtistEntity {
        const entity = new ArtistEntity();
        entity.id = domainEntity.getId();
        entity.stageName = domainEntity.getStageName();
        entity.statusArtist = domainEntity.getStatusArtist();
        entity.birthDate = domainEntity.getBirthDate();
        entity.transitionDate = domainEntity.getDebutDate();
        entity.groupId = domainEntity.getGroup();
        entity.apprenticeId = domainEntity.getApprenticeId();
        
        return entity;
    }
    
}