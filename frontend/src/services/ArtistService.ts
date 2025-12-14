import { BaseService } from "./BaseService";
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';

// Definimos la interfaz para la respuesta completa
export interface ArtistDebutHistoryWithActivitiesAndContractsResponseDto {
  artist: ArtistResponseDto;
  contracts: any[]; // Ajustar según el DTO real de contratos
  activities: any[]; // Ajustar según el DTO real de actividades
  debutHistory: any[]; // Ajustar según el DTO real de historial de debut
}

export class ArtistService extends BaseService<CreateArtistDto, ArtistResponseDto> {
  constructor() {
    super("http://localhost:3000/artists");
  }

  // Método para obtener artistas con cambios de agencia, grupos, contratos, actividades y historial de debut
  async getArtistsWithAgencyChangesAndGroups(agencyId: string): Promise<ArtistDebutHistoryWithActivitiesAndContractsResponseDto[]> {
    const res = await fetch(`http://localhost:3000/artists/agency-changes-and-groups/${agencyId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }
}

export const artistService = new ArtistService();