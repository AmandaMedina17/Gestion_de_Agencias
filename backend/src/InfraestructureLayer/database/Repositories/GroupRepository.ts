import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "./BaseRepositoryImpl";
import { Group } from "@domain/Entities/Group";
import { GroupEntity } from "../Entities/GroupEntity";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, Repository } from "typeorm";
import { GroupMapper } from "../Mappers/GroupMapper";
import { Album } from "@domain/Entities/Album";
import { Artist } from "@domain/Entities/Artist";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { ArtistGroupMembershipEntity } from "../Entities/ArtistGroupMembershipEntity";
import { ArtistEntity } from "../Entities/ArtistEntity";
import { ArtistMapper } from "../Mappers/ArtistMapper";

@Injectable()
export class GroupRepository extends BaseRepository<Group,GroupEntity> 
implements IGroupRepository{
  constructor(
    @InjectRepository(GroupEntity)
    repository: Repository<GroupEntity>,
    mapper: GroupMapper,
    private readonly artistRepository: IArtistRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(ArtistGroupMembershipEntity)
    private readonly membershipRepository: Repository<ArtistGroupMembershipEntity>,
    private readonly artistMapper: ArtistMapper
  ) {
    super(repository, mapper);
  }
  
  async addMember(idGroup: string, idArtist: string, startDate: Date, rol: string, artist_debut_date: Date, endDate: Date | null): Promise<void> {
    
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      
      // Validar que el grupo existe
      const groupExists = await transactionalEntityManager.exists(GroupEntity, {
        where: { id: idGroup }
      });
      
      if (!groupExists) {
        throw new NotFoundException(`Grupo con ID ${idGroup} no encontrado`);
      }

      // 2. Validar que el artista existe
      const artistExists = await transactionalEntityManager.exists(ArtistEntity, {
        where: { id: idArtist }
      });
      
      if (!artistExists) {
        throw new NotFoundException(`Artista con ID ${idArtist} no encontrado`);
      }

      // 5. Validar fechas
      if (endDate && endDate <= startDate) {
        throw new ConflictException(
          'La fecha de finalización debe ser posterior a la fecha de inicio'
        );
      }

      // 6. Crear la nueva membresía
      const newMembership = new ArtistGroupMembershipEntity();
      newMembership.groupId = idGroup;
      newMembership.artistId = idArtist;
      newMembership.startDate = startDate;
      newMembership.rol = rol;
      newMembership.artist_debut_date = artist_debut_date;
      newMembership.endDate = endDate;

      // 7. Guardar la membresía
      await transactionalEntityManager.save(newMembership);

    });
  }

  // Método para obtener el grupo actual de un artista
  async getArtistCurrentGroup(artistId: string): Promise<Group | null> {

    // Verificar que el artista existe 
    const artist = await this.artistRepository.findById( artistId );

    if (!artist) {
      throw new Error(`Artista con ID ${artistId} no encontrado`);
    }

    // Buscar membresías activas del artista (endDate es null)
    const activeMemberships = await this.dataSource
      .createQueryBuilder(ArtistGroupMembershipEntity, 'membership')
      .innerJoinAndSelect('membership.group', 'group') // Cargar grupo completo
      .where('membership.artistId = :artistId', { artistId })
      .andWhere('membership.endDate IS NULL') // Solo miembros activos
      .orderBy('membership.startDate', 'DESC') // Ordenar por fecha más reciente
      .getMany();

    // Validar que no haya más de una membresía activa
    if (activeMemberships.length > 1) {
      const groupNames = activeMemberships
        .map(m => m.group?.name || 'Desconocido')
        .join(', ');
      
      throw new ConflictException(
        `El artista con ID ${artistId} tiene ${activeMemberships.length} ` +
        `membresías activas simultáneamente. Esto no está permitido. ` +
        `Grupos: ${groupNames}`
      );
    }

    // Si no hay membresías activas
    if (activeMemberships.length === 0) {
      return null;
    }

    // Obtener la única membresía activa
    const membership = activeMemberships[0];

    // Convertir GroupEntity a Group del dominio
    return this.mapper.toDomainEntity(membership.group);

  }

  async getGroupMembers(id: string): Promise<Artist[]> {
    try {

      // Verificar que el grupo existe
      const groupExists = await this.findById(id);

      if (!groupExists) {
        throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
      }

      // Obtener todas las membresías ACTIVAS del grupo (endDate es null)
      const activeMemberships = await this.membershipRepository.find({
        where: { 
          groupId: id, 
          endDate: IsNull()
        },
        relations: ['artist'], 
        order: {
          startDate: 'ASC'
        }
      });

      // Extraer las entidades ArtistEntity
      const artistEntities = activeMemberships.map(membership => membership.artist);

      // Convertir a entidades de dominio Artist usando ArtistMapper
      return this.artistMapper.toDomainEntities(artistEntities);
      
    } catch (error) {
      throw new Error(`No se pudieron obtener los miembros del grupo: ${error}`);
    }
  }

    getGroupColaborations(id: string): Promise<Artist[]> {
        throw new Error("Method not implemented.");
    }
    getGroupAlbums(id: string): Promise<Album[]> {
        throw new Error("Method not implemented.");
    }
}