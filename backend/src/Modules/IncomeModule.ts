import { Module } from '@nestjs/common';
import { IncomeService } from '@application/services/income.service';
import { IncomeController } from '../PresentationLayer/Controllers/income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeEntity } from '@infrastructure/database/Entities/IncomeEntity';
import { ActivityModule } from './ActivityModule';
import { IncomeMapper } from '@infrastructure/database/Mappers/IncomeMapper';
import { IncomeDtoMapper } from '@application/DTOs/dtoMappers/income.dtoMapper';
import { IncomeRepository } from '@domain/Repositories/IncomeRepository';
import { IncomeRepositoryImpl } from '@infrastructure/database/Repositories/IncomeRepositoryImpl';
import { CreateIncomeUseCase } from '@domain/UseCases/create_income.use-case';

@Module({
  imports: 
    [TypeOrmModule.forFeature([IncomeEntity]),
    ActivityModule],
  controllers: [IncomeController],
  providers: [
    IncomeService,
    IncomeMapper,
    IncomeDtoMapper,
    CreateIncomeUseCase,
    {
      provide: IncomeRepository,
      useClass: IncomeRepositoryImpl
    }
  ],
  exports: [IncomeRepository]
})
export class IncomeModule {}

