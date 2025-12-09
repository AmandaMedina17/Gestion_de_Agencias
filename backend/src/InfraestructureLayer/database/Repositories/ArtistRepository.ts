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
    // @InjectRepository(ContractEntity)
    // private readonly contractRepo: Repository<ContractEntity>,
    // private readonly contractMapper: ContractMapper,
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

   async getArtists_WithAgencyChangesAndGroups(): Promise<Artist[]> {
    // Subquery para contar cambios reales de agencia
    const agencyChangesSubQuery = this.repository
      .createQueryBuilder('artist')
      .select('artist.id')
      .addSelect('COUNT(DISTINCT am.agencyId)', 'distinctAgencies')
      .addSelect('COUNT(am.agencyId)', 'totalMemberships')
      .leftJoin('artist.agencyMemberships', 'am')
      .leftJoin('am.interval', 'interval')
      .groupBy('artist.id')
      .having('COUNT(DISTINCT am.agencyId) >= 2')  // Al menos 2 agencias diferentes
      .andHaving('COUNT(am.agencyId) >= 3');       // Al menos 3 membresías (asegura cambios)

    // Subquery para contar grupos
    const groupsSubQuery = this.repository
      .createQueryBuilder('artist')
      .select('artist.id')
      .addSelect('COUNT(DISTINCT gm.groupId)', 'groupCount')
      .leftJoin('artist.groupMemberships', 'gm')
      .groupBy('artist.id')
      .having('COUNT(DISTINCT gm.groupId) > 1');

    // Combinar ambas condiciones
    const result = await this.repository
      .createQueryBuilder('artist')
      .innerJoin(
        `(${agencyChangesSubQuery.getQuery()})`,
        'ac',
        'artist.id = ac.artist_id'
      )
      .innerJoin(
        `(${groupsSubQuery.getQuery()})`,
        'gc',
        'artist.id = gc.artist_id'
      )
      .setParameters({
        ...agencyChangesSubQuery.getParameters(),
        ...groupsSubQuery.getParameters(),
      })
      .getMany();

      return this.mapper.toDomainEntities(result);
}
  //Method for get the lastgroup of an artist 
  async getArtistLastGroup(idArtist : string) : Promise<Group>{

    const artist = this.findById(idArtist);

    if (!artist)
      throw new NotFoundException(`Artist with ID ${idArtist} not found`)

    const group = this.getArtistCurrentGroup(idArtist);

    if(!group){
      var latestMembership = await this.membershipRepository.findOne({
        where: {artistId:idArtist},
        relations: ['group'],
        order: {endDate: 'DESC' },
      });
    }
    return this.groupMapper.toDomainEntity(latestMembership!.group);
  }
    // async findArtistsWithScheduleConflicts(startDate: Date, endDate: Date): Promise<Artist[]> {
    //     const artistEntities = await this.repository
    //     .createQueryBuilder('artist')
    //     .innerJoinAndSelect('artist.artistActivities', 'activity')
    //     .innerJoinAndSelect('activity.activityDates', 'activityDate')
    //     .where('activityDate.date BETWEEN :startDate AND :endDate', { startDate, endDate })
    //     .getMany();

    //     return this.mapper.toDomainEntities(artistEntities);
    // }

    // async getArtistAgencies(id: string): Promise<Agency[]> {
    //     const artistEntity = await this.repository.findOne({
    //     where: { id },
    //     relations: ['agencyMemberships', 'agencyMemberships.agency']
    //     });

    //     if (!artistEntity || !artistEntity.agencyMemberships) {
    //         return [];
    //     }

    //     const agencyEntities = artistEntity.agencyMemberships
    //     .map(membership => membership.agency)
    //     .filter(agency => agency !== undefined);

    //     return this.agencyMapper.toDomainEntities(agencyEntities);

    // }

    // async getArtistAlbums(id: string): Promise<Album[]> {
    //     const artistEntity = await this.repository.findOne({
    //     where: { id },
    //     relations: ['albums']
    //     });

    //     if (!artistEntity || !artistEntity.albums) {
    //         return [];
    //     }

    //     return this.albumMapper.toDomainEntities(artistEntity.albums);
    // }
    
    // async getCurrentArtistContracts(id: string): Promise<Contract[]> {
    //     // Buscar contratos directamente desde ContractEntity donde el artista coincida
    //     const contractEntities = await this.contractRepository.find({
    //         where: { artistID: id },
    //         relations: ['interval'] // Cargar la relación con el intervalo para verificar fechas
    //     });

    //     if (!contractEntities) {
    //         return [];
    //     }

    //     const now = new Date();
        
    //     // Filtrar contratos activos (donde la fecha actual esté dentro del intervalo)
    //     const currentContracts = contractEntities.filter(contract => {
    //         const interval = contract.interval;
    //         return interval && 
    //             interval.startDate <= now && 
    //             interval.endDate >= now;
    //     });

    //     // Mapear a objetos de dominio Contract
    //     return currentContracts.map(contractEntity => {
    //         // Convertir las entidades relacionadas a objetos de dominio
    //         const intervalDomain = this.intervalMapper.toDomainEntity(contractEntity.interval);
    //         const agencyDomain = this.agencyMapper.toDomainEntity(contractEntity.agency);
    //         const artistDomain = this.mapper.toDomainEntity(contractEntity.artist);

    //         // Crear un ID único para el contrato en el dominio
    //         const contractId = `${contractEntity.intervalID}-${contractEntity.agencyID}-${contractEntity.artistID}`;
    //         return new Contract(
    //         contractId, // Usamos intervalID como ID del contrato
    //         intervalDomain,
    //         agencyDomain,
    //         artistDomain,
    //         contractEntity.distributionPercentage,
    //         contractEntity.status,
    //         contractEntity.conditions,
    //         );
    //     });
    // }

    // async getArtistGroups(id: string): Promise<Group[]> {
        
    //     const artistEntity = await this.repository.findOne({
    //     where: { id },
    //     relations: ['groupMemberships', 'groupMemberships.group']
    //     });

    //     if (!artistEntity || !artistEntity.groupMemberships) {
    //         return [];
    //     }

    //     const groupEntities = artistEntity.groupMemberships
    //     .map(membership => membership.group)
    //     .filter(group => group !== undefined);

    //     return this.groupMapper.toDomainEntities(groupEntities);
    // }
    
    // async getArtistDebutsInOrders(id: string): Promise<any[]> {
    //     const artistEntity = await this.repository.findOne({
    //     where: { id },
    //     relations: ['groupMemberships', 'groupMemberships.group']
    //     });

    //     if (!artistEntity || !artistEntity.groupMemberships) {
    //         return [];
    //     }

    //     // Ordenar por fecha de debut (de más antiguo a más reciente)
    //     const sortedMemberships = artistEntity.groupMemberships.sort((a, b) => {
    //         return new Date(a.fechaDebutArt).getTime() - new Date(b.fechaDebutArt).getTime();
    //     });

    //     // Retorna información sobre los debuts del artista en diferentes grupos
    //     return sortedMemberships.map(membership => ({
    //     groupId: membership.groupId,
    //     groupName: membership.group?.name,
    //     debutDate: membership.fechaDebutArt,
    //     role: membership.rol
    //     }));
    // }

    // async getArtist_ArtistColaborations(id: string): Promise<Artist[]> {
    //     const artistEntity = await this.repository.findOne({
    //     where: { id },
    //     relations: [
    //         'collaborationsAsArtist1',
    //         'collaborationsAsArtist1.artist2',
    //         'collaborationsAsArtist2', 
    //         'collaborationsAsArtist2.artist1'
    //     ]
    //     });

    //     if (!artistEntity) {
    //         return [];
    //     }

    //     const collaboratingArtists: ArtistEntity[] = [];

    //     // Artistas con los que colaboró como artist1
    //     if (artistEntity.collaborationsAsArtist1) {
    //         artistEntity.collaborationsAsArtist1
    //         .filter(collab => collab.artist2)
    //         .forEach(collab => collaboratingArtists.push(collab.artist2));
    //     }

    //     // Artistas con los que colaboró como artist2
    //     if (artistEntity.collaborationsAsArtist2) {
    //         artistEntity.collaborationsAsArtist2
    //         .filter(collab => collab.artist1)
    //         .forEach(collab => collaboratingArtists.push(collab.artist1));
    //     }
    //     // Eliminar duplicados
    //     const uniqueArtists = Array.from(new Set(collaboratingArtists.map(a => a.id)))
    //     .map(id => collaboratingArtists.find(a => a.id === id))
    //     .filter(artist => artist !== undefined) as ArtistEntity[];

    //     return this.mapper.toDomainEntities(uniqueArtists);
    // }

    // async getArtist_GroupsColaborations(id: string): Promise<Group[]> {
    //    const artistEntity = await this.repository.findOne({
    //     where: { id },
    //     relations: ['groupCollaborations', 'groupCollaborations.group']
    //     });

    //     if (!artistEntity || !artistEntity.groupCollaborations) {
    //         return [];
    //     }

    //     const groupEntities = artistEntity.groupCollaborations
    //     .map(collaboration => collaboration.group)
    //     .filter(group => group !== undefined);

    //     return this.groupMapper.toDomainEntities(groupEntities);
    // }
}