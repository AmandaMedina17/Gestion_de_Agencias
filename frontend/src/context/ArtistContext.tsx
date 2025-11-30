import React, { createContext, useContext, useState, ReactNode } from 'react';
import { artistService } from '../services/ArtistService';
import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { ArtistStatus } from '../../../backend/src/DomainLayer/Enums';

interface ArtistContextType {
  // Estado
  artists: ArtistResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createArtist: (createDto: CreateArtistDto) => Promise<void>;
  fetchArtists: () => Promise<void>;
  fetchArtist: (id: string) => Promise<ArtistResponseDto | null>;
  deleteArtist: (id: string) => Promise<void>;
  updateArtist: (id: string, updateData: { transitionDate:Date, status: ArtistStatus, stageName: string, birthday: Date, groupId: string, apprenticeId : string}) => Promise<void>;
  clearError: () => void;
}

interface ArtistProviderProps {
  children: ReactNode;
}

const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

export const useArtist = () => {
  const context = useContext(ArtistContext);
  if (!context) {
    throw new Error('useArtist must be used within a ArtistProvider');
  }
  return context;
};

export const ArtistProvider: React.FC<ArtistProviderProps> = ({ children }) => {
  const [artists, setArtists] = useState<ArtistResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArtist = async (createDto: CreateArtistDto) => {
    setLoading(true);
    setError(null);
    try {
      const newArtist = await artistService.create(createDto);
      setArtists(prev => [...prev, newArtist]);
    } catch (err: any) {
      setError(err.message || 'Error al crear aprendiz');
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
      setError(err.message || 'Error al cargar aprendiz');
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
      setError(err.message || 'Error al cargar aprendiz');
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
      setArtists(prev => prev.filter(resp => resp.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar aprendiz');
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
      setError(err.message || 'Error al actualizar el aprendiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ArtistContext.Provider value={{
      artists,
      loading,
      error,
      createArtist,
      fetchArtists,
      fetchArtist,
      deleteArtist,
      updateArtist,
      clearError,
    }}>
      {children}
    </ArtistContext.Provider>
  );
}; 