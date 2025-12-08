import { AddSongToBillboardDto } from "@application/DTOs/SongBillboardDto/add.sonBillboard.dto";
import { ISongBillboardRepository } from "@application/Repositories/ISonBillboardRepository";
import { SongBillboardEntity } from "@infrastructure/database/Entities/SongBillboardEntity";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AddSongToBillboardUseCase {
    constructor(
        @Inject(ISongBillboardRepository)
        private readonly songBillBoardRepository: ISongBillboardRepository
    ) {}

    async execute(dto : AddSongToBillboardDto): Promise<SongBillboardEntity> {

        const object  = await this.songBillBoardRepository.findBySongIdBillboardId(dto.songId,dto.billboardId);

        if(object)
            throw new Error("The song you wanna include on billboards already exist");

        const entity = new SongBillboardEntity()

        entity.songId = dto.songId;
        entity.billboardListId = dto.billboardId;
        entity.place = dto.place;
        entity.entryDate = dto.date;

        return  await this.songBillBoardRepository.save(entity)
    }
}