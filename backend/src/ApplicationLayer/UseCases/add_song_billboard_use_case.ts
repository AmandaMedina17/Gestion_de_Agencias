import { AddSongToBillboardDto } from "@application/DTOs/SongBillboardDto/add.sonBillboard.dto";
import { ISongBillboardRepository } from "@domain/Repositories/ISonBillboardRepository";
import { IBillboardRepository } from "@domain/Repositories/IBillboardListRepository";
import { IRepository } from "@domain/Repositories/IRepository";
import { ISongRepository } from "@domain/Repositories/ISongRepository";
import { BillboardListEntity } from "@infrastructure/database/Entities/BillboardListEntity";
import { SongBillboardEntity } from "@infrastructure/database/Entities/SongBillboardEntity";
import { SongEntity } from "@infrastructure/database/Entities/SongEntity";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SongBillboard } from "@domain/Entities/SongBillboard";
import { validate } from "class-validator";

@Injectable()
export class AddSongToBillboardUseCase {
    constructor(
        @Inject(ISongBillboardRepository)
        private readonly songBillBoardRepository: ISongBillboardRepository,
        @Inject(ISongRepository)
        private readonly songRepository : ISongRepository,
        @Inject(IBillboardRepository)
        private readonly billboardRepository : IBillboardRepository
        
    ) {}

    async execute(dto : AddSongToBillboardDto): Promise<SongBillboard> {
        
        const song = await this.songRepository.findById(dto.songId);

        if(!song)
            throw new NotFoundException(`The song with ID:${dto.songId} doesn't exist`);
    
        const billBoard = await this.billboardRepository.findById(dto.billboardId);

        if(!billBoard)
            throw new NotFoundException("The billboard lit where you wanna include the song doesn't exist");

        
        if(dto.place > billBoard.getEndList())
            throw new Error (`The place ${dto.date} is greather than ${billBoard.getEndList()}`)

        
        const object  = await this.songBillBoardRepository.findBySongIdBillboardId(dto.songId,dto.billboardId);
        
        if(object)
            throw new Error("The song you wanna include on billboards already exist there");

        const posOcupated = await this.songBillBoardRepository.posOcupated(dto.place);

        if(posOcupated)
            throw new Error (`The position${dto.place} is ocupated on this billboard list`);

        const dateDto = new Date(dto.date);

        if(dateDto< billBoard.getPublicDate() || dateDto < song.getDate())
            throw new Error (`The date : ${dto.date} should be afther the billboard list or song creation`);

        const entity = new SongBillboard(
            song,billBoard,dto.place,dto.date
        )
        await this.songBillBoardRepository.save(entity)

        return object!;
    }
}