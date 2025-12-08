import {CreateAgencyDto} from "../../../backend/src/ApplicationLayer/DTOs/agencyDto/create-agency.dto"
import { ApprenticeResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto";
import { ArtistResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto";


import {AgencyResponseDto} from "../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto"
import { BaseService } from "./BaseService";

class AgencyService extends BaseService<CreateAgencyDto, AgencyResponseDto> {
  constructor() {
    super("http://localhost:3000/agencies");
  }

   // Método específico para obtener aprendices de una agencia
  async getAgencyApprentices(agencyId: string): Promise<ApprenticeResponseDto[]> {
    return this.getCustom<ApprenticeResponseDto[]>(`${agencyId}/apprentices`);
  }

  // Método específico para obtener artistas de una agencia
  async getAgencyArtists(agencyId: string): Promise<ArtistResponseDto[]> {
    return this.getCustom<ArtistResponseDto[]>(`${agencyId}/artists`);
  }
}

export const agencyService = new AgencyService();
