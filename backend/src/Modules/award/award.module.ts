import { CreateAwardDto } from '@application/DTOs/AwardDto/create.award.dto';
import { ResponseAwardDto } from '@application/DTOs/AwardDto/response.award.dto';
import { UpdateAwardDto } from '@application/DTOs/AwardDto/update.award.dto';
import { AwardDtoMapper } from '@application/DTOs/dtoMappers/award.dto.mapper';
import { AwardService } from '@application/services/award/award.service';
import { IAwardRepository } from '@domain/Repositories/IAwardRepository';
import { IRepository } from '@domain/Repositories/IRepository';
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
        provide:IAwardRepository,    
        useClass: AwardRepository
      },
      AwardDtoMapper,
      AwardService,
      
    ],
    exports: [
        IAwardRepository,
        AwardMapper,
        AwardDtoMapper
    ]
  })
  export class AwardModule {}