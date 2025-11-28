import { BaseService } from "./BaseService";
import { CreateApprenticeDto, ApprenticeResponseDto } from "./dtos/ApprenticeDto";

export const apprenticeService = new BaseService<
  CreateApprenticeDto,
  ApprenticeResponseDto
>("http://localhost:3000/apprentices");
