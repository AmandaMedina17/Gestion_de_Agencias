import React, { createContext, useContext, useState, ReactNode } from 'react';
import { activitySchedulingService } from '../services/ActivitySchedulingService';
import { ScheduleArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/schedule-artistDto/schedule-artist.dto';
import { ScheduleGroupDto } from '../../../backend/src/ApplicationLayer/DTOs/schedule-groupDto/schedule-group.dto';
import { ActivityResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/activityDto/response-activity.dto';

interface ActivitySchedulingContextType {
  // Estado
  artistActivities: ActivityResponseDto[];
  groupActivities: ActivityResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  scheduleArtistActivity: (scheduleArtistDto: ScheduleArtistDto) => Promise<void>;
  scheduleGroupActivity: (scheduleGroupDto: ScheduleGroupDto) => Promise<void>;
  getArtistActivities: (artistId: string) => Promise<ActivityResponseDto[]>;
  getGroupActivities: (groupId: string) => Promise<ActivityResponseDto[]>;
  clearError: () => void;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getArtistActivities = async (artistId: string): Promise<any[]> => {
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

  const getGroupActivities = async (groupId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const activities = await activitySchedulingService.getGroupActivities(groupId);
      setGroupActivities(activities);
      return activities;
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividades del grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ActivitySchedulingContext.Provider value={{
      artistActivities,
      groupActivities,
      loading,
      error,
      scheduleArtistActivity,
      scheduleGroupActivity,
      getArtistActivities,
      getGroupActivities,
      clearError,
    }}>
      {children}
    </ActivitySchedulingContext.Provider>
  );
};