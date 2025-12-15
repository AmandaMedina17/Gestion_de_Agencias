import { BaseService } from "./BaseService";
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';
import { ProfessionalHistoryResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/professional_historyDto/response-professional-history.dto";

// Definimos la interfaz para la respuesta completa
export interface ArtistDebutHistoryWithActivitiesAndContractsResponseDto {
  artist: ArtistResponseDto;
  contracts: any[];
  activities: any[];
  debutHistory: any[];
}


interface TimelineEvent {
  id: string;
  date: Date | string;
  type: 'DEBUT' | 'CONTRACT_START' | 'CONTRACT_END' | 'GROUP_JOIN' | 'GROUP_LEAVE' | 'AGENCY_CHANGE' | 'COLLABORATION';
  title: string;
  description: string;
  details?: any;
}

interface ContractHistory {
  id: string;
  startDate: Date | string;
  endDate: Date | string | null;
  status: string;
  type: string;
  details?: string;
  agency: {
    id: string;
    name: string;
  };
}

interface DebutHistory {
  id: string;
  date: Date | string;
  title: string;
  description: string;
  type: string;
  successRate?: number;
  audienceReach?: number;
}

interface GroupMembership {
  id: string;
  group: {
    id: string;
    name: string;
    status: string;
    debutDate: Date | string;
  };
  startDate: Date | string;
  endDate: Date | string | null;
  role: string;
}

interface AgencyChange {
  id: string;
  agency: {
    id: string;
    name: string;
  };
  startDate: Date | string;
  endDate: Date | string | null;
  contractId?: string;
}

interface Collaboration {
  id: string;
  date: Date | string;
  type: 'ARTIST' | 'GROUP';
  partner: {
    id: string;
    name: string;
    type: 'ARTIST' | 'GROUP';
  };
  project: string;
  description: string;
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

  // Método para obtener el historial profesional de un artista
  async getProfessionalHistory(artistId: string): Promise<ProfessionalHistoryResponseDto> {
    const res = await fetch(`http://localhost:3000/artists/${artistId}/professional-history`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Método para obtener grupos del artista
  async getArtistGroups(artistId: string): Promise<any[]> {
    const res = await fetch(`http://localhost:3000/artists/${artistId}/groups`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Método para obtener colaboraciones del artista
  async getArtistCollaborations(artistId: string): Promise<any> {
    const res = await fetch(`http://localhost:3000/artists/${artistId}/artist-collaborations`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Método para obtener colaboraciones con grupos del artista
  async getArtistGroupCollaborations(artistId: string): Promise<any> {
    const res = await fetch(`http://localhost:3000/artists/${artistId}/group-collaborations`, {
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