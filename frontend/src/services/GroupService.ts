// GroupService.ts
import { BaseService } from "./BaseService";
import { CreateGroupDto } from "../../../backend/src/ApplicationLayer/DTOs/groupDto/create-group.dto";
import { GroupResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto";
import { AddMemberToGroupDto } from "../../../backend/src/ApplicationLayer/DTOs/membershipDto/add-member-to-group.dto";
import { ResponseMembershipDto } from "../../../backend/src/ApplicationLayer/DTOs/membershipDto/response-membership.dto";
import { CreateArtistDto } from "../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto";
import { ArtistResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto";
import { ApprenticeResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto";

// Extendemos el BaseService para incluir métodos específicos de grupo
export class GroupService extends BaseService<
  CreateGroupDto,
  GroupResponseDto
> {
  constructor() {
    super("http://localhost:3000/groups");
  }

  // Método para agregar un miembro al grupo
  async addMember(groupId: string, addMemberDto: AddMemberToGroupDto): Promise<ResponseMembershipDto> {
    // Usamos fetch directamente ya que necesitamos POST
    const res = await fetch(`http://localhost:3000/groups/${groupId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addMemberDto),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Método para obtener miembros del grupo usando getCustom
  async getGroupMembers(groupId: string): Promise<ArtistResponseDto[]> {
    return this.getCustom<ArtistResponseDto[]>(`${groupId}/members`);
  }

  // Método para remover un miembro del grupo
  async removeMember(groupId: string, artistId: string): Promise<void> {
    // Usamos fetch directamente ya que necesitamos DELETE
    const res = await fetch(`http://localhost:3000/groups/${groupId}/members/${artistId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
  }

  // Método para crear un artista (para el caso donde el aprendiz no tiene artista asociado)
  async createArtist(createArtistDto: CreateArtistDto): Promise<ArtistResponseDto> {
    // Usamos fetch directamente ya que es una ruta diferente
    const res = await fetch('http://localhost:3000/artists', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createArtistDto),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Método para obtener aprendices usando getCustom (asumiendo que tienes endpoint de Apprentices)
  async getApprentices(): Promise<ApprenticeResponseDto[]> {
    // Usamos fetch directamente ya que es una ruta diferente
    const res = await fetch('http://localhost:3000/Apprentices');

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Método para obtener un aprendiz específico
  async getApprentice(ApprenticeId: string): Promise<ApprenticeResponseDto> {
    const res = await fetch(`http://localhost:3000/Apprentices/${ApprenticeId}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Método para actualizar un aprendiz con su artista (cuando se crea el artista)
  async updateApprenticeWithArtist(ApprenticeId: string, artistId: string): Promise<ApprenticeResponseDto> {
    const res = await fetch(`http://localhost:3000/Apprentices/${ApprenticeId}/assign-artist`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }
}

// Instancia del servicio
export const groupService = new GroupService();