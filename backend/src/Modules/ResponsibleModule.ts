import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsibleEntity } from '@entities/ResponsibleEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ResponsibleMapper } from 'src/InfraestructureLayer/database/Mappers/ResponsibleMapper';
import { IResponsibleRepository } from '@domain/Repositories/IResponsibleRepository';
import { ResponsibleRepository } from 'src/InfraestructureLayer/database/Repositories/ResponsibleRepository';
import { ResponsibleController } from '@presentation/Controllers/responsible.controller';
import { ResponsibleService } from '@application/services/responsible.service';
import { BaseDtoMapper } from '@application/DTOs/DtoMappers/DtoMapper';
import { ResponsibleDtoMapper } from '@application/DTOs/DtoMappers/responsible.dtoMapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResponsibleEntity])
  ],
  controllers: [ResponsibleController],
  providers: [
    {
      provide: IMapper,      
      useClass: ResponsibleMapper  
    },
    {
      provide: IResponsibleRepository,    
      useClass: ResponsibleRepository 
    },
    {
      provide: BaseDtoMapper,    
      useClass: ResponsibleDtoMapper 
    },
    ResponsibleService
  ],
  exports: [
    IResponsibleRepository 
  ]
})
export class ResponsibleModule {}