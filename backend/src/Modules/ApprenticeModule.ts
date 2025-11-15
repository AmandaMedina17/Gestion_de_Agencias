import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprenticeEntity } from '@entities/ApprenticeEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ApprenticeMapper } from 'src/InfraestructureLayer/database/Mappers/ApprenticeMapper';
import { IApprenticeRepository } from '@domain/Repositories/IApprenticeRepository';
import { ApprenticeRepository} from 'src/InfraestructureLayer/database/Repositories/ApprenticeRepository';
import { ApprenticeController } from '@presentation/controllers/apprentice.controller';

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
    }
  ],
  exports: [
    IApprenticeRepository 
  ]
})
export class ApprenticeModule {}
