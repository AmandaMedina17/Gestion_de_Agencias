import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApprenticeEvaluationEntity } from "@infrastructure/database/Entities/ApprenticeEvaluationEntity";
import { ApprenticeEvaluationController } from "@presentation/Controllers/evaluation.controller";
import { IEvaluationRepository } from "@domain/Repositories/IEvaluationRepository";
import { EvaluationService } from "@application/services/evaluation.service";
import { EvaluationRepository } from "@infrastructure/database/Repositories/EvaluationRepository";

@Module({
  imports: [TypeOrmModule.forFeature([ApprenticeEvaluationEntity])],
  controllers: [ApprenticeEvaluationController],
  providers: [
    {
      provide: IEvaluationRepository,
      useClass: EvaluationRepository,
    },
    EvaluationService,
  ],
  exports: [IEvaluationRepository],
})
export class ApprenticeEvaluationModule {}
