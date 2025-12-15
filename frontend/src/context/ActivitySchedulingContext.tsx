import React, { createContext, useContext, useState, ReactNode } from 'react';
import { activitySchedulingService } from '../services/ActivitySchedulingService';
import { ScheduleArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/schedule-artistDto/schedule-artist.dto';
import { ScheduleGroupDto } from '../../../backend/src/ApplicationLayer/DTOs/schedule-groupDto/schedule-group.dto';
import { ArtistIncomeDto } from '../../../backend/src/ApplicationLayer/DTOs/schedule-artistDto/artist_income.dto';

interface ActivitySchedulingContextType {
  // Estado
  artistActivities: any[];
  groupActivities: any[];
  artistIncomes: any | null;
  loading: boolean;
  error: string | null;
  confirmLoading: boolean;
  confirmError: string | null;
  incomesLoading: boolean;
  incomesError: string | null;

  // Acciones básicas
  scheduleArtistActivity: (scheduleArtistDto: ScheduleArtistDto) => Promise<void>;
  scheduleGroupActivity: (scheduleGroupDto: ScheduleGroupDto) => Promise<void>;
  getArtistActivities: (artistId: string, startDate?: Date, endDate?: Date) => Promise<any[]>;
  getGroupActivities: (groupId: string, startDate?: Date, endDate?: Date) => Promise<any[]>;
  
  // Acciones adicionales para obtener todas las actividades
  getAllArtistActivities: (artistId: string) => Promise<any[]>;
  getAllGroupActivities: (groupId: string) => Promise<any[]>;
  
  // Confirmar asistencia
  confirmAttendance: (artistId: string, activityId: string, confirm: boolean, reason?: string) => Promise<void>;
  verifyArtistScheduled: (artistId: string, activityId: string) => Promise<boolean>;
  
  // Nueva acción: Calcular ingresos del artista
  calculateArtistIncomes: (artistIncomeDto: ArtistIncomeDto) => Promise<any>;
  
  // Limpiar errores
  clearError: () => void;
  clearConfirmError: () => void;
  clearIncomesError: () => void;
  clearArtistIncomes: () => void;
}

interface ActivitySchedulingProviderProps {
  children: ReactNode;
}

const ActivitySchedulingContext = createContext<ActivitySchedulingContextType | undefined>(undefined);

export const useActivityScheduling = () => {
  const context = useContext(ActivitySchedulingContext);
  if (!context) {
    throw new Error('useActivityScheduling must be used within an ActivitySchedulingProvider');
  }
  return context;
};

export const ActivitySchedulingProvider: React.FC<ActivitySchedulingProviderProps> = ({ children }) => {
  const [artistActivities, setArtistActivities] = useState<any[]>([]);
  const [groupActivities, setGroupActivities] = useState<any[]>([]);
  const [artistIncomes, setArtistIncomes] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [incomesLoading, setIncomesLoading] = useState(false);
  const [incomesError, setIncomesError] = useState<string | null>(null);

  const scheduleArtistActivity = async (scheduleArtistDto: ScheduleArtistDto) => {
    setLoading(true);
    setError(null);
    try {
      await activitySchedulingService.scheduleArtist(scheduleArtistDto);
    } catch (err: any) {
      setError(err.message || 'Error al programar actividad para el artista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const scheduleGroupActivity = async (scheduleGroupDto: ScheduleGroupDto) => {
    setLoading(true);
    setError(null);
    try {
      await activitySchedulingService.scheduleGroup(scheduleGroupDto);
    } catch (err: any) {
      setError(err.message || 'Error al programar actividad para el grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getArtistActivities = async (artistId: string, startDate?: Date, endDate?: Date): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const activities = await activitySchedulingService.getArtistActivities(artistId);
      setArtistActivities(activities);
      return activities;
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividades del artista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getGroupActivities = async (groupId: string, startDate?: Date, endDate?: Date): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const activities = await activitySchedulingService.getGroupActivities(groupId, startDate, endDate);
      setGroupActivities(activities);
      return activities;
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividades del grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllArtistActivities = async (artistId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const activities = await activitySchedulingService.getArtistActivities(artistId);
      setArtistActivities(activities);
      return activities;
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividades del artista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllGroupActivities = async (groupId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const activities = await activitySchedulingService.getAllGroupActivities(groupId);
      setGroupActivities(activities);
      return activities;
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividades del grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyArtistScheduled = async (artistId: string, activityId: string): Promise<boolean> => {
    try {
      if (activitySchedulingService.verifyArtistScheduled) {
        return await activitySchedulingService.verifyArtistScheduled(artistId, activityId);
      }
      
      const activities = await getArtistActivities(artistId);
      const activity = activities.find((a: any) => 
        a.id === activityId || a.activityId === activityId
      );
      
      return !!activity;
    } catch (err) {
      console.error("Error verifying schedule:", err);
      return false;
    }
  };

  const confirmAttendance = async (artistId: string, activityId: string, confirm: boolean, reason?: string) => {
    setConfirmLoading(true);
    setConfirmError(null);
    try {
      const result = await activitySchedulingService.confirmAttendance(artistId, activityId, confirm, reason);
      
      // Actualizar la actividad localmente después de la confirmación
      setArtistActivities(prev => 
        prev.map(activity => {
          if (activity.id === activityId) {
            return {
              ...activity,
              attendanceConfirmed: confirm,
              attendanceStatus: confirm ? 'CONFIRMED' : 'DENIED',
              confirmationDate: new Date().toISOString(),
            };
          }
          return activity;
        })
      );
      
      return result;
    } catch (err: any) {
      setConfirmError(err.message || 'Error al confirmar asistencia');
      throw err;
    } finally {
      setConfirmLoading(false);
    }
  };

  const calculateArtistIncomes = async (artistIncomeDto: ArtistIncomeDto): Promise<any> => {
  setIncomesLoading(true);
  setIncomesError(null);
  try {
    console.log("Calculando ingresos para:", artistIncomeDto);
    const incomes = await activitySchedulingService.getArtistIncomes(artistIncomeDto);
    setArtistIncomes(incomes);
    return incomes;
  } catch (err: any) {
    console.error("Error calculando ingresos:", err);
    setIncomesError(err.message || 'Error al calcular los ingresos del artista');
    throw err;
  } finally {
    setIncomesLoading(false);
  }
};

  const clearError = () => {
    setError(null);
  };

  const clearConfirmError = () => {
    setConfirmError(null);
  };

  const clearIncomesError = () => {
    setIncomesError(null);
  };

  const clearArtistIncomes = () => {
    setArtistIncomes(null);
  };

  return (
    <ActivitySchedulingContext.Provider value={{
      artistActivities,
      groupActivities,
      artistIncomes,
      loading,
      error,
      confirmLoading,
      confirmError,
      incomesLoading,
      incomesError,
      scheduleArtistActivity,
      scheduleGroupActivity,
      getArtistActivities,
      getGroupActivities,
      getAllArtistActivities,
      getAllGroupActivities,
      confirmAttendance,
      verifyArtistScheduled,
      calculateArtistIncomes,
      clearError,
      clearConfirmError,
      clearIncomesError,
      clearArtistIncomes,
    }}>
      {children}
    </ActivitySchedulingContext.Provider>
  );
};