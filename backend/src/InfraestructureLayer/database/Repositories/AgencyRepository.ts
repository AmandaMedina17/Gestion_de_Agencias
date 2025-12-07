import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
import { ArtistAgencyMembershipEntity } from '../Entities/ArtistAgencyMembershipEntity';
import { ArtistRepository } from './ArtistRepository';
import { ArtistEntity } from '../Entities/ArtistEntity';
import { ArtistGroupMembershipEntity } from '../Entities/ArtistGroupMembershipEntity';

@Injectable()
export class AgencyRepositoryImpl 
  extends BaseRepository<Agency, AgencyEntity>
  implements IAgencyRepository 
{
    constructor(
    @InjectRepository(AgencyEntity)
    repository: Repository<AgencyEntity>,
    @InjectRepository(ArtistAgencyMembershipEntity)
    private readonly artistAgencyMembershipRepository: Repository<ArtistAgencyMembershipEntity>,
    mapper: AgencyMapper,
    @InjectRepository(ArtistEntity)
    private readonly artistRepository : Repository<ArtistEntity>,
    private readonly groupMapper: GroupMapper,
    private readonly apprenticeMapper: ApprenticeMapper,
    private readonly artistMapper: ArtistMapper
  ) {
    super(repository, mapper);
  }
  // async addArtistToAgency(
  //   artistId: string, 
  //   agencyId: string, 
  //   startDate: Date, 
  //   endDate: Date
  // ): Promise<void> {
  //   // Verificar si ya existe una membresía activa en el mismo período
  //   const existingMembership = await this.artistAgencyMembershipRepository
  //     .createQueryBuilder('membership')
  //     .where('membership.artistId = :artistId', { artistId })
  //     .andWhere('membership.agencyId = :agencyId', { agencyId })
  //     .andWhere(
  //       '(membership.endDate IS NULL OR membership.endDate >= :startDate)',
  //       { startDate }
  //     )
  //     .getOne();

  //   if (existingMembership) {
  //     throw new ConflictException(
  //       `Artist ${artistId} is already a member of agency ${agencyId} in this period`
  //     );
  //   }

  //   // Crear nueva membresía
  //   const membership = new ArtistAgencyMembershipEntity();
  //   membership.artistId = artistId;
  //   membership.agencyId = agencyId;
  //   membership.startDate = startDate;
  //   membership.endDate = endDate;

  //   await this.artistAgencyMembershipRepository.save(membership);
  // }
  async addArtistToAgency(
    artistId: string, 
    agencyId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<void> {
    // 1. Obtener el artista para verificar su fecha de debut
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['groupMemberships']
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    }

    // 2. Verificar que la fecha de inicio sea posterior a la fecha de debut del artista
    // Buscar la membresía de grupo más temprana (debut)
    // const earliestGroupMembership = artist.groupMemberships?.reduce((earliest, current) => {
    //   if (!earliest || current.startDate < earliest.startDate) {
    //     return current;
    //   }
    //   return earliest;
    // }, null as ArtistGroupMembershipEntity | null);

    // if (earliestGroupMembership && startDate < earliestGroupMembership.startDate) {
    //   throw new BadRequestException(
    //     `Artist cannot join an agency (${startDate.toISOString().split('T')[0]}) before their debut date (${earliestGroupMembership.startDate.toISOString().split('T')[0]})`
    //   );
    // }

    // 3. Verificar que el artista no esté en otra agencia en el mismo período
    const existingMembership = await this.artistAgencyMembershipRepository
      .createQueryBuilder('membership')
      .where('membership.artistId = :artistId', { artistId })
      .andWhere('membership.agencyId != :agencyId', { agencyId }) // Distinta agencia
      .andWhere(
        `(
          (membership.startDate <= :endDate AND membership.endDate >= :startDate) OR
          (membership.startDate >= :startDate AND membership.startDate <= :endDate) OR
          (membership.endDate >= :startDate AND membership.endDate <= :endDate)
        )`,
        { startDate, endDate }
      )
      .getOne();

    if (existingMembership) {
      throw new ConflictException(
        `Artist ${artistId} is already a member of agency ${existingMembership.agencyId} from ${existingMembership.startDate.toISOString().split('T')[0]} to ${existingMembership.endDate.toISOString().split('T')[0]}`
      );
    }

    // 4. Verificar que no exista membresía duplicada en la misma agencia
    const duplicateMembership = await this.artistAgencyMembershipRepository.findOne({
      where: {
        artistId,
        agencyId,
        startDate,
        endDate
      }
    });

    if (duplicateMembership) {
      throw new ConflictException(
        `Artist ${artistId} already has this membership in agency ${agencyId}`
      );
    }

    // Crear nueva membresía
    const membership = new ArtistAgencyMembershipEntity();
    membership.artistId = artistId;
    membership.agencyId = agencyId;
    membership.startDate = startDate;
    membership.endDate = endDate;

    await this.artistAgencyMembershipRepository.save(membership);
  }

  // Método para eliminar una membresía
  async removeArtistFromAgency(
    artistId: string,
    agencyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<void> {
    const membership = await this.artistAgencyMembershipRepository.findOne({
      where: {
        artistId,
        agencyId,
        startDate,
        endDate
      }
    });

    if (!membership) {
      throw new NotFoundException(
        `Membership not found for artist ${artistId} in agency ${agencyId} with dates ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
      );
    }

    await this.artistAgencyMembershipRepository.remove(membership);
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