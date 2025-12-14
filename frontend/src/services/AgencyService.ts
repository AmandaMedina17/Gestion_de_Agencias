import { CreateAgencyDto } from "../../../backend/src/ApplicationLayer/DTOs/agencyDto/create-agency.dto";
import { ApprenticeResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto";
import { ArtistResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto";
import { AgencyResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto";
import { BaseService } from "./BaseService";
import { CreateArtistAgencyDto } from "../../../backend/src/ApplicationLayer/DTOs/artist_agencyDto/create-artist-agency.dto";
import { GroupResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto";
import { CreateEndMembershipDto } from "../../../backend/src/ApplicationLayer/DTOs/endArtistMembership/create-end-artist-membership.dto";

// Interfaz para la respuesta combinada
interface ArtistWithGroupResponse {
  keys: ArtistResponseDto[];
  values: GroupResponseDto[];
}

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

  // Método para agregar artista a una agencia
  async addArtistToAgency(agencyId: string, createArtistAgencyDto: CreateArtistAgencyDto): Promise<any> {
    return this.postCustom(`${agencyId}/artists`, createArtistAgencyDto);
  }

  // NUEVO: Método para finalizar membresía de un artista
 async endMembership(createEndMembershipDto: CreateEndMembershipDto): Promise<any> {
  try {
    const response = await fetch(`http://localhost:3000/agencies/end-membership`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createEndMembershipDto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error: ${response.status}`);
    }

    // Si la respuesta es exitosa, devolvemos un objeto vacío
    // sin intentar parsear JSON
    return {};
  } catch (error) {
    console.error('Error en endMembership:', error);
    throw error;
  }
}
  // Método para obtener grupos de una agencia
  async getAgencyGroups(agencyId: string): Promise<GroupResponseDto[]> {
    return this.getCustom<GroupResponseDto[]>(`${agencyId}/groups`);
  }

  // Método para obtener artistas activos con información de grupo
  async getActiveArtistsWithGroup(agencyId: string): Promise<any> {
    try {
      const response = await fetch(`http://localhost:3000/agencies/${agencyId}/activeArtists`);
      const data = await response.json();
      
      console.log('=== DEBUG: Respuesta de getActiveArtistsWithGroup ===');
      console.log('URL:', `http://localhost:3000/agencies/${agencyId}/activeArtists`);
      console.log('Respuesta completa:', data);
      console.log('Tipo de respuesta:', typeof data);
      
      if (Array.isArray(data)) {
        console.log('Es un array de longitud:', data.length);
        if (data.length > 0) {
          console.log('Primer elemento:', data[0]);
        }
      } else if (data && typeof data === 'object') {
        console.log('Es un objeto con propiedades:', Object.keys(data));
        if (data.keys && data.values) {
          console.log('keys es array?', Array.isArray(data.keys));
          console.log('values es array?', Array.isArray(data.values));
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error en getActiveArtistsWithGroup:', error);
      throw error;
    }
  }

  // Método para obtener artistas con debut y contratos activos
  async getArtistsWithDebutAndContracts(agencyId: string): Promise<any[]> {
    return this.getCustom<any[]>(`${agencyId}/artists-with-debut-and-contracts`);
  }

  // Método para obtener todos los artistas (para el modal)
  async getAllArtists(): Promise<ArtistResponseDto[]> {
    const res = await fetch("http://localhost:3000/artists");
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    
    return res.json();
  }

  async getAgencyCollaborations(agencyId: string): Promise<{
  artistCollaborations: any[];
  artistGroupCollaborations: any[];
}> {
  try {
    const response = await fetch(`http://localhost:3000/agencies/${agencyId}/collaborations`);
    const data = await response.json();
    
    // Mapear la respuesta del backend a la estructura esperada por el frontend
    return {
      artistCollaborations: data.artistCollaborations || [],
      artistGroupCollaborations: data.artist_groupCollaborations || []  // ¡Aquí está el mapeo!
    };
  } catch (error) {
    console.error('Error en getAgencyCollaborations:', error);
    throw error;
  }
}
}

export const agencyService = new AgencyService();