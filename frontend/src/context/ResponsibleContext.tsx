import React, { createContext, useContext, useState, ReactNode } from 'react';
import { responsibleService } from '../services/ResponsibleService';
import { ResponsibleResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/responsibleDto/response-responsible.dto';
import { CreateResponsibleDto } from '../../../backend/src/ApplicationLayer/DTOs/responsibleDto/create-responsible.dto';

interface ResponsibleContextType {
  // Estado
  responsibles: ResponsibleResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createResponsible: (createDto: CreateResponsibleDto) => Promise<void>;
  fetchResponsibles: () => Promise<void>;
  fetchResponsible: (id: string) => Promise<ResponsibleResponseDto | null>;
  deleteResponsible: (id: string) => Promise<void>;
  updateResponsible: (id: string, updateData: { name: string }) => Promise<void>;
  clearError: () => void;
}

interface ResponsibleProviderProps {
  children: ReactNode;
}

const ResponsibleContext = createContext<ResponsibleContextType | undefined>(undefined);

export const useResponsible = () => {
  const context = useContext(ResponsibleContext);
  if (!context) {
    throw new Error('useResponsible must be used within a ResponsibleProvider');
  }
  return context;
};

export const ResponsibleProvider: React.FC<ResponsibleProviderProps> = ({ children }) => {
  const [responsibles, setResponsibles] = useState<ResponsibleResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createResponsible = async (createDto: CreateResponsibleDto) => {
    setLoading(true);
    setError(null);
    try {
      const newResponsible = await responsibleService.create(createDto);
      setResponsibles(prev => [...prev, newResponsible]);
    } catch (err: any) {
      setError(err.message || 'Error al crear responsable');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchResponsibles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await responsibleService.findAll();
      setResponsibles(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar responsables');
    } finally {
      setLoading(false);
    }
  };

  const fetchResponsible = async (id: string): Promise<ResponsibleResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await responsibleService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar responsable');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteResponsible = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await responsibleService.remove(id);
      setResponsibles(prev => prev.filter(resp => resp.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar responsable');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResponsible = async (id: string, updateData: { name: string }) => {
    setLoading(true);
    setError(null);
    try {
      await responsibleService.update(id, updateData);
      await fetchResponsibles(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el responsable');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ResponsibleContext.Provider value={{
      responsibles,
      loading,
      error,
      createResponsible,
      fetchResponsibles,
      fetchResponsible,
      deleteResponsible,
      updateResponsible,
      clearError,
    }}>
      {children}
    </ResponsibleContext.Provider>
  );
}; 