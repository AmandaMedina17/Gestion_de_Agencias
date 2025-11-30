import { Injectable } from "@nestjs/common";
import { IMapper } from "./IMapper";
import { Album } from "@domain/Entities/Album";
import { AlbumEntity } from "../Entities/AlbumEntity";

@Injectable()
export class AlbumMapper implements IMapper<Album,AlbumEntity>{
    
    toDomainEntity(dataBaseEntity: AlbumEntity): Album {
        return new Album ( dataBaseEntity.id,dataBaseEntity.title,dataBaseEntity.releaseDate,
            dataBaseEntity.mainProducer,dataBaseEntity.copiesSold,dataBaseEntity.numberOfTracks
        )
    }
    toDataBaseEntity(domainEntity: Album): AlbumEntity {
        
        const ormEnt = new AlbumEntity();

        ormEnt.id = domainEntity.getId()
        ormEnt.title = domainEntity.getTitle()
        ormEnt.releaseDate = domainEntity.getReleaseDate()
        ormEnt.mainProducer =domainEntity.getMainProducer()
        ormEnt.copiesSold = domainEntity.getCopiesSold()
        ormEnt.numberOfTracks = domainEntity.getNumberOfTracks()
        
       return new AlbumEntity
    }
    toDomainEntities(entities: AlbumEntity[]): Album[] {
        throw new Error("Method not implemented.");
    }
    toDataBaseEntities(domains: Album[]): AlbumEntity[] {
        throw new Error("Method not implemented.");
    }

}