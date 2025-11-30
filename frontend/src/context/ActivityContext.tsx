import React, { createContext, useContext, useState, ReactNode } from 'react';
import { activityService } from '../services/ActivityService';
import { CreateActivityDto } from '../../../backend/src/ApplicationLayer/DTOs/activityDto/create-activity.dto';
import { ActivityResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/activityDto/response-activity.dto';
import { ActivityClassification, ActivityType } from '../../../backend/src/DomainLayer/Enums';

interface ActivityContextType {
  // Estado
  activities: ActivityResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createActivity: (createDto: CreateActivityDto) => Promise<void>;
  fetchActivities: () => Promise<void>;
  fetchActivity: (id: string) => Promise<ActivityResponseDto | null>;
  deleteActivity: (id: string) => Promise<void>;
  updateActivity: (id: string, updateData: { 
    classification: ActivityClassification;
    type: ActivityType;
    responsibleIds: string[];
    placeIds: string[];
    dates: Date[];
  }) => Promise<void>;
  clearError: () => void;
}

interface ActivityProviderProps {
  children: ReactNode;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<ActivityResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createActivity = async (createDto: CreateActivityDto) => {
    setLoading(true);
    setError(null);
    try {
      const newActivity = await activityService.create(createDto);
      setActivities(prev => [...prev, newActivity]);
    } catch (err: any) {
      setError(err.message || 'Error al crear actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await activityService.findAll();
      setActivities(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async (id: string): Promise<ActivityResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await activityService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividad');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await activityService.remove(id);
      setActivities(prev => prev.filter(activity => activity.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (id: string, updateData: { 
    classification: ActivityClassification;
    type: ActivityType;
    responsibleIds: string[];
    placeIds: string[];
    dates: Date[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      await activityService.update(id, updateData);
      await fetchActivities(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ActivityContext.Provider value={{
      activities,
      loading,
      error,
      createActivity,
      fetchActivities,
      fetchActivity,
      deleteActivity,
      updateActivity,
      clearError,
    }}>
      {children}
    </ActivityContext.Provider>
  );
};