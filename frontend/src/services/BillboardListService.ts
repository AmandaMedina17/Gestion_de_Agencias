import { BaseService } from "./BaseService";
import { CreateBillBoardListDto } from "../../../backend/src/ApplicationLayer/DTOs/billboardDto/create.billboard.dto"
import { ResponseBillboardListDto } from "../../../backend/src/ApplicationLayer/DTOs/billboardDto/response.billboard.dto";

export const billboardService = new BaseService<
  CreateBillBoardListDto,
  ResponseBillboardListDto
>("http://localhost:3000/billboard");