// services/CollaborationService.ts
import { BaseService } from "./BaseService";
import { CreateArtistCollaborationDto } from '../../../backend/src/ApplicationLayer/DTOs/artistCollaborationsDto/create-artist-collaboration.dto';
import { CreateArtistGroupCollaborationDto } from '../../../backend/src/ApplicationLayer/DTOs/artist_groupCollaborationDto/create-artist-group-collaboration.dto';
import { ArtistCollaborationResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistCollaborationsDto/response-artist-collaboration.dto';
import { ArtistGroupCollaborationResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artist_groupCollaborationDto/response-artist-group-collaboration.dto';

export class CollaborationService {
  private baseUrl = "http://localhost:3000";


  async createArtistCollaboration(createDto: CreateArtistCollaborationDto): Promise<ArtistCollaborationResponseDto> {
    const res = await fetch(`${this.baseUrl}/artists/artist-to-artist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createDto),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Obtener todas las colaboraciones artista-artista de una agencia
  async getArtistCollaborationsByAgency(agencyId: string): Promise<ArtistCollaborationResponseDto[]> {
    const res = await fetch(`${this.baseUrl}/agencies/${agencyId}/artist-collaborations`);
    if (!res.ok) {
      // Si el endpoint no existe, retornamos array vacío temporalmente
      console.warn('Endpoint para colaboraciones artista-artista por agencia no disponible');
      return [];
    }
    return res.json();
  }

  // Obtener colaboraciones de un artista específico
  async getArtistCollaborations(artistId: string): Promise<ArtistCollaborationResponseDto[]> {
    const res = await fetch(`${this.baseUrl}/artists/${artistId}/artist-collaborations`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  // Actualizar colaboración artista-artista (si necesitas esta funcionalidad)
  async updateArtistCollaboration(
    artist1Id: string, 
    artist2Id: string, 
    date: Date, 
    updateDto: CreateArtistCollaborationDto
  ): Promise<ArtistCollaborationResponseDto> {
    const res = await fetch(`${this.baseUrl}/artists/artist-collaborations/${artist1Id}/${artist2Id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updateDto, date }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Eliminar colaboración artista-artista
  async deleteArtistCollaboration(artist1Id: string, artist2Id: string, date: Date): Promise<void> {
    const res = await fetch(`${this.baseUrl}/artists/artist-collaborations/${artist1Id}/${artist2Id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
  }

  // ========== COLABORACIONES ARTISTA-GRUPO ==========

  // Crear colaboración artista-grupo
  async createArtistGroupCollaboration(createDto: CreateArtistGroupCollaborationDto): Promise<ArtistGroupCollaborationResponseDto> {
    const res = await fetch(`${this.baseUrl}/artists/artist-to-group`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createDto),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Obtener todas las colaboraciones artista-grupo de una agencia
  async getArtistGroupCollaborationsByAgency(agencyId: string): Promise<ArtistGroupCollaborationResponseDto[]> {
    const res = await fetch(`${this.baseUrl}/agencies/${agencyId}/artist-group-collaborations`);
    if (!res.ok) {
      // Si el endpoint no existe, retornamos array vacío temporalmente
      console.warn('Endpoint para colaboraciones artista-grupo por agencia no disponible');
      return [];
    }
    return res.json();
  }

  // Obtener colaboraciones artista-grupo de un artista específico
  async getArtistGroupCollaborations(artistId: string): Promise<ArtistGroupCollaborationResponseDto[]> {
    const res = await fetch(`${this.baseUrl}/artists/${artistId}/group-collaborations`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  // Actualizar colaboración artista-grupo
  async updateArtistGroupCollaboration(
    artistId: string, 
    groupId: string, 
    date: Date,
    updateDto: CreateArtistGroupCollaborationDto
  ): Promise<ArtistGroupCollaborationResponseDto> {
    const res = await fetch(`${this.baseUrl}/artists/artist-group-collaborations/${artistId}/${groupId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updateDto, date }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  // Eliminar colaboración artista-grupo
  async deleteArtistGroupCollaboration(artistId: string, groupId: string, date: Date): Promise<void> {
    const res = await fetch(`${this.baseUrl}/artists/artist-group-collaborations/${artistId}/${groupId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error: ${res.status}`);
    }
  }
}

export const collaborationService = new CollaborationService();