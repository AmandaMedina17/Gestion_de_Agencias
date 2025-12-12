import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { LeaveGroupDto } from '@application/DTOs/membershipDto/leave-group.dto';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { IArtistGroupMembershipRepository } from '@domain/Repositories/IArtistGroupMembershipRepository';

@Injectable()
export class LeaveGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    @Inject(IArtistGroupMembershipRepository)
    private readonly membership_repository: IArtistGroupMembershipRepository
  ) {}

  async execute(leaveGroupDto: LeaveGroupDto): Promise<void> {
    const { groupId,  artistId } = leaveGroupDto;

     // Verificar que el artista existe
    const artist = await this.artistRepository.findById(artistId);
    if (!artist) {
      throw new NotFoundException(`Artista con ID ${artistId} no encontrado`);
    }

    // Verificar que el grupo existe
    const group = await this.groupRepository.findByIdWithMembers(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Remover artista de grupo con validaciones de dominio
    group.removeMember(artist.getId())

    // Actualizar grupo
    await this.groupRepository.save(group);

    // Actualizar la membresía (establecer fecha de finalización)
    await this.membership_repository.endMembership(
      artistId,
      groupId,
      new Date()
    );

  }
}

