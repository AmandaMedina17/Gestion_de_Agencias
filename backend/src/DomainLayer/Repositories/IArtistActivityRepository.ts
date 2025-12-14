import { Activity } from "@domain/Entities/Activity";
import { Income } from "@domain/Entities/Income";

export abstract class IArtistActivityRepository {
  
  // Programar artista a actividad
  abstract scheduleArtist(artistId: string, activityId: string): Promise<void>;
  
  // Verificar si ya está programado
  abstract isArtistScheduled(artistId: string, activityId: string): Promise<boolean>;
  
  // Verificar conflictos de horario
  abstract checkScheduleConflicts(artistId: string, activityId: string): Promise<Activity[]>;
  
  // Obtener actividades de un artista
  abstract getActivitiesByArtist(artistId: string): Promise<Activity[]>;
  
  // Confirmar asistencia
  abstract confirmAttendance(artistId: string, activityId: string): Promise<void>;
  
  // Cancelar asistencia
  abstract cancelAttendance(artistId: string, activityId: string): Promise<void>;

  // Calcular los ingresos de un artista
  abstract calculateArtistIncomes(artistId: string, startDate?: Date, endDate?: Date
    ): Promise<{ incomes: Income[]; totalIncome: number }> 

}