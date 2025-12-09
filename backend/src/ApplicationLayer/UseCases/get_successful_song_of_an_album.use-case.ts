import { Album } from "@domain/Entities/Album";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GetSuccessfulSongOfAnAlbumUseCase {
    constructor(
        private readonly albumRepository : IAlbumRepository
    ) {}

    async execute (id : string) : ResponseHitsByAlbumDto{
        const 
    }
}