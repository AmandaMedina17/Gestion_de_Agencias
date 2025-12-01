import { Song } from "@domain/Entities/Song";
import { IMapper } from "./IMapper";
import { SongEntity } from "@entities/SongEntity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SongMapper implements IMapper<Song,SongEntity>{
    toDomainEntities(entities: SongEntity[]): Song[] {
        throw new Error("Method not implemented.");
    }
    toDataBaseEntities(domains: Song[]): SongEntity[] {
        throw new Error("Method not implemented.");
    }
    toDomainEntity(dataBaseEntity: SongEntity): Song {
      return new Song(dataBaseEntity.id,dataBaseEntity.name, 
        dataBaseEntity.album,dataBaseEntity.entryDate)
    }
    toDataBaseEntity(domainEntity: Song): SongEntity {
       const entity = new SongEntity();

       entity.id = domainEntity.getId();
       entity.name = domainEntity.getName();
       entity.album = domainEntity.getAlbumId();
       entity.entryDate = domainEntity.getDate();


       return entity;
    }
    
    
} 