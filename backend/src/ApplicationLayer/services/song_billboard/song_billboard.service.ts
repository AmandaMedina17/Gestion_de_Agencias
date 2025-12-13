import { AddSongToBillboardDto } from '@application/DTOs/SongBillboardDto/add.sonBillboard.dto';
import { ResponseSongBillboardDto } from '@application/DTOs/SongBillboardDto/response.songBillboard.dto';
import { ISongBillboardRepository } from '@domain/Repositories/ISonBillboardRepository';
import { AddSongToBillboardUseCase } from '@application/UseCases/add_song_billboard_use_case';
import { SongBillBoardMapper } from '@infrastructure/database/Mappers/SongBillboardMapper';
import { Injectable } from '@nestjs/common';
import { SongBillboardDtoMapper } from '@application/DTOs/dtoMappers/song.billboard.dtoMapper';

@Injectable()
export class SongBillboardService {
    constructor(
        private readonly addSongToBillboardUseCase : AddSongToBillboardUseCase,
        private readonly mapper : SongBillboardDtoMapper,
        private readonly songBillboardRepository : ISongBillboardRepository,
    ){}

    async add(dto : AddSongToBillboardDto) : Promise<ResponseSongBillboardDto>{
        await this.addSongToBillboardUseCase.execute(dto);
        const forResponse = await this.songBillboardRepository.findBySongIdBillboardId(dto.songId,dto.billboardId);

        return this.mapper.toResponse(forResponse!)
    }

    async findAll() : Promise<ResponseSongBillboardDto[]>{
        const entities =  await this.songBillboardRepository.findAll();
        return this.mapper.toResponseList(entities)
    }

    async delete(songId: string, billboardId : string) : Promise <void> {
        return this.songBillboardRepository.remove(songId,billboardId);
    }
        
}
