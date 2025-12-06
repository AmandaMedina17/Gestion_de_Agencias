import { Song } from "@domain/Entities/Song";
import { BaseRepository } from "./BaseRepositoryImpl";
import { SongEntity } from "../Entities/SongEntity";
import { ISongRepository } from "@domain/Repositories/ISongRepository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IMapper } from "../Mappers/IMapper";
import { BillboardListScope } from "../../../DomainLayer/Enums";
import { Injectable } from "@nestjs/common";
import { SongMapper } from "../Mappers/SongMapper";

@Injectable()
export class SongRepository extends BaseRepository<Song,SongEntity> implements ISongRepository{
     constructor(
        @InjectRepository(SongEntity)
        protected readonly repository: Repository<SongEntity>,
        protected readonly mapper: SongMapper
      ){
        super(repository,mapper)}

  async updateName (id: string, data: Song): Promise<Song | null> {
    const song = this.mapper.toDataBaseEntity(data)
    await this.repository.update(id, song);
    return this.findById(id);
  }
  
  async findById(id: string): Promise<Song | null> {
    const entity : SongEntity | null =  await this.repository.findOne({where : {id}, relations : ['album','album.songs']});
    
    if(!entity)
      throw new Error("This song doesn't exist")

    return this.mapper.toDomainEntity(entity);
  }
  async findAll(): Promise<Song[]> {
    const entities : SongEntity [] =  await this.repository.find({relations : ['album']});

    return this.mapper.toDomainEntities(entities);
  }
  
  async updateAlbum(id: string, newAlbumId: string): Promise<void> {
    
    await this.repository.update(id, {
      albumId: newAlbumId
    });
  }
  
  //hay que borrarlo   
  findbyPandY(position: number, date: Date, type: BillboardListScope): Promise<Song> {
    throw new Error("Method not implemented.");
  }
    //This method will find a song by his place on billboards, 
    // type of list (National or International )and year

      
    
}
