import {CreateActivityDto} from "../../../backend/src/ApplicationLayer/DTOs/activityDto/create-activity.dto"
import {ActivityResponseDto} from "../../../backend/src/ApplicationLayer/DTOs/activityDto/response-activity.dto"
import { BaseService } from "./BaseService";


export const activityService = new BaseService<
  CreateActivityDto,
  ActivityResponseDto
>("http://localhost:3000/activity");