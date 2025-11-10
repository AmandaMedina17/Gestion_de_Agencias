import React, { createContext, useContext, useState, ReactNode } from 'react';
import { agencyService } from '../services/AgencyService';
import { CreateAgencyDto, AgencyResponseDto } from '../services/dtos/AgencyDto';

interface AgencyContextType {
  // Estado
  Agencys: AgencyResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createAgency: (createDto: CreateAgencyDto) => Promise<void>;
  fetchAgencys: () => Promise<void>;
  fetchAgency: (id: string) => Promise<AgencyResponseDto | null>;
  deleteAgency: (id: string) => Promise<void>;
  clearError: () => void;
}

interface AgencyProviderProps {
  children: ReactNode;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within a AgencyProvider');
  }
  return context;
};

export const AgencyProvider: React.FC<AgencyProviderProps> = ({ children }) => {
  const [Agencys, setAgencys] = useState<AgencyResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAgency = async (createDto: CreateAgencyDto) => {
    setLoading(true);
    setError(null);
    try {
      const newAgency = await agencyService.create(createDto);
      setAgencys(prev => [...prev, newAgency]);
    } catch (err: any) {
      setError(err.message || 'Error al crear responsable');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencys = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agencyService.findAll();
      setAgencys(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar responsables');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgency = async (id: string): Promise<AgencyResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agencyService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar responsable');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAgency = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await agencyService.remove(id);
      setAgencys(prev => prev.filter(resp => resp.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar responsable');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AgencyContext.Provider value={{
      Agencys,
      loading,
      error,
      createAgency,
      fetchAgencys,
      fetchAgency,
      deleteAgency,
      clearError,
    }}>
      {children}
    </AgencyContext.Provider>
  );
};