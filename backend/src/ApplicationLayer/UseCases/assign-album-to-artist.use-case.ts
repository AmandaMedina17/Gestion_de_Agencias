import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { AssignAlbumToArtistDto } from "@application/DTOs/albumDto/assign-album-to-artist.dto";
import { Album } from "@domain/Entities/Album";

@Injectable()
export class AssignAlbumToArtistUseCase {
    constructor(
        @Inject(IAlbumRepository)
        private readonly albumRepository: IAlbumRepository,
        @Inject(IArtistRepository)
        private readonly artistRepository: IArtistRepository
    ) {}

    async execute(dto: AssignAlbumToArtistDto): Promise<Album> {
        // Verificar que el álbum existe
        const album = await this.albumRepository.findById(dto.albumId);
        if (!album) {
            throw new NotFoundException(`Album with ID ${dto.albumId} not found`);
        }

        // Verificar que el artista existe
        const artist = await this.artistRepository.findById(dto.artistId);
        if (!artist) {
            throw new NotFoundException(`Artist with ID ${dto.artistId} not found`);
        }

        // Asignar álbum al artista
        return await this.albumRepository.assignToArtist(dto.albumId, dto.artistId);
    }
}