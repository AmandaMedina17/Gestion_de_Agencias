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

  // Método para obtener grupos no creados
  async getNotCreatedGroups(): Promise<GroupResponseDto[]> {
    return this.getCustom<GroupResponseDto[]>('not-created');
  }

  // Método para activar/aceptar un grupo (cambiarlo a creado)
  async activateGroup(groupId: string): Promise<GroupResponseDto> {
    const res = await fetch(`http://localhost:3000/groups/${groupId}/activate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }

     const contentLength = res.headers.get('content-length');
    const contentType = res.headers.get('content-type');
    
    // Si no hay contenido (204 No Content), obtener el grupo actualizado manualmente
    if (res.status === 204 || contentLength === '0' || !contentType?.includes('application/json')) {
      // Hacer una solicitud adicional para obtener el grupo actualizado
      return this.findOne(groupId);
    }
    
    return res.json();
  }

  // Método para agregar un miembro al grupo
  async addMember(groupId: string, addMemberDto: AddMemberToGroupDto): Promise<ResponseMembershipDto> {
    const res = await fetch(`http://localhost:3000/groups/addMember`, {
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

  // Método para obtener miembros del grupo
  async getGroupMembers(groupId: string): Promise<ArtistResponseDto[]> {
    return this.getCustom<ArtistResponseDto[]>(`${groupId}/members`);
  }

  // Método para remover un miembro del grupo
  async removeMember(groupId: string, artistId: string): Promise<void> {
    const res = await fetch(`http://localhost:3000/groups/${groupId}/members/${artistId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
  }

  // Método para crear un artista
  async createArtist(createArtistDto: CreateArtistDto): Promise<ArtistResponseDto> {
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

  // Método para obtener aprendices
  async getApprentices(): Promise<ApprenticeResponseDto[]> {
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
}

// Instancia del servicio
export const groupService = new GroupService();