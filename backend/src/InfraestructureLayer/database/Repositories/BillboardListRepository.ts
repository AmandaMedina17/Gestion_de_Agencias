import { Inject, Injectable } from "@nestjs/common";
import { BaseRepository } from "./BaseRepositoryImpl";
import { BillboardList } from "@domain/Entities/BillboardList";
import { IBillboardRepository } from "@domain/Repositories/IBillboardListRepository";
import { BillboardListEntity } from "../Entities/BillboardListEntity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BillboardListMapper } from "../Mappers/BillboardListMapper";

@Injectable()
export class BillboardListRepository
  extends BaseRepository<BillboardList, BillboardListEntity>
  implements IBillboardRepository
{
  constructor(
    @InjectRepository(BillboardListEntity)
    repository: Repository<BillboardListEntity>,
    mapper: BillboardListMapper

  ) {
    super(repository, mapper);
  }
}