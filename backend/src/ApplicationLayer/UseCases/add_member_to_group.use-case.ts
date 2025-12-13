import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { AddMemberToGroupDto } from '@application/DTOs/membershipDto/add-member-to-group.dto';
import { ResponseMembershipDto } from '@application/DTOs/membershipDto/response-membership.dto';
import { IArtistGroupMembershipRepository } from '@domain/Repositories/IArtistGroupMembershipRepository';

@Injectable()
export class AddMemberToGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    @Inject(IArtistGroupMembershipRepository)
    private readonly membership_repository: IArtistGroupMembershipRepository
  ) {}

  async execute(addMemberDto: AddMemberToGroupDto): Promise<ResponseMembershipDto> {

    const { groupId,  artistId, role } = addMemberDto;

    // Cargar el grupo con sus miembros actuales
    const group = await this.groupRepository.findByIdWithMembers(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Verificar que el artista existe
    const artist = await this.artistRepository.findById(artistId);
    if (!artist) {
      throw new NotFoundException(`Artista con ID ${artistId} no encontrado`);
    }

    // Verificar que el artista no esté en otro grupo activo
    const currentGroup = await this.artistRepository.getArtistCurrentGroup(artistId);
    if (currentGroup) {
      throw new ConflictException(
        `El artista ya es miembro activo del grupo: ${currentGroup.getName()}`
      );
    }

    // Determinar fecha de inicio
    const startDate =  new Date();

    // Validar agregación del miembro (Mediante el dominio)
    const membershipInfo = group.addMember(artist.getId(), role , startDate);

    // Actualizar el grupo 
    await this.groupRepository.save(group);

    // Guardar la membersía
    await this.membership_repository.createMembership(
      membershipInfo.artistId,
      membershipInfo.groupId,
      membershipInfo.start_date,
      membershipInfo.role,
      membershipInfo.artistDebutDate,
      membershipInfo.endDate
    );

    return {
      artistId: membershipInfo.artistId,
      groupId: membershipInfo.groupId,
      role: membershipInfo.role,
      artist_debut_date: membershipInfo.artistDebutDate,
      startDate: membershipInfo.start_date,
      endDate: membershipInfo.endDate
    };
  }
}



