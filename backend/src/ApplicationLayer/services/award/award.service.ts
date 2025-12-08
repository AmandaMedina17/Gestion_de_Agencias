import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Award } from '@domain/Entities/Award';
import { CreateAwardDto } from '@application/DTOs/AwardDto/create.award.dto';
import { ResponseAwardDto } from '@application/DTOs/AwardDto/response.award.dto';
import { UpdateAwardDto } from '@application/DTOs/AwardDto/update.award.dto';
import { IAwardRepository } from '@domain/Repositories/IAwardRepository';
import { AwardDtoMapper } from '@application/DTOs/dtoMappers/award.dto.mapper';

@Injectable()
export class AwardService extends BaseService<Award,CreateAwardDto,ResponseAwardDto,UpdateAwardDto>{
    constructor(
        @Inject(IAwardRepository)
        private readonly awardRepository: IAwardRepository,
        private readonly awardDtoMapper: AwardDtoMapper,
    ) {
        super(awardRepository, awardDtoMapper)
    }

    async addAwardToAlbum(awardId : string, albumId : string) : Promise<ResponseAwardDto>{
        const domain  = await this.awardRepository.findById(awardId)
        
        if(!domain)
            throw new Error("The award you wanna give to the song doesn't exist")

        domain.setAlbumId(albumId)

        return this.save(domain)
    }

    async save(entity : Award) : Promise<ResponseAwardDto> {
    
        const savedEntity = await this.awardRepository.save(entity)
        return this.mapper.toResponse(savedEntity)
    }
}