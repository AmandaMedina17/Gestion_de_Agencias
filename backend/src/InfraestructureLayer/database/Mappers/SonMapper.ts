import { Song } from "@domain/Entities/Song";
import { IMapper } from "./IMapper";
import { SongEntity } from "@entities/SongEntity";

export class SongMapper implements IMapper<Song,SongEntity>{

    
    constructor() {
        
    }
    toDomainEntity(dataBaseEntity: SongEntity): Song {
        throw new Error("Method not implemented.");
    }
    toDataBaseEntity(domainEntity: Song): SongEntity {
        throw new Error("Method not implemented.");
    }
    toDomainEntities(entities: SongEntity[]): Song[] {
        throw new Error("Method not implemented.");
    }
    toDataBaseEntities(domains: Song[]): SongEntity[] {
        throw new Error("Method not implemented.");
    }
}