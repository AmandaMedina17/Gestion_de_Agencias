import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsibleEntity } from '@entities/ResponsibleEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ResponsibleMapper } from 'src/InfraestructureLayer/database/Mappers/ResponsibleMapper';
import { IResponsibleRepository } from '@domain/Repositories/IResponsibleRepository';
import { ResponsibleRepository } from 'src/InfraestructureLayer/database/Repositories/ResponsibleRepository';
import { ResponsibleController } from '@presentation/Controllers/ResponsibleControler';

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
    }
  ],
  exports: [
    IResponsibleRepository 
  ]
})
export class ResponsibleModule {}