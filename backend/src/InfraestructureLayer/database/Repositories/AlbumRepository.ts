import { Album } from "@domain/Entities/Album";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AlbumEntity } from "../Entities/AlbumEntity";
import { BaseRepository } from "./BaseRepositoryImpl";
import { Repository } from "typeorm";
import { IMapper } from "../Mappers/IMapper";
import { AlbumMapper } from "../Mappers/AlbumMapper";
import { Song } from "@domain/Entities/Song";
import { SongBillboardEntity } from "../Entities/SongBillboardEntity";
import { SongBillboardRepository } from "./SonBillboardrepository";
import { SongBillboard } from "@domain/Entities/SongBillboard";
import { ISongBillboardRepository } from "@domain/Repositories/ISonBillboardRepository";
import { SongMapper } from "../Mappers/SongMapper";

@Injectable()
export class AlbumRepository extends BaseRepository<Album,AlbumEntity> implements IAlbumRepository{
    constructor(
        @InjectRepository(AlbumEntity)
        repository: Repository<AlbumEntity>,
        mapper: AlbumMapper,
        private readonly songMapper : SongMapper
    ) {
        super(repository, mapper);
    }

    async assignToArtist(albumId: string, artistId: string): Promise<Album> {
        const albumEntity = await this.repository.findOne({ where: { id: albumId } });
        
        if (!albumEntity) {
            throw new NotFoundException(`Album with ID ${albumId} not found`);
        }

        if (albumEntity.groupId) {
            throw new Error('Album is already assigned to a group');
        }

        albumEntity.artistId = artistId;
        albumEntity.groupId = undefined;

        const savedEntity = await this.repository.save(albumEntity);
        return this.mapper.toDomainEntity(savedEntity);
    }
    async assignToGroup(albumId: string, groupId: string): Promise<Album> {
        const albumEntity = await this.repository.findOne({ where: { id: albumId } });
        
        if (!albumEntity) {
            throw new NotFoundException(`Album with ID ${albumId} not found`);
        }

        if (albumEntity.artistId) {
            throw new Error('Album is already assigned to an artist');
        }

        albumEntity.groupId = groupId;
        albumEntity.artistId = undefined;

        const savedEntity = await this.repository.save(albumEntity);
        return this.mapper.toDomainEntity(savedEntity);
    }

    async getAlbumsByArtist(artistId: string): Promise<Album[]> {
        const entities = await this.repository.find({
            where: { artistId },
            relations: { songs: true }
        });

        return this.mapper.toDomainEntities(entities);
    }
    async getAlbumsByGroup(groupId: string): Promise<Album[]> {
        const entities = await this.repository.find({
            where: { groupId },
            relations: { songs: true }
        });

        return this.mapper.toDomainEntities(entities);
    }
    async getAllSong(id: string): Promise<Song[]> {
        const entity  =  await this.repository.findOne({where : {id}, relations : {
            songs : true
        }});

        return this.songMapper.toDomainEntities(entity!.songs);
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