import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationEntity } from '@entities/EvaluationEntity';
import { IMapper } from 'src/InfraestructureLayer/database/Mappers/IMapper';
import { EvaluationMapper } from 'src/InfraestructureLayer/database/Mappers/EvaluationMapper';
import { IEvaluationRepository } from '@domain/Repositories/IEvaluationRepository';
import { EvaluationRepositoryImpl} from 'src/InfraestructureLayer/database/Repositories/EvaluationRepository';
import { EvaluationController } from '@presentation/controllers/EvaluationController';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationEntity])
  ],
  controllers: [EvaluationController],
  providers: [
    {
      provide: IMapper,      // ✅ Interfaz como token
      useClass: EvaluationMapper   // ✅ Implementación concreta
    },
    {
      provide: IEvaluationRepository,      // ✅ Interfaz como token
      useClass: EvaluationRepositoryImpl   // ✅ Implementación concreta
    }
  ],
  exports: [
    IEvaluationRepository 
  ]
})
export class EvaluationModule {}