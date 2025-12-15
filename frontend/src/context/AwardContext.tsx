// src/context/AwardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { awardService } from '../services/AwardService';
import { CreateAwardDto } from '../../../backend/src/ApplicationLayer/DTOs/AwardDto/create.award.dto';
import { ResponseAwardDto } from '../../../backend/src/ApplicationLayer/DTOs/AwardDto/response.award.dto';

interface AwardContextType {
  // Estado
  awards: ResponseAwardDto[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  createAward: (createDto: CreateAwardDto) => Promise<void>;
  fetchAwards: () => Promise<void>;
  fetchAward: (id: string) => Promise<ResponseAwardDto | null>;
  deleteAward: (id: string) => Promise<void>;
  updateAward: (id: string, updateData: { 
    name: string, 
    date: Date, 
    albumId?: string 
  }) => Promise<void>;
  assignAwardToAlbum: (awardId: string, albumId: string) => Promise<void>; // NUEVA FUNCIÓN
  clearError: () => void;
  getAwardsByAlbumId: (albumId: string) => ResponseAwardDto[];
}

interface AwardProviderProps {
  children: ReactNode;
}

const AwardContext = createContext<AwardContextType | undefined>(undefined);

export const useAward = () => {
  const context = useContext(AwardContext);
  if (!context) {
    throw new Error('useAward must be used within a AwardProvider');
  }
  return context;
};

export const AwardProvider: React.FC<AwardProviderProps> = ({ children }) => {
  const [awards, setAwards] = useState<ResponseAwardDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAward = async (createDto: CreateAwardDto) => {
    setLoading(true);
    setError(null);
    try {
      const newAward = await awardService.create(createDto);
      setAwards(prev => [...prev, newAward]);
    } catch (err: any) {
      setError(err.message || 'Error al crear premio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAwards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await awardService.findAll();
      setAwards(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar premios');
    } finally {
      setLoading(false);
    }
  };

  const fetchAward = async (id: string): Promise<ResponseAwardDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await awardService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar premio');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAward = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await awardService.remove(id);
      setAwards(prev => prev.filter(award => award.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar premio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAward = async (
    id: string, 
    updateData: { name: string, date: Date, albumId?: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      await awardService.update(id, updateData);
      await fetchAwards(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el premio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // NUEVA FUNCIÓN: Asignar premio a álbum
  const assignAwardToAlbum = async (awardId: string, albumId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Usar el método específico del servicio
      const updatedAward = await awardService.assignAwardToAlbum(awardId, albumId);
      
      // Actualizar el estado local
      setAwards(prev => prev.map(award => 
        award.id === awardId ? updatedAward : award
      ));
    } catch (err: any) {
      setError(err.message || 'Error al asignar premio al álbum');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAwardsByAlbumId = (albumId: string): ResponseAwardDto[] => {
    return awards.filter(award => award.album?.id === albumId);
  };

  const clearError = () => setError(null);

  return (
    <AwardContext.Provider value={{
      awards,
      loading,
      error,
      createAward,
      fetchAwards,
      fetchAward,
      deleteAward,
      updateAward,
      assignAwardToAlbum, // Exportar la nueva función
      getAwardsByAlbumId,
      clearError,
    }}>
      {children}
    </AwardContext.Provider>
  );
};