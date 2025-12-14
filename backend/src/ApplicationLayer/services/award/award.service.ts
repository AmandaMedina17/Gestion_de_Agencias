import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Award } from '@domain/Entities/Award';
import { CreateAwardDto } from '@application/DTOs/AwardDto/create.award.dto';
import { ResponseAwardDto } from '@application/DTOs/AwardDto/response.award.dto';
import { UpdateAwardDto } from '@application/DTOs/AwardDto/update.award.dto';
import { IAwardRepository } from '@domain/Repositories/IAwardRepository';
import { AwardDtoMapper } from '@application/DTOs/dtoMappers/award.dto.mapper';
import { IAlbumRepository } from '@domain/Repositories/IAlbumRepository';

@Injectable()
export class AwardService extends BaseService<Award,CreateAwardDto,ResponseAwardDto,UpdateAwardDto>{
    constructor(
        @Inject(IAwardRepository)
        private readonly awardRepository: IAwardRepository,
        @Inject(IAlbumRepository)
        private readonly albumRepository : IAlbumRepository,

        private readonly awardDtoMapper: AwardDtoMapper,
    ) {
        super(awardRepository, awardDtoMapper)
    }

    async addAwardToAlbum(awardId : string, albumId : string) : Promise<ResponseAwardDto>{
        const awardDomain  = await this.awardRepository.findById(awardId)

        if(!awardDomain)
            throw new Error("The award you wanna give to the album doesn't exist")

        if(awardDomain.getAlbum())
            throw new Error(`The award with id ${awardId} is already assigned to an album`)
        
        const albumDomain = await this.albumRepository.findById(albumId)

        if(albumDomain)
            awardDomain.setAlbum(albumDomain!)
        
        return this.save(awardDomain);
    }



    async save(entity : Award) : Promise<ResponseAwardDto> {
    
        const savedEntity = await this.awardRepository.save(entity)
        return this.mapper.toResponse(savedEntity)
    }
}