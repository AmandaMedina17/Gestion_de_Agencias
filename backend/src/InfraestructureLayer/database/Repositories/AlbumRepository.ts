import { Album } from "@domain/Entities/Album";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AlbumEntity } from "../Entities/AlbumEntity";
import { BaseRepository } from "./BaseRepositoryImpl";
import { Repository } from "typeorm";
import { IMapper } from "../Mappers/IMapper";
import { AlbumMapper } from "../Mappers/AlbumMapper";
import { Song } from "@domain/Entities/Song";

@Injectable()
export class AlbumRepository extends BaseRepository<Album,AlbumEntity> implements IAlbumRepository{
    constructor(
        @InjectRepository(AlbumEntity)
        repository: Repository<AlbumEntity>,
        mapper: AlbumMapper
    ) {
        super(repository, mapper);
    }
    getHits(id: string): Promise<[Song, number][]> {
        throw new Error("Method not implemented.");
    }

    async findByTitle(title: string): Promise<Album> {
        const entity = await this.repository.findOne({ 
            where: { title } 
          });
          if (!entity) {
            throw new Error('Agency not found');
          }
          return this.mapper.toDomainEntity(entity);
    }
    async findById(id: string): Promise<Album | null> {
        const entity : AlbumEntity | null =  await this.repository.findOne({where : {id}, relations : {
            songs : true
        }});

        console.log(entity)
        if(!entity)
        throw new Error("This album doesn't exist")

        return this.mapper.toDomainEntity(entity);
    }


    async findAll(): Promise<Album[]> {
        const dbEntities = await this.repository.find({relations : {
            songs : true
        }});
        return this.mapper.toDomainEntities(dbEntities);
    }


}