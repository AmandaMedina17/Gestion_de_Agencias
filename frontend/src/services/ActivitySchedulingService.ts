import { BaseService } from "./BaseService";
import { ScheduleArtistDto } from "../../../backend/src/ApplicationLayer/DTOs/schedule-artistDto/schedule-artist.dto";
import { ScheduleGroupDto } from "../../../backend/src/ApplicationLayer/DTOs/schedule-groupDto/schedule-group.dto";

export class ActivitySchedulingService extends BaseService<any, any> {
  constructor() {
    super("http://localhost:3000");
  }

  private async handleResponse(response: Response): Promise<any> {
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    
    // Primero intentamos obtener el texto de la respuesta
    const responseText = await response.text();
    console.log("Response text:", responseText);
    
    // Si la respuesta está vacía (éxito sin cuerpo)
    if (response.status === 200 || response.status === 201) {
      // Si hay texto y parece JSON, intentamos parsearlo
      if (responseText && responseText.trim() !== '') {
        try {
          return JSON.parse(responseText);
        } catch (err) {
          console.log("No es JSON válido, retornando texto:", responseText);
          return { message: responseText };
        }
      }
      // Si no hay texto, retornamos éxito
      return { success: true };
    }
    
    // Para errores
    if (response.status === 409) {
      // Conflicto: ya existe
      throw new Error("El artista ya está programado para esta actividad");
    }
    
    // Otros errores
    try {
      // Intentamos parsear como JSON si hay contenido
      if (responseText && responseText.trim() !== '') {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (parseError) {
      // Si no es JSON, usamos el texto como mensaje de error
      throw new Error(responseText || `Error ${response.status}: ${response.statusText}`);
    }
  }

  // Método para programar actividad a un artista
  async scheduleArtist(scheduleArtistDto: ScheduleArtistDto): Promise<any> {
    const res = await fetch(`http://localhost:3000/artist-scheduling/schedule`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(scheduleArtistDto),
    });

    return this.handleResponse(res);
  }

  // Método para obtener actividades de un artista
  async getArtistActivities(artistId: string): Promise<any[]> {
    const res = await fetch(`http://localhost:3000/artist-scheduling/${artistId}/activities`, {
      headers: { 
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      },
    });

    console.log("Fetching artist activities for:", artistId);
    
    return this.handleResponse(res);
  }

  // Método para programar actividad a un grupo
  async scheduleGroup(scheduleGroupDto: ScheduleGroupDto): Promise<any> {
    const res = await fetch(`http://localhost:3000/group-scheduling/schedule`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(scheduleGroupDto),
    });

    return this.handleResponse(res);
  }

  // Método para obtener actividades de un grupo
  async getGroupActivities(groupId: string): Promise<any[]> {
    const res = await fetch(`http://localhost:3000/group-scheduling/${groupId}/activities`, {
      headers: { 
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      },
    });

    console.log("Fetching group activities for:", groupId);
    
    return this.handleResponse(res);
  }
}

export const activitySchedulingService = new ActivitySchedulingService();