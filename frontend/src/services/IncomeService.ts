import {CreateIncomeDto} from "../../../backend/src/ApplicationLayer/DTOs/incomeDto/create-income.dto"
import {IncomeResponseDto} from "../../../backend/src/ApplicationLayer/DTOs/incomeDto/response-income.dto"
import { BaseService } from "./BaseService";


export const incomeService = new BaseService<
  CreateIncomeDto,
  IncomeResponseDto
>("http://localhost:3000/income");