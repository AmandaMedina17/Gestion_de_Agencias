import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprenticeEntity } from '@entities/ApprenticeEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { ApprenticeMapper } from 'src/InfraestructureLayer/database/Mappers/ApprenticeMapper';
import { IApprenticeRepository } from '@domain/Repositories/IApprenticeRepository';
import { ApprenticeRepositoryImpl} from 'src/InfraestructureLayer/database/Repositories/ApprenticeRepository';
import { ApprenticeController } from '@presentation/controllers/ApprenticeController';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApprenticeEntity])
  ],
  controllers: [ApprenticeController],
  providers: [
    {
      provide: IMapper,      // ✅ Interfaz como token
      useClass: ApprenticeMapper   // ✅ Implementación concreta
    },
    {
      provide: IApprenticeRepository,      // ✅ Interfaz como token
      useClass: ApprenticeRepositoryImpl   // ✅ Implementación concreta
    }
  ],
  exports: [
    IApprenticeRepository 
  ]
})
export class ApprenticeModule {}
