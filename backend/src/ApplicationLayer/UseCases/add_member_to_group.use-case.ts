import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { AddMemberToGroupDto } from '@application/DTOs/membershipDto/add-member-to-group.dto';
import { ResponseMembershipDto } from '@application/DTOs/membershipDto/response-membership.dto';

@Injectable()
export class AddMemberToGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
  ) {}

  async execute(groupId: string, addMemberDto: AddMemberToGroupDto): Promise<ResponseMembershipDto> {

    // Validar que el grupo existe
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new Error(`Grupo con ID ${groupId} no encontrado`);
    }

    // Validar que el artista existe
    const artist = await this.artistRepository.findById(addMemberDto.artistId);
    if (!artist) {
      throw new Error(`Artista con ID ${addMemberDto.artistId} no encontrado`);
    }

     // Validar que el artista no esté en otro grupo 
    const artistGroup = await this.groupRepository.getArtistCurrentGroup(artist.getId())
    
    if (artistGroup) {
      throw new Error(`El artista ya es miembro activo del grupo: ${artistGroup.getName()}`);
    }

    const actual_date: Date = new Date();

    // Validar las fechas
    if (addMemberDto.endDate && addMemberDto.endDate <= actual_date) {
      throw new ConflictException(
        'La fecha de finalización debe ser posterior a la fecha actual'
      );
    }

    // Crear la membresía
    await this.groupRepository.addMember(
      groupId,
      addMemberDto.artistId,
      actual_date,
      addMemberDto.role,
      actual_date,
      addMemberDto.endDate || null
    );

     //Sacar la membresia de base de datos
    return {
        artistId: addMemberDto.artistId,
        groupId: groupId,
        role: addMemberDto.role,
        artist_debut_date: actual_date,
        startDate: actual_date,
        endDate: addMemberDto.endDate || undefined
  }
  }
}

