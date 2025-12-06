import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { IMapper } from "./IMapper";
import { Album } from "@domain/Entities/Album";
import { AlbumEntity } from "../Entities/AlbumEntity";
import { SongMapper } from "./SongMapper";

@Injectable()
export class AlbumMapper implements IMapper<Album,AlbumEntity>{
    

    toDomainEntity(dataBaseEntity: AlbumEntity): Album {
        console.log(dataBaseEntity)
        return new Album ( dataBaseEntity.id,dataBaseEntity.title,dataBaseEntity.releaseDate,
            dataBaseEntity.mainProducer,dataBaseEntity.copiesSold,dataBaseEntity.songs?.length || 0
        )
    }
    toDataBaseEntity(domainEntity: Album): AlbumEntity {
        
        const ormEnt = new AlbumEntity();

        ormEnt.id = domainEntity.getId()
        ormEnt.title = domainEntity.getTitle()
        ormEnt.releaseDate = domainEntity.getReleaseDate()
        ormEnt.mainProducer =domainEntity.getMainProducer()
        ormEnt.copiesSold = domainEntity.getCopiesSold()
        return ormEnt
    }
    toDomainEntities(entities: AlbumEntity[]): Album[] {
        return entities.map(entity => this.toDomainEntity(entity));
    }
    toDataBaseEntities(domains: Album[]): AlbumEntity[] {
        return domains.map(domain => this.toDataBaseEntity(domain));
    }

}