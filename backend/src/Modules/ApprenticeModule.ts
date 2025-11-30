import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprenticeEntity } from '@entities/ApprenticeEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ApprenticeMapper } from 'src/InfraestructureLayer/database/Mappers/ApprenticeMapper';
import { IApprenticeRepository } from '@domain/Repositories/IApprenticeRepository';
import { ApprenticeRepository} from 'src/InfraestructureLayer/database/Repositories/ApprenticeRepository';
import { ApprenticeController } from '../PresentationLayer/Controllers/apprentice.controller';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { ApprenticeDtoMapper } from '@application/DTOs/dtoMappers/apprentice.dtoMapper';
import { ApprenticeService } from '@application/services/apprentice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApprenticeEntity])
  ],
  controllers: [ApprenticeController],
  providers: [
    {
      provide: IMapper,      
      useClass: ApprenticeMapper   
    },
    {
      provide: IApprenticeRepository,      
      useClass: ApprenticeRepository  
    },
    {
      provide: BaseDtoMapper,
      useClass: ApprenticeDtoMapper
    },
    ApprenticeService
  ],
  exports: [
    IApprenticeRepository 
  ]
})
export class ApprenticeModule {}
