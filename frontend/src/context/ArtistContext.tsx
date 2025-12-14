import React, { createContext, useContext, useState, ReactNode } from 'react';
import { artistService, ArtistDebutHistoryWithActivitiesAndContractsResponseDto } from '../services/ArtistService';
import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { ArtistStatus } from '../../../backend/src/DomainLayer/Enums';

interface ArtistContextType {
  // Estado
  artists: ArtistResponseDto[];
  artistsCompleteInfo: ArtistDebutHistoryWithActivitiesAndContractsResponseDto[]; // Nuevo estado
  loading: boolean;
  error: string | null;
  completeInfoLoading: boolean; // Loading específico para información completa
  completeInfoError: string | null;

  // Acciones
  createArtist: (createDto: CreateArtistDto) => Promise<ArtistResponseDto>;
  fetchArtists: () => Promise<void>;
  fetchArtist: (id: string) => Promise<ArtistResponseDto | null>;
  deleteArtist: (id: string) => Promise<void>;
  updateArtist: (id: string, updateData: { transitionDate:Date, status: ArtistStatus, stageName: string, birthday: Date, groupId: string, apprenticeId : string}) => Promise<void>;
  
  // Nueva acción para obtener información completa
  fetchArtistsCompleteInfo: (agencyId: string) => Promise<void>;
  clearError: () => void;
  clearCompleteInfoError: () => void;
}

const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

export const useArtist = () => {
  const context = useContext(ArtistContext);
  if (!context) {
    throw new Error('useArtist must be used within a ArtistProvider');
  }
  return context;
};

export const ArtistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artists, setArtists] = useState<ArtistResponseDto[]>([]);
  const [artistsCompleteInfo, setArtistsCompleteInfo] = useState<ArtistDebutHistoryWithActivitiesAndContractsResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completeInfoLoading, setCompleteInfoLoading] = useState(false);
  const [completeInfoError, setCompleteInfoError] = useState<string | null>(null);

  const createArtist = async (createDto: CreateArtistDto) : Promise<ArtistResponseDto>=> {
    setLoading(true);
    setError(null);
    try {
      const newArtist = await artistService.create(createDto);
      setArtists(prev => [...prev, newArtist]);
      return newArtist;
    } catch (err: any) {
      setError(err.message || 'Error al crear artista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.findAll();
      setArtists(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar artistas');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtist = async (id: string): Promise<ArtistResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await artistService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar artista');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteArtist = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await artistService.remove(id);
      setArtists(prev => prev.filter(artist => artist.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar artista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateArtist = async (id: string, updateData: {transitionDate:Date, status: ArtistStatus, stageName: string, birthday: Date, groupId: string, apprenticeId: string }) => {
    setLoading(true);
    setError(null);
    try {
      await artistService.update(id, updateData);
      await fetchArtists(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el artista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para obtener información completa de artistas
  const fetchArtistsCompleteInfo = async (agencyId: string) => {
    setCompleteInfoLoading(true);
    setCompleteInfoError(null);
    try {
      const data = await artistService.getArtistsWithAgencyChangesAndGroups(agencyId);
      setArtistsCompleteInfo(data);
    } catch (err: any) {
      setCompleteInfoError(err.message || 'Error al cargar información completa de artistas');
      throw err;
    } finally {
      setCompleteInfoLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearCompleteInfoError = () => {
    setCompleteInfoError(null);
  };

  return (
    <ArtistContext.Provider value={{
      artists,
      artistsCompleteInfo,
      loading,
      error,
      completeInfoLoading,
      completeInfoError,
      createArtist,
      fetchArtists,
      fetchArtist,
      deleteArtist,
      updateArtist,
      fetchArtistsCompleteInfo,
      clearError,
      clearCompleteInfoError,
    }}>
      {children}
    </ArtistContext.Provider>
  );
};