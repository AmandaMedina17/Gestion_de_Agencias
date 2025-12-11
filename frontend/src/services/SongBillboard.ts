// src/services/SongBillboardService.ts
import { AddSongToBillboardDto } from "../../../backend/src/ApplicationLayer/DTOs/SongBillboardDto/add.sonBillboard.dto";
import { ResponseSongBillboardDto } from "../../../backend/src/ApplicationLayer/DTOs/SongBillboardDto/response.songBillboard.dto";

// NOTA: El DTO de respuesta usa "billBoardId" con B mayúscula, no "billboardId"

export class SongBillboardService {
  private baseUrl = "http://localhost:3000/song-billboard";

  async create(createDto: AddSongToBillboardDto): Promise<ResponseSongBillboardDto> {
    console.log('Enviando datos al backend (SongBillboard):', createDto);
    
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        songId: createDto.songId,
        billboardId: createDto.billboardId, // En el DTO de creación es "billboardId"
        place: createDto.place,
        date: createDto.date ? createDto.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error del backend (SongBillboard):', errorData);
      throw new Error(errorData.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  async findAll(): Promise<ResponseSongBillboardDto[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async findBySongId(songId: string): Promise<ResponseSongBillboardDto[]> {
    const res = await fetch(`${this.baseUrl}/song/${songId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async findByBillboardId(billboardId: string): Promise<ResponseSongBillboardDto[]> {
    const res = await fetch(`${this.baseUrl}/billboard/${billboardId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async findOne(songId: string, billboardId: string): Promise<ResponseSongBillboardDto> {
    const res = await fetch(`${this.baseUrl}/${songId}/${billboardId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async update(
    songId: string, 
    billboardId: string, 
    updateData: Partial<AddSongToBillboardDto>
  ): Promise<ResponseSongBillboardDto> {
    
    console.log("Actualizando SongBillboard:", { songId, billboardId, updateData });

    const res = await fetch(`${this.baseUrl}/${songId}/${billboardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error del backend al actualizar:', errorData);
      throw new Error(errorData.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  async remove(songId: string, billboardId: string): Promise<void> {
    console.log("Eliminando SongBillboard:", { songId, billboardId });
    
    const res = await fetch(`${this.baseUrl}/${songId}/${billboardId}`, { 
      method: "DELETE" 
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error del backend al eliminar:', errorData);
      throw new Error(errorData.message || `Error: ${res.status}`);
    }
  }

  // Método alias para compatibilidad
  async removeSongFromBillboard(songId: string, billboardId: string): Promise<void> {
    return this.remove(songId, billboardId);
  }
}

export const songBillboardService = new SongBillboardService();