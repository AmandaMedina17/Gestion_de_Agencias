import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseRepository } from './BaseRepositoryImpl';
import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { Agency } from '@domain/Entities/Agency';
import { Apprentice } from '@domain/Entities/Apprentice';
import { Artist } from '@domain/Entities/Artist';
import { Group } from '@domain/Entities/Group';
import { ApprenticeMapper } from '../Mappers/ApprenticeMapper';
import { ArtistMapper } from '../Mappers/ArtistMapper';
import { AgencyMapper } from '../Mappers/AgencyMapper';
import { GroupMapper } from '../Mappers/GroupMapper';
import { AgencyEntity } from '../Entities/AgencyEntity';

@Injectable()
export class AgencyRepositoryImpl 
  extends BaseRepository<Agency, AgencyEntity>
  implements IAgencyRepository 
{
  constructor(
    @InjectRepository(AgencyEntity)
    repository: Repository<AgencyEntity>,
    mapper: AgencyMapper,
    private readonly groupMapper: GroupMapper,
    private readonly apprenticeMapper: ApprenticeMapper,
    private readonly artistMapper: ArtistMapper
  ) {
    super(repository, mapper);
  }

  async findByName(name: string): Promise<Agency> {
    const entity = await this.repository.findOne({ 
      where: { name } 
    });
    if (!entity) {
      throw new Error('Agency not found');
    }
    return this.mapper.toDomainEntity(entity);
  }

  async getAgencyGroups(id: string): Promise<Group[]> {
    const agencyEntity = await this.repository.findOne({
      where: { id },
      relations: ['groups']
    });

    if (!agencyEntity || !agencyEntity.groups) {
      return [];
    }

    return this.groupMapper.toDomainEntities(agencyEntity.groups);
  }

  async getAgencyApprentices(id: string): Promise<Apprentice[]> {
    const agencyEntity = await this.repository.findOne({
      where: { id },
      relations: ['apprentices']
    });

    if (!agencyEntity || !agencyEntity.apprentices) {
      return [];
    }

    return this.apprenticeMapper.toDomainEntities(agencyEntity.apprentices);
  }

  async getAgencyArtists(id: string): Promise<Artist[]> {
    // Para artistas, necesitamos cargar las membresías
    const agencyEntity = await this.repository.findOne({
      where: { id },
      relations: ['artistMemberships', 'artistMemberships.artist']
    });

    if (!agencyEntity || !agencyEntity.artistMemberships) {
      return [];
    }

    // Extraer los artistas de las membresías
    const artistEntities = agencyEntity.artistMemberships
      .map(membership => membership.artist)
      .filter(artist => artist !== undefined);

    return this.artistMapper.toDomainEntities(artistEntities);
  }

  async findActiveArtistsByAgency(agencyId: string): Promise<Artist[]> {
    const agencyEntity = await this.repository.findOne({
      where: { id: agencyId },
      relations: [
        'artistMemberships', 
        'artistMemberships.artist',
        'artistMemberships.artist.apprenticeId'
      ]
    });

    if (!agencyEntity || !agencyEntity.artistMemberships) {
      return [];
    }

    // Filtrar artistas activos
    const activeArtistEntities = agencyEntity.artistMemberships
      .map(membership => membership.artist)
      .filter(artist => artist && artist.statusArtist === 'ACTIVO');

    return this.artistMapper.toDomainEntities(activeArtistEntities);
  }
}