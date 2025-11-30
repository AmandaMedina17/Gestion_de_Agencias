import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AgencyService } from '../services/AgencyService'
import { CreateAgencyDto } from '../../../backend/src/ApplicationLayer/DTOs/agencyDto/create-agency.dto';
import { AgencyResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto';

interface AgencyContextType {
  // Estado
  agencies: AgencyResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createAgency: (createDto: CreateAgencyDto) => Promise<void>;
  fetchAgencies: () => Promise<void>;
  fetchAgency: (id: string) => Promise<AgencyResponseDto | null>;
  deleteAgency: (id: string) => Promise<void>;
  updateAgency: (id: string, updateData: { place: string, nameAgency: string, dateFundation: Date }) => Promise<void>;
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
  const [agencies, setAgencies] = useState<AgencyResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAgency = async (createDto: CreateAgencyDto) => {
    setLoading(true);
    setError(null);
    try {
      const newAgency = await AgencyService.create(createDto);
      setAgencies(prev => [...prev, newAgency]);
    } catch (err: any) {
      setError(err.message || 'Error al crear agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AgencyService.findAll();
      setAgencies(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar agencias');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgency = async (id: string): Promise<AgencyResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await AgencyService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar agencia');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAgency = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await AgencyService.remove(id);
      setAgencies(prev => prev.filter(agency => agency.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAgency = async (id: string,  updateData: { place: string, nameAgency: string, dateFundation: Date }) => {
    setLoading(true);
    setError(null);
    try {
      await AgencyService.update(id, updateData);
      await fetchAgencies(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AgencyContext.Provider value={{
      agencies,
      loading,
      error,
      createAgency,
      fetchAgencies,
      fetchAgency,
      deleteAgency,
      updateAgency,
      clearError,
    }}>
      {children}
    </AgencyContext.Provider>
  );
};