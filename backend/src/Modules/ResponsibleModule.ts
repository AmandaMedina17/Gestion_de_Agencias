import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsibleEntity } from '@infrastructure/database/Entities/ResponsibleEntity';
import { IMapper } from '@infrastructure/database/Mappers/IMapper';
import { ResponsibleMapper } from '@infrastructure/database/Mappers/ResponsibleMapper';
import { IResponsibleRepository } from '@domain/Repositories/IResponsibleRepository';
import { ResponsibleRepository } from '@infrastructure/database/Repositories/ResponsibleRepository';
import { ResponsibleController } from '@presentation/Controllers/responsible.controller';
import { ResponsibleService } from '@application/services/responsible.service';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { ResponsibleDtoMapper } from '@application/DTOs/dtoMappers/responsible.dtoMapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResponsibleEntity])
  ],
  controllers: [ResponsibleController],
  providers: [
    ResponsibleMapper,
    {
      provide: IResponsibleRepository,    
      useClass: ResponsibleRepository 
    },
    ResponsibleDtoMapper,
    ResponsibleService
  ],
  exports: [
    IResponsibleRepository,
    ResponsibleDtoMapper,
    ResponsibleMapper
  ]
})
export class ResponsibleModule {}