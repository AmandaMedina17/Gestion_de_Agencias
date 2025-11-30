import { BaseService } from "./BaseService";
import { CreateResponsibleDto } from "../../../backend/src/ApplicationLayer/DTOs/responsibleDto/create-responsible.dto";
import { ResponsibleResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/responsibleDto/response-responsible.dto";

export const responsibleService = new BaseService<
  CreateResponsibleDto,
  ResponsibleResponseDto
>("http://localhost:3000/responsible");