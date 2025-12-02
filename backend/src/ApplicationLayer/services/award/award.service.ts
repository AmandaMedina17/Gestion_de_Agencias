import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Award } from '@domain/Entities/Award';
import { CreateAwardDto } from '@application/DTOs/AwardDto/create.award.dto';
import { ResponseAwardDto } from '@application/DTOs/AwardDto/response.award.dto';
import { UpdateAwardDto } from '@application/DTOs/AwardDto/update.award.dto';
import { AWARD_REPOSITORY, IAwardRepository } from '@domain/Repositories/IAwardRepository';
import { AwardDtoMapper } from '@application/DTOs/dtoMappers/award.dto.mapper';

@Injectable()
export class AwardService extends BaseService<Award,CreateAwardDto,ResponseAwardDto,UpdateAwardDto>{
    constructor(
        @Inject(AWARD_REPOSITORY)
        private readonly awardRepository: IAwardRepository,
        private readonly awardDtoMapper: AwardDtoMapper
    ) {
        super(awardRepository, awardDtoMapper)
    }
}