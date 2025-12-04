import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseRepository } from './BaseRepositoryImpl';
import { Artist} from '@domain/Entities/Artist';
import { ArtistEntity } from '../Entities/ArtistEntity';
import { IMapper } from '../Mappers/IMapper';
import { Contract } from '@domain/Entities/Contract';
import { ContractEntity } from '../Entities/ContractEntity';
import { ContractMapper } from '../Mappers/ContractMapper';
import { ArtistMapper } from '../Mappers/ArtistMapper';

@Injectable()
export class ArtistRepository
  extends BaseRepository<Artist, ArtistEntity>
{
  constructor(
    @InjectRepository(ArtistEntity)
    repository: Repository<ArtistEntity>,
    mapper: ArtistMapper
    // @InjectRepository(ContractEntity)
    // private readonly contractRepo: Repository<ContractEntity>,
    // private readonly contractMapper: ContractMapper,
  ) {
    super(repository, mapper);
  }

  async save(entity: Artist): Promise<Artist> {
   
    const dbEntity = this.mapper.toDataBaseEntity(entity);
    const savedArtist = await this.repository.save(dbEntity);
    savedArtist.apprenticeId=entity.getApprenticeId(); //<=
    return this.mapper.toDomainEntity(savedArtist);
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