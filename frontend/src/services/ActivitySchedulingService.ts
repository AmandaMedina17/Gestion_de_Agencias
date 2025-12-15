// src/services/ActivitySchedulingService.ts
import { BaseService } from "./BaseService";
import { ScheduleArtistDto } from "../../../backend/src/ApplicationLayer/DTOs/schedule-artistDto/schedule-artist.dto";
import { ScheduleGroupDto } from "../../../backend/src/ApplicationLayer/DTOs/schedule-groupDto/schedule-group.dto";
import { ArtistIncomeDto } from "../../../backend/src/ApplicationLayer/DTOs/schedule-artistDto/artist_income.dto";

export class ActivitySchedulingService extends BaseService<any, any> {
  constructor() {
    super("http://localhost:3000");
  }

  private async handleResponse(response: Response): Promise<any> {
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    
    const responseText = await response.text();
    console.log("Response text:", responseText);
    
    if (response.status === 200 || response.status === 201) {
      if (responseText && responseText.trim() !== '') {
        try {
          return JSON.parse(responseText);
        } catch (err) {
          console.log("No es JSON válido, retornando texto:", responseText);
          return { message: responseText };
        }
      }
      return { success: true };
    }
    
    if (response.status === 404) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || `Artista no programado para esta actividad`);
      } catch {
        throw new Error(`Artista no programado para esta actividad (404)`);
      }
    }
    
    if (response.status === 409) {
      throw new Error("El artista ya está programado para esta actividad");
    }
    
    try {
      if (responseText && responseText.trim() !== '') {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (parseError) {
      throw new Error(responseText || `Error ${response.status}: ${response.statusText}`);
    }
  }

  // Método para calcular ingresos del artista
  async getArtistIncomes(artistIncomeDto: ArtistIncomeDto): Promise<any> {
    console.log("Enviando DTO de ingresos:", artistIncomeDto);
    
    const res = await fetch(`http://localhost:3000/artist-scheduling/incomes`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(artistIncomeDto),
    });

    return this.handleResponse(res);
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

  // Método para confirmar asistencia
  async confirmAttendance(artistId: string, activityId: string, confirm: boolean, reason?: string): Promise<any> {
    console.log("=== DEBUG CONFIRM ATTENDANCE ===");
    console.log("Artist ID:", artistId);
    console.log("Activity ID:", activityId);
    console.log("Confirm:", confirm);
    console.log("Token:", localStorage.getItem('token')?.substring(0, 20) + "...");
    
    const res = await fetch(`http://localhost:3000/artist-scheduling/confirm-attendance`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({
        artistId,
        activityId,
        confirm,
        reason
      }),
    });

    console.log("Confirming attendance for artist:", artistId, "activity:", activityId, "confirm:", confirm);
    
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
  async getGroupActivities(groupId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const defaultEndDate = endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const requestBody = {
      groupId,
      start_date: defaultStartDate.toISOString(),
      end_date: defaultEndDate.toISOString()
    };

    const res = await fetch(`http://localhost:3000/group-scheduling/activities`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Fetching group activities for:", groupId);
    
    return this.handleResponse(res);
  }

  // Nuevo método: Obtener TODAS las actividades de un grupo sin filtro de fecha
  async getAllGroupActivities(groupId: string): Promise<any[]> {
    const startDate = new Date('2000-01-01');
    const endDate = new Date('2100-12-31');

    return this.getGroupActivities(groupId, startDate, endDate);
  }

  async verifyArtistScheduled(artistId: string, activityId: string): Promise<boolean> {
    try {
      const res = await fetch(`http://localhost:3000/artist-scheduling/verify-schedule/${artistId}/${activityId}`, {
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        },
      });
      
      if (res.status === 200) {
        const data = await res.json();
        return data.isScheduled || false;
      }
      return false;
    } catch (err) {
      console.error("Error verifying schedule:", err);
      return false;
    }
  }

  async checkIfArtistIsResponsible(artistId: string, activityId: string): Promise<boolean> {
    try {
      const activities = await this.getArtistActivities(artistId);
      
      const activity = activities.find((a: any) => 
        a.id === activityId || a.activityId === activityId
      );
      
      if (activity && activity.responsibles) {
        return activity.responsibles.some((r: any) => r.id === artistId);
      }
      
      return false;
    } catch (err) {
      console.error("Error checking if artist is responsible:", err);
      return false;
    }
  }
}

export const activitySchedulingService = new ActivitySchedulingService();