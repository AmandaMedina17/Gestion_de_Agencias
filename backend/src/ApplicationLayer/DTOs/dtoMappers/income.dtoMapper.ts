import { Income } from '@domain/Entities/Income';
import { BaseDtoMapper } from './DtoMapper';
import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from '../incomeDto/create-income.dto';
import { IncomeResponseDto } from '../incomeDto/response-income.dto';

@Injectable()
export class IncomeDtoMapper extends BaseDtoMapper<Income, CreateIncomeDto, IncomeResponseDto>{
  
  fromDto(dto:  CreateIncomeDto): Income {
    throw new Error('Income creation requires complex logic. Use CreateIncomeUseCase instead.');
  };

  toResponse(domain: Income): IncomeResponseDto {
    if (!domain) {
      throw new Error('Activity is undefined in ActivityDtoMapper');
    }

    return {
      id: domain.getID(),
      activityId : domain.GetActivityID(),
      incomeType: domain.GetType(),
      mount: domain.getMount(),
      date: domain.getDate(),
      responsible: domain.getResponsible()    
    };
  }
}
