import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { AssignAlbumToGroupDto } from "@application/DTOs/albumDto/assign-album-to-group.dto";
import { Album } from "@domain/Entities/Album";

@Injectable()
export class AssignAlbumToGroupUseCase {
    constructor(
        @Inject(IAlbumRepository)
        private readonly albumRepository: IAlbumRepository,
        @Inject(IGroupRepository)
        private readonly groupRepository: IGroupRepository
    ) {}

    async execute(dto: AssignAlbumToGroupDto): Promise<Album> {
        // Verificar que el álbum existe
        const album = await this.albumRepository.findById(dto.albumId);
        if (!album) {
            throw new NotFoundException(`Album with ID ${dto.albumId} not found`);
        }

        // Verificar que el grupo existe
        const group = await this.groupRepository.findById(dto.groupId);
        if (!group) {
            throw new NotFoundException(`Group with ID ${dto.groupId} not found`);
        }

        // Asignar álbum al grupo
        return await this.albumRepository.assignToGroup(dto.albumId, dto.groupId);
    }
}