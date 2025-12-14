import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./BaseRepositoryImpl";
import { Award } from "@domain/Entities/Award";
import { AwardEntity } from "../Entities/AwardEntity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { AwardMapper } from "../Mappers/AwardMapper";
import { IAwardRepository } from "@domain/Repositories/IAwardRepository";

@Injectable()
export class AwardRepository extends BaseRepository<Award,AwardEntity> implements IAwardRepository
{
  constructor(
    @InjectRepository(AwardEntity)
    repository: Repository<AwardEntity>,
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

  async findById(id: string): Promise<Award | null> {
    const award = await this.repository.findOne({ where: { id }, relations: {album :true} });
    return award ? this.mapper.toDomainEntity(award) : null;
  }

  async findAll(): Promise<Award[]> {
    const awards = await this.repository.find({ relations: { album: true } });
    return this.mapper.toDomainEntities(awards);
  }
  
}