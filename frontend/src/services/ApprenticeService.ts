import { BaseService } from "./BaseService";
import { CreateApprenticeDto } from "../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/create-apprentice.dto";
import { ApprenticeResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto";

export const apprenticeService = new BaseService<
  CreateApprenticeDto,
  ApprenticeResponseDto
>("http://localhost:3000/apprentices");