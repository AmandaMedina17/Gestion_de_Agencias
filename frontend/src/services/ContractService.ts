import { BaseService } from "./BaseService";
import { CreateContractDto } from "../../../backend/src/ApplicationLayer/DTOs/contractDto/create-contract.dto"
import { ContractResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/contractDto/response-contract.dto";

export const contractService = new BaseService<
  CreateContractDto,
  ContractResponseDto
>("http://localhost:3000/contracts");