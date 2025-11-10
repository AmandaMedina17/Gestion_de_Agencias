import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './BaseRepositoryImpl';
import { Place } from '@domain/Entities/Place';
import { PlaceEntity } from '../Entities/PlaceEntity';
import { IPlaceRepository } from '@domain/Repositories/IPlaceRepository';
import { IMapper } from '../Mappers/IMapper';

@Injectable()
export class PlaceRepository extends BaseRepository<Place,PlaceEntity> 
implements IPlaceRepository{
  constructor(
    @InjectRepository(PlaceEntity)
    repository: Repository<PlaceEntity>,
    mapper: IMapper<Place,PlaceEntity>,
  ) {
    super(repository, mapper);
  }
}