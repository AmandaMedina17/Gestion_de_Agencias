import { AddSongToBillboardDto } from '@application/DTOs/SongBillboardDto/add.sonBillboard.dto';
import { ResponseSongBillboardDto } from '@application/DTOs/SongBillboardDto/response.songBillboard.dto';
import { ISongBillboardRepository } from '@application/Repositories/ISonBillboardRepository';
import { AddSongToBillboardUseCase } from '@application/UseCases/add_song_billboard_use_case';
import { SongBillBoardMapper } from '@infrastructure/database/Mappers/SongBillBoardMapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SongBillboardService {
    constructor(
        private readonly addSongToBillboardUseCase : AddSongToBillboardUseCase,
        private readonly mapper : SongBillBoardMapper,
        private readonly songBillboardRepository : ISongBillboardRepository,
    ){}

    async add(dto : AddSongToBillboardDto) : Promise<ResponseSongBillboardDto>{
        const savedEntity = await this.addSongToBillboardUseCase.execute(dto)
        return this.mapper.toResponse(savedEntity)
    }

    async findAll() : Promise<ResponseSongBillboardDto[]>{
        const entities =  await this.songBillboardRepository.findAll();
        return this.mapper.toResponseList(entities)
    }

    async delete(songId: string, billboardId : string) : Promise <void> {
        return this.songBillboardRepository.remove(songId,billboardId);
    }
        
}
