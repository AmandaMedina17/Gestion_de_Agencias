import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThanOrEqual, MoreThanOrEqual, createQueryBuilder } from 'typeorm';
import { BaseRepository } from './BaseRepositoryImpl';
import { Artist} from '@domain/Entities/Artist';
import { ArtistEntity } from '../Entities/ArtistEntity';
import { Group } from '@domain/Entities/Group';
import { ArtistMapper } from '../Mappers/ArtistMapper';
import { ArtistGroupMembershipEntity } from '../Entities/ArtistGroupMembershipEntity';
import { GroupMapper } from '../Mappers/GroupMapper';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { Agency } from '@domain/Entities/Agency';
import { Album } from '@domain/Entities/Album';
import { Contract } from '@domain/Entities/Contract';
import { AlbumMapper } from '../Mappers/AlbumMapper';
import { ArtistCollaborationEntity } from '../Entities/ArtistCollaborationEntity';
import { ArtistGroupCollaborationEntity } from '../Entities/ArtistGroupCollaborationEntity';

@Injectable()
export class ArtistRepository
  extends BaseRepository<Artist, ArtistEntity> implements IArtistRepository
{
  constructor(
    @InjectRepository(ArtistEntity)
    repository: Repository<ArtistEntity>,
    mapper: ArtistMapper,
    @InjectRepository(ArtistGroupMembershipEntity)
    private readonly membershipRepository: Repository<ArtistGroupMembershipEntity>,
    private readonly groupMapper: GroupMapper,
    private readonly albumMapper: AlbumMapper,
    @InjectRepository(ArtistCollaborationEntity)
    private readonly artistCollaborationRepository: Repository<ArtistCollaborationEntity>,
    @InjectRepository(ArtistGroupCollaborationEntity)
    private readonly artistGroupCollaborationRepository: Repository<ArtistGroupCollaborationEntity>,
  
  ) {
    super(repository, mapper);
  }
  findArtistsWithScheduleConflicts(startDate: Date, endDate: Date): Promise<Artist[]> {
    throw new Error('Method not implemented.');
  }
  getArtistAgencies(id: string): Promise<Agency[]> {
    throw new Error('Method not implemented.');
  }
  getArtistAlbums(id: string): Promise<Album[]> {
    throw new Error('Method not implemented.');
  }
  getCurrentArtistContracts(id: string): Promise<Contract[]> {
    throw new Error('Method not implemented.');
  }
  getArtistGroups(id: string): Promise<Group[]> {
    throw new Error('Method not implemented.');
  }
  getArtistDebutsInOrders(id: string): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  getArtist_ArtistColaborations(id: string): Promise<Artist[]> {
    throw new Error('Method not implemented.');
  }
  getArtist_GroupsColaborations(id: string): Promise<Group[]> {
    throw new Error('Method not implemented.');
  }

  async createArtistCollaboration(artist1Id: string, artist2Id: string, date: Date): Promise<void> {
    // Validar que no exista ya la colaboración
    const existing = await this.artistCollaborationRepository.findOne({
      where: {
        artist1Id,
        artist2Id,
        date
      }
    });

    if (existing) {
      throw new Error('This collaboration already exists');
    }

    const collaboration = this.artistCollaborationRepository.create({
      artist1Id,
      artist2Id,
      date
    });

    await this.artistCollaborationRepository.save(collaboration);
  }

  async createArtistGroupCollaboration(artistId: string, groupId: string, date: Date): Promise<void> {
     // Validar que no exista ya la colaboración
    const existing = await this.artistGroupCollaborationRepository.findOne({
      where: {
        artistId,
        groupId,
        date
      }
    });

    if (existing) {
      throw new Error('This collaboration already exists');
    }

    const collaboration = this.artistGroupCollaborationRepository.create({
      artistId,
      groupId,
      date
    });

    await this.artistGroupCollaborationRepository.save(collaboration);
  }

  async save(entity: Artist): Promise<Artist> {
   
    const dbEntity = this.mapper.toDataBaseEntity(entity);
    const savedArtist = await this.repository.save(dbEntity);
    savedArtist.apprenticeId=entity.getApprenticeId(); //<=
    return this.mapper.toDomainEntity(savedArtist);
  }

  async getArtistsWithDebut(agencyId?: string): Promise<Artist[]> {
    // Construir query para artistas que han debutado
    const query = this.repository
      .createQueryBuilder('artist')
      .innerJoin('artist.groupMemberships', 'membership')
      .where('membership.artist_debut_date IS NOT NULL')
      .andWhere('artist.status = :status', { status: 'ACTIVO' });

    if (agencyId) {
      // Si se especifica agencia, filtrar por agencia
      query.innerJoin('artist.agencyMemberships', 'agencyMembership')
          .andWhere('agencyMembership.agencyId = :agencyId', { agencyId })
          .andWhere('agencyMembership.endDate IS NULL OR agencyMembership.endDate > :now', { now: new Date() });
    }

    const artistEntities = await query.getMany();
    return this.mapper.toDomainEntities(artistEntities);
  }

  async getArtistDebutGroups(artistId: string): Promise<Group[]> {
    const memberships = await this.membershipRepository.find({
      where: { 
        artistId
      },
      relations: ['group']
    });

    if (!memberships.length) {
      return [];
    }

    const groupEntities = memberships.map(m => m.group);
    return this.groupMapper.toDomainEntities(groupEntities);
  }

  async getArtistDebutHistory(artistId: string): Promise<Array<{
    group: Group,
    role: string,
    debutDate: Date,
    startDate: Date,
    endDate: Date | null,
  }>>{
    // Obtener todas las membresías del artista que tengan fecha de debut
    const memberships = await this.membershipRepository.find({
      where: { 
        artistId
      },
      relations: ['group'],
      order: {
        artist_debut_date: 'ASC' // Ordenar cronológicamente por fecha de debut
      }
    });

    if (!memberships.length) {
      return [];
    }

    // Para cada membresía, construir el objeto de historial
    return memberships.map(membership => {
      const group = this.groupMapper.toDomainEntity(membership.group);
      
      return {
        group, // Entidad de dominio Group
        role: membership.rol,
        debutDate: membership.artist_debut_date,
        startDate: membership.startDate,
        endDate: membership.endDate,
      };
    });
  }
  async getArtistCurrentGroup(artistId: string): Promise<Group | null> {
    const now = new Date();
    
    // Buscar la membresía más reciente del artista
    const latestMembership = await this.membershipRepository.findOne({
      where: { artistId },
      relations: ['group'],
      order: { startDate: 'DESC' },
    });

    // Si no hay membresía, devolver null
    if (!latestMembership) {
      return null;
    }

    // Verificar si la membresía está activa
    const isActive = this.isMembershipActive(latestMembership, now);
    
    if (!isActive) {
      return null;
    }

    return this.groupMapper.toDomainEntity(latestMembership.group);
  }

  // Método auxiliar para verificar si una membresía está activa
  private isMembershipActive(membership: ArtistGroupMembershipEntity, currentDate: Date): boolean {
    // Verificar que la fecha actual sea después o igual a la fecha de inicio
    if (membership.startDate > currentDate) {
      return false; // La membresía aún no ha comenzado
    }

    // Verificar si tiene fecha de fin
    if (membership.endDate) {
      // Si tiene fecha de fin, verificar que la fecha actual sea antes o igual
      return currentDate <= membership.endDate;
    }
    return true;
  }

   async getArtists_WithAgencyChangesAndGroups(agencyId: string): Promise<Artist[]> {
    // 1. Obtener artistas con membresías activas en la agencia
    const query = this.repository
      .createQueryBuilder('artist')
      .innerJoin('artist.agencyMemberships', 'agency_membership')
      .where('agency_membership.agencyId = :agencyId', { agencyId })
      .andWhere('(agency_membership.endDate IS NULL OR agency_membership.endDate > CURRENT_DATE)')
      .groupBy('artist.id')
      .having('COUNT(DISTINCT agency_membership.agencyId) >= 2') // Al menos 2 agencias diferentes
      .andHaving('COUNT(DISTINCT gm.groupId) > 1'); // Más de un grupo

    // Añadir join para contar grupos
    query
      .leftJoin('artist.groupMemberships', 'gm')
      .groupBy('artist.id');

    // Ejecutar la consulta
    const artistEntities = await query.getMany();
    return this.mapper.toDomainEntities(artistEntities);
  }
    async findArtistsWithScheduleConflicts(startDate: Date, endDate: Date): Promise<Artist[]> {
        const artistEntities = await this.repository
        .createQueryBuilder('artist')
        .innerJoinAndSelect('artist.artistActivities', 'activity')
        .innerJoinAndSelect('activity.activityDates', 'activityDate')
        .where('activityDate.date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .getMany();

        return this.mapper.toDomainEntities(artistEntities);
    }

    async getArtistAlbums(id: string): Promise<Album[]> {
        const artistEntity = await this.repository.findOne({
        where: { id },
        relations: ['albums']
        });

        if (!artistEntity || !artistEntity.albums) {
            return [];
        }

        return this.albumMapper.toDomainEntities(artistEntity.albums);
    }
    
    async getArtistGroups(id: string): Promise<Group[]> {
        
        const artistEntity = await this.repository.findOne({
        where: { id },
        relations: ['groupMemberships', 'groupMemberships.group']
        });

        if (!artistEntity || !artistEntity.groupMemberships) {
            return [];
        }

        const groupEntities = artistEntity.groupMemberships
        .map(membership => membership.group)
        .filter(group => group !== undefined);

        return this.groupMapper.toDomainEntities(groupEntities);
    }
    
    async getArtist_ArtistColaborations(id: string): Promise<Array<{
      artist1: Artist;
      artist2: Artist;
      collaborationDate: Date;
    }>> {
      const artistEntity = await this.repository.findOne({
        where: { id },
        relations: [
          'collaborationsAsArtist1',
          'collaborationsAsArtist1.artist2',
          'collaborationsAsArtist2', 
          'collaborationsAsArtist2.artist1'
        ]
      });

      if (!artistEntity) {
        return [];
      }

      const collaborations: Array<{artist1: Artist, artist2: Artist, collaborationDate: Date}> = [];

      // Artistas con los que colaboró como artist1
      if (artistEntity.collaborationsAsArtist1) {
        for (const collab of artistEntity.collaborationsAsArtist1) {
          if (collab.artist2) {
            const domainArtist1 = this.mapper.toDomainEntity(artistEntity);
            const domainArtist2 = this.mapper.toDomainEntity(collab.artist2);
            collaborations.push({
              artist1: domainArtist1,
              artist2: domainArtist2,
              collaborationDate: collab.date
            });
          }
        }
      }

      // Artistas con los que colaboró como artist2
      if (artistEntity.collaborationsAsArtist2) {
        for (const collab of artistEntity.collaborationsAsArtist2) {
          if (collab.artist1) {
            const domainArtist1 = this.mapper.toDomainEntity(collab.artist1);
            const domainArtist2 = this.mapper.toDomainEntity(artistEntity);
            collaborations.push({
              artist1: domainArtist1,
              artist2: domainArtist2,
              collaborationDate: collab.date
            });
          }
        }
      }
      return collaborations;
    }

    async getArtist_GroupsColaborations(id: string): Promise<Array<{
      artist: Artist;
      group: Group;
      collaborationDate: Date;
    }>> {
      const artistEntity = await this.repository.findOne({
        where: { id },
        relations: ['groupCollaborations', 'groupCollaborations.group']
      });

      if (!artistEntity || !artistEntity.groupCollaborations) {
        return [];
      }

      const collaborations: Array<{artist: Artist, group: Group, collaborationDate: Date}> = [];

      // Obtener el artista en formato dominio una sola vez
      const domainArtist = this.mapper.toDomainEntity(artistEntity);

      for (const collaboration of artistEntity.groupCollaborations) {
        if (collaboration.group) {
          const domainGroup = this.groupMapper.toDomainEntity(collaboration.group);
          
          collaborations.push({
            artist: domainArtist,
            group: domainGroup,
            collaborationDate: collaboration.date
          });
        }
      }
      return collaborations;
    }
}