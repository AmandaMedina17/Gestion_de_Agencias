import {CreateAgencyDto} from "../../../backend/src/ApplicationLayer/DTOs/agencyDto/create-agency.dto"
import {AgencyResponseDto} from "../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto"
import { BaseService } from "./BaseService";

export const AgencyService = new BaseService<
  CreateAgencyDto,
  AgencyResponseDto
>("http://localhost:3000/agencies");