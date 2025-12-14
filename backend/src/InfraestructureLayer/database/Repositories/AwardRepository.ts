import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./BaseRepositoryImpl";
import { Award } from "@domain/Entities/Award";
import { AwardEntity } from "../Entities/AwardEntity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { AwardMapper } from "../Mappers/AwardMapper";
import { IAwardRepository } from "@domain/Repositories/IAwardRepository";
import { AlbumRepository } from "./AlbumRepository";

@Injectable()
export class AwardRepository extends BaseRepository<Award,AwardEntity> implements IAwardRepository
{
  constructor(
    @InjectRepository(AwardEntity)
    repository: Repository<AwardEntity>,
    //albumRepository : AlbumRepository,
    mapper: AwardMapper
  ) {super(repository, mapper);}

  async findByAlbumId(albumId: string): Promise<Award[]> {
    const awards = await this.repository.find({where : {album : {id : albumId}}});
    return this.mapper.toDomainEntities(awards);
  }

  async findUnassigned(): Promise<Award[]> {
    const awards = await this.repository.find({where: { album: IsNull() },});
    return this.mapper.toDomainEntities(awards);
  }
  
}