// src/services/BillboardListService.ts
import { BaseService } from "./BaseService";
import { CreateBillBoardListDto } from "../../../backend/src/ApplicationLayer/DTOs/billboardDto/create.billboard.dto";
import { ResponseBillboardListDto } from "../../../backend/src/ApplicationLayer/DTOs/billboardDto/response.billboard.dto";

export class BillboardListService extends BaseService<
  CreateBillBoardListDto,
  ResponseBillboardListDto
> {
  constructor() {
    super("http://localhost:3000/billboard");
  }

  // Método para obtener listas por alcance (scope)
  async getListsByScope(scope: string): Promise<ResponseBillboardListDto[]> {
    return this.getCustom<ResponseBillboardListDto[]>(`scope/${scope}`);
  }

  // Método para obtener las canciones de una lista específica
  async getSongsByListId(listId: string): Promise<any[]> {
    return this.getCustom<any[]>(`${listId}/songs`);
  }

  // Método para obtener listas activas
  async getActiveLists(): Promise<ResponseBillboardListDto[]> {
    return this.getCustom<ResponseBillboardListDto[]>("active");
  }
}

// Instancia del servicio
export const billboardService = new BillboardListService();