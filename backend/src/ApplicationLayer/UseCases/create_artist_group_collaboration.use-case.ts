import { CreateArtistGroupCollaborationDto } from "@application/DTOs/artist_groupCollaborationDto/create-artist-group-collaboration.dto";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { Inject, Injectable } from "@nestjs/common";
@Injectable()
export class CreateArtistGroupCollaborationUseCase {
  constructor(
    @Inject(IArtistRepository)
    private artistRepository: IArtistRepository,
    @Inject(IGroupRepository)
    private groupRepository: IGroupRepository
  ) {}

  async execute(createArtistGroupCollaborationDto: CreateArtistGroupCollaborationDto) {
    const { artistId, groupId, date } = createArtistGroupCollaborationDto;

    // Buscar artista y grupo en paralelo para mejor rendimiento
    const [artist, group] = await Promise.all([
      this.artistRepository.findById(artistId),
      this.groupRepository.findById(groupId)
    ]);

    if (!artist || !group) {
      throw new Error("Artist or group not found");
    }

    // Validaciones
    if (artist.getBirthDate() > date) {
      throw new Error("A collaboration cannot be before artist birthday");
    }
    if (artist.getDebutDate() > date) {
      throw new Error("A collaboration cannot be before artist debut");
    }
    if (group.getDebutDate() > date) {
      throw new Error("A collaboration cannot be before group debut");
    }

    // Crear la colaboración
    await this.artistRepository.createArtistGroupCollaboration(artistId, groupId, date);

    // Devolver los objetos y la fecha
    return { artist, group, date };
  }
}