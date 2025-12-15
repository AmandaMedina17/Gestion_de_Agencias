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
import { ArtistMapper } from "../Mappers/ArtistMapper";
import { AlbumMapper } from "../Mappers/AlbumMapper";

@Injectable()
export class GroupRepository extends BaseRepository<Group,GroupEntity> 
implements IGroupRepository{
  constructor(
    @InjectRepository(GroupEntity)
    repository: Repository<GroupEntity>,
    private readonly groupMapper: GroupMapper,
    private readonly artistRepository: IArtistRepository,
    private readonly albumMapper: AlbumMapper,

    @InjectDataSource()
    private readonly dataSource: DataSource,
    
    @InjectRepository(ArtistGroupMembershipEntity)
    private readonly membershipRepository: Repository<ArtistGroupMembershipEntity>,
    private readonly artistMapper: ArtistMapper
  ) {
    super(repository, groupMapper);
  }

  async findByIdWithMembers(id: string): Promise<Group | null> {
    try {

      // Obtener la entidad de persistencia con relaciones
      const groupEntity = await this.repository.findOne({
        where: { id },
        relations: [
          'artistMemberships',
          'artistMemberships.artist'
        ]
      });

      if (!groupEntity) {
        return null;
      }

      // Convertir artistMemberships a entidades Artist de dominio
      const activeMembers = groupEntity.artistMemberships
        .filter(membership => membership.endDate === null) // Solo activos
        .map(membership =>  membership.artist.id);

      // Crear la entidad de dominio Group con miembros
      return this.groupMapper.toDomainEntityWithMembers(groupEntity, activeMembers);

    } catch (error) {
      console.error(`Error cargando grupo con miembros ${id}:`, error);
      throw new Error(`No se pudo cargar el grupo: ${error}`);
    }
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

    async getGroupAlbums(id: string): Promise<Album[]> {
        const groupEntity = await this.repository.findOne({
          where: { id },
          relations: {albums: true}
        });

        if (!groupEntity) {
            throw new Error(`Group with id ${id} not found`);
        }

        if (!groupEntity.albums || groupEntity.albums.length === 0) {
            return [];
        }

        return this.albumMapper.toDomainEntities(groupEntity.albums);
    }
}