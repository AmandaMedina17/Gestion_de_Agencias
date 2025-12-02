import { AwardDtoMapper } from '@application/DTOs/dtoMappers/award.dto.mapper';
import { AwardService } from '@application/services/award/award.service';
import { AWARD_REPOSITORY } from '@domain/Repositories/IAwardRepository';
import { AwardEntity } from '@infrastructure/database/Entities/AwardEntity';
import { AwardMapper } from '@infrastructure/database/Mappers/AwardMapper';
import { AwardRepository } from '@infrastructure/database/Repositories/AwardRepository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardController } from '@presentation/Controllers/award/award.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([AwardEntity])
    ],
    controllers: [AwardController],
    providers: [
      AwardMapper,
      {
        provide:AWARD_REPOSITORY,    
        useClass: AwardRepository
      },
      AwardDtoMapper,
      AwardService
    ],
    exports: [
        AWARD_REPOSITORY
    ]
  })
  export class AwardModule {}