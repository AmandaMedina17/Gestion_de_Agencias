import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./BaseRepositoryImpl";
import { Group } from "@domain/Entities/Group";
import { GroupEntity } from "../Entities/GroupEntity";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GroupMapper } from "../Mappers/GroupMapper";
import { Album } from "@domain/Entities/Album";
import { Artist } from "@domain/Entities/Artist";

@Injectable()
export class GroupRepository extends BaseRepository<Group,GroupEntity> 
implements IGroupRepository{
  constructor(
    @InjectRepository(GroupEntity)
    repository: Repository<GroupEntity>,
    mapper: GroupMapper,
  ) {
    super(repository, mapper);
  }
    getGroupMembers(id: string): Promise<Artist[]> {
        throw new Error("Method not implemented.");
    }
    getGroupColaborations(id: string): Promise<Artist[]> {
        throw new Error("Method not implemented.");
    }
    getGroupAlbums(id: string): Promise<Album[]> {
        throw new Error("Method not implemented.");
    }
}