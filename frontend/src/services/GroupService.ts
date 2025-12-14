import { BaseService } from "./BaseService";
import { CreateGroupDto } from "../../../backend/src/ApplicationLayer/DTOs/groupDto/create-group.dto";
import { GroupResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto";
import { AddMemberToGroupDto } from "../../../backend/src/ApplicationLayer/DTOs/membershipDto/add-member-to-group.dto";
import { LeaveGroupDto } from "../../../backend/src/ApplicationLayer/DTOs/membershipDto/leave-group.dto"; // AÑADIR ESTA IMPORTACIÓN
import { ResponseMembershipDto } from "../../../backend/src/ApplicationLayer/DTOs/membershipDto/response-membership.dto";
import { CreateArtistDto } from "../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto";
import { ArtistResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto";
import { ApprenticeResponseDto } from "../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto";

export class GroupService extends BaseService<CreateGroupDto, GroupResponseDto> {
  constructor() {
    super("http://localhost:3000/groups");
  }

  async getNotCreatedGroups(): Promise<GroupResponseDto[]> {
    return this.getCustom<GroupResponseDto[]>('not-created');
  }

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
    
    if (res.status === 204 || contentLength === '0' || !contentType?.includes('application/json')) {
      return this.findOne(groupId);
    }
    
    return res.json();
  }

  async addMember(addMemberDto: AddMemberToGroupDto): Promise<ResponseMembershipDto> {
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

  async getGroupMembers(groupId: string): Promise<ArtistResponseDto[]> {
    return this.getCustom<ArtistResponseDto[]>(`${groupId}/members`);
  }

  // CORREGIDO: Ahora recibe un LeaveGroupDto
  async removeMember(leaveGroupDto: LeaveGroupDto): Promise<void> {
    const res = await fetch(`http://localhost:3000/groups/removeMember`, {
      method: "POST",  // El controlador usa POST, no DELETE
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leaveGroupDto),  // Enviar el DTO en el body
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    
    // Si la respuesta es 204 No Content, no hay que parsear JSON
    if (res.status === 204) {
      return;
    }
    
    // Si hay contenido, parsearlo
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
  }

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

  async getApprentices(): Promise<ApprenticeResponseDto[]> {
    const res = await fetch('http://localhost:3000/Apprentices');

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  async getApprentice(apprenticeId: string): Promise<ApprenticeResponseDto> {
    const res = await fetch(`http://localhost:3000/Apprentices/${apprenticeId}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }
}

export const groupService = new GroupService();