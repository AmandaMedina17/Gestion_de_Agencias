import { Song } from "@domain/Entities/Song";
import { BaseRepository } from "./BaseRepositoryImpl";
import { SongEntity } from "../Entities/SongEntity";
import { ISongRepository } from "@domain/Repositories/ISongRepository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IMapper } from "../Mappers/IMapper";
import { BillboardListScope } from "@domain/Enums";
import { Injectable } from "@nestjs/common";
import { SongMapper } from "../Mappers/SongMapper";

@Injectable()
export class SongRepository extends BaseRepository<Song,SongEntity> implements ISongRepository{

     constructor(
        @InjectRepository(SongEntity)
        repository: Repository<SongEntity>,
        mapper: SongMapper
      ) {
        super(repository, mapper);
      }
      
  findbyPandY(position: number, date: Date, type: BillboardListScope): Promise<Song> {
    throw new Error("Method not implemented.");
  }
    //This method will find a song by his place on billboards, 
    // type of list (National or International )and year

      
    
}