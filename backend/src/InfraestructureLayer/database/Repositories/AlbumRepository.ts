import { Album } from "@domain/Entities/Album";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AlbumEntity } from "../Entities/AlbumEntity";
import { BaseRepository } from "./BaseRepositoryImpl";
import { Repository } from "typeorm";
import { IMapper } from "../Mappers/IMapper";

@Injectable()
export class AlbumRepository extends BaseRepository<Album,AlbumEntity> implements IAlbumRepository{
    constructor(
        @InjectRepository(AlbumEntity)
        repository: Repository<AlbumEntity>,
        mapper: IMapper<Album,AlbumEntity>,
    ) {
        super(repository, mapper);
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
}