import { Song } from "@domain/Entities/Song";
import { IMapper } from "./IMapper";
import { SongEntity } from "@entities/SongEntity";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Album } from "@domain/Entities/Album";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { AlbumMapper } from "./AlbumMapper";
import { AlbumRepository } from "../Repositories/AlbumRepository";

@Injectable()
export class SongMapper implements IMapper<Song,SongEntity>{

    toDomainEntities(entities: SongEntity[]): Song[] {
        return entities.map(entity => this.toDomainEntity(entity));
    }
    toDataBaseEntities(domains: Song[]): SongEntity[] {
        return domains.map(domain => this.toDataBaseEntity(domain));
    }
    toDomainEntity(dataBaseEntity: SongEntity): Song {
      return new Song(dataBaseEntity.id,dataBaseEntity.name, 
        dataBaseEntity.albumId,dataBaseEntity.entryDate)
    }
    toDataBaseEntity(domainEntity: Song): SongEntity {
       const entity = new SongEntity();

       entity.id = domainEntity.getId();
       entity.name = domainEntity.getName();
       entity.albumId = domainEntity.getAlbumId();
       entity.entryDate = domainEntity.getDate();


       return entity;
    }
    
    
} 