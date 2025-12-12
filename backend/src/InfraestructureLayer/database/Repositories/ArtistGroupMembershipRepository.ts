import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { IArtistGroupMembershipRepository } from '@domain/Repositories/IArtistGroupMembershipRepository';
import { ArtistGroupMembershipEntity } from '../Entities/ArtistGroupMembershipEntity';
import { GroupMapper } from '../Mappers/GroupMapper';
import { Group } from '@domain/Entities/Group';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';

@Injectable()
export class ArtistGroupMembershipRepository implements IArtistGroupMembershipRepository {
  constructor(
    @InjectRepository(ArtistGroupMembershipEntity)
    private readonly repository: Repository<ArtistGroupMembershipEntity>,

    private readonly artistRepository: IArtistRepository,

    private readonly groupMapper: GroupMapper

  ) {}

  async createMembership(artistId: string, groupId: string, startDate: Date, role: string, 
    artistDebutDate: Date, endDate?: Date): Promise<void> {
    
    // Crear la nueva membresía
    const newMembership = new ArtistGroupMembershipEntity();
    newMembership.groupId = groupId;
    newMembership.artistId = artistId;
    newMembership.startDate = startDate;
    newMembership.rol = role;
    newMembership.artist_debut_date = artistDebutDate;
    newMembership.endDate = endDate === undefined ? null : endDate;
    
    // Guardar la membresía
    await this.repository.save(newMembership);
  }

  async endMembership(artistId: string, groupId: string, endDate: Date): Promise<void> {

    // Encontrar la membresía activa (endDate es null)
    const activeMembership = await this.repository.findOne({
      where: {
        artistId,
        groupId,
        endDate:IsNull(), // Solo membresías activas
      }
    });

    if (!activeMembership) {
      throw new Error(`No se encontró una membresía activa para el artista ${artistId} en el grupo ${groupId}`);
    }

    // Actualizar con fecha de finalización
    activeMembership.endDate = endDate;

    await this.repository.save(activeMembership);

  }

  // Método para obtener el grupo actual de un artista
  async getArtistCurrentGroup(artistId: string): Promise<Group | null> {

    // Verificar que el artista existe 
    const artist = await this.artistRepository.findById( artistId );

    if (!artist) {
      throw new Error(`Artista con ID ${artistId} no encontrado`);
    }

    // Buscar membresías activas del artista (endDate es null)
   const activeMemberships = await this.repository.find({
      where: {
        artistId,
        endDate: IsNull(),
      }
    });

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
    return this.groupMapper.toDomainEntity(membership.group);

   }

  // async getMembershipHistory(
  //   artistId: string, 
  //   groupId: string
  // ): Promise<ArtistGroupMembership[]> {
  //   const entities = await this.repository.find({
  //     where: {
  //       artistId,
  //       groupId,
  //     },
  //     order: {
  //       startDate: 'ASC',
  //     }
  //   });

  //   return entities.map(entity => new ArtistGroupMembership(
  //     entity.artistId,
  //     entity.groupId,
  //     entity.startDate,
  //     entity.rol,
  //     entity.artist_debut_date,
  //     entity.endDate,
  //     entity.reasonForLeaving
  //   ));
  // }

  // async createMembership(
  //   artistId: string,
  //   groupId: string,
  //   startDate: Date,
  //   rol: string,
  //   artistDebutDate: Date,
  //   endDate?: Date
  // ): Promise<void> {
  //   const entity = new ArtistGroupMembershipEntity();
  //   entity.artistId = artistId;
  //   entity.groupId = groupId;
  //   entity.startDate = startDate;
  //   entity.rol = rol;
  //   entity.artist_debut_date = artistDebutDate;
  //   entity.endDate = endDate || null;

  //   await this.repository.save(entity);
  // }
}