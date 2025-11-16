import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apprenticeService } from '../services/ApprenticeService';
import { CreateApprenticeDto, ApprenticeResponseDto } from '../services/dtos/ApprenticeDto';
import { ApprenticeStatus, ApprenticeTrainingLevel } from '../../../backend/src/DomainLayer/Enums';

interface ApprenticeContextType {
  // Estado
  apprentices: ApprenticeResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createApprentice: (createDto: CreateApprenticeDto) => Promise<void>;
  fetchApprentices: () => Promise<void>;
  fetchApprentice: (id: string) => Promise<ApprenticeResponseDto | null>;
  deleteApprentice: (id: string) => Promise<void>;
  updateApprentice: (id: string, updateData: { name: string, age:number, status:ApprenticeStatus, trainingLevel:ApprenticeTrainingLevel, entryDate:Date }) => Promise<void>;
  clearError: () => void;
}

interface ApprenticeProviderProps {
  children: ReactNode;
}

const ApprenticeContext = createContext<ApprenticeContextType | undefined>(undefined);

export const useApprentice = () => {
  const context = useContext(ApprenticeContext);
  if (!context) {
    throw new Error('useApprentice must be used within a ApprenticeProvider');
  }
  return context;
};

export const ApprenticeProvider: React.FC<ApprenticeProviderProps> = ({ children }) => {
  const [apprentices, setApprentices] = useState<ApprenticeResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createApprentice = async (createDto: CreateApprenticeDto) => {
    setLoading(true);
    setError(null);
    try {
      const newApprentice = await apprenticeService.create(createDto);
      setApprentices(prev => [...prev, newApprentice]);
    } catch (err: any) {
      setError(err.message || 'Error al crear aprendiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchApprentices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apprenticeService.findAll();
      setApprentices(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar aprendiz');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprentice = async (id: string): Promise<ApprenticeResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await apprenticeService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar aprendiz');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteApprentice = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apprenticeService.remove(id);
      setApprentices(prev => prev.filter(resp => resp.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar aprendiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateApprentice = async (id: string, updateData: { name: string }) => {
    setLoading(true);
    setError(null);
    try {
      await apprenticeService.update(id, updateData);
      await fetchApprentices(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el aprendiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ApprenticeContext.Provider value={{
      apprentices,
      loading,
      error,
      createApprentice,
      fetchApprentices,
      fetchApprentice,
      deleteApprentice,
      updateApprentice,
      clearError,
    }}>
      {children}
    </ApprenticeContext.Provider>
  );
}; 