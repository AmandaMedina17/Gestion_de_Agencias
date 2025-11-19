import { Song } from "@domain/Entities/Song";
import { IMapper } from "./IMapper";
import { SongEntity } from "@entities/SongEntity";

class SongMapper implements IMapper<Song,SongEntity>{
    toDomainEntities(entities: SongEntity[]): Song[] {
        throw new Error("Method not implemented.");
    }
    toDataBaseEntities(domains: Song[]): SongEntity[] {
        throw new Error("Method not implemented.");
    }
    toDomainEntity(dataBaseEntity: SongEntity): Song {
      return new Song(dataBaseEntity.id,dataBaseEntity.name, 
        dataBaseEntity.album,dataBaseEntity.entryDate,dataBaseEntity.)
    }
    toDataBaseEntity(domainEntity: Song): SongEntity {
        throw new Error("Method not implemented.");
    }
    
    
} 