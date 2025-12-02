import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./BaseRepositoryImpl";
import { Award } from "@domain/Entities/Award";
import { AwardEntity } from "../Entities/AwardEntity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AwardMapper } from "../Mappers/AwardMapper";

@Injectable()
export class AwardRepository
  extends BaseRepository<Award,AwardEntity>
  implements AwardRepository
{
  constructor(
    @InjectRepository(AwardEntity)
    repository: Repository<AwardEntity>,
    mapper: AwardMapper

  ) {
    super(repository, mapper);
  }
}