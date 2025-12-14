import { CreateAwardDto } from '@application/DTOs/AwardDto/create.award.dto';
import { ResponseAwardDto } from '@application/DTOs/AwardDto/response.award.dto';
import { UpdateAwardDto } from '@application/DTOs/AwardDto/update.award.dto';
import { AlbumDtoMapper } from '@application/DTOs/dtoMappers/album.dto.mapper';
import { AwardDtoMapper } from '@application/DTOs/dtoMappers/award.dto.mapper';
import { AwardService } from '@application/services/award/award.service';
import { Album } from '@domain/Entities/Album';
import { IAlbumRepository } from '@domain/Repositories/IAlbumRepository';
import { IAwardRepository } from '@domain/Repositories/IAwardRepository';
import { IRepository } from '@domain/Repositories/IRepository';
import { AlbumEntity } from '@infrastructure/database/Entities/AlbumEntity';
import { AwardEntity } from '@infrastructure/database/Entities/AwardEntity';
import { AlbumMapper } from '@infrastructure/database/Mappers/AlbumMapper';
import { AwardMapper } from '@infrastructure/database/Mappers/AwardMapper';
import { AlbumRepository } from '@infrastructure/database/Repositories/AlbumRepository';
import { AwardRepository } from '@infrastructure/database/Repositories/AwardRepository';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardController } from '@presentation/Controllers/award/award.controller';
import { AlbumModule } from '../album/album.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([AwardEntity]),
      forwardRef(() => AlbumModule) //esto lo agregue
    ],
    
    controllers: [AwardController],
    providers: [
      AwardMapper,
      AlbumMapper,
      AlbumDtoMapper,
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