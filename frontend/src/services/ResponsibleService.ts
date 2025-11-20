import { BaseService } from "./BaseService";
import { CreateResponsibleDto, ResponsibleResponseDto } from "./dtos/ResponsibleDto";

export const responsibleService = new BaseService<
  CreateResponsibleDto,
  ResponsibleResponseDto
>("http://localhost:3000/responsible");
