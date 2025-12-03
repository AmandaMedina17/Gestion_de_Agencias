import React, { createContext, useContext, useState, ReactNode } from 'react';
import { songService } from '../services/SongService';
import { CreateSongDto } from '../../../backend/src/ApplicationLayer/DTOs/songDto/create.song.dto';
import { ResponseSongDto } from '../../../backend/src/ApplicationLayer/DTOs/songDto/response.song.dto';

interface SongContextType {
  // Estado
  songs: ResponseSongDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createSong: (createDto: CreateSongDto) => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchSong: (id: string) => Promise<ResponseSongDto | null>;
  deleteSong: (id: string) => Promise<void>;
  updateSong: (id: string, updateData: { 
    nameSong: string; 
    idAlbum: string;
    releaseDate?: Date;
  }) => Promise<void>;
  clearError: () => void;
}

interface SongProviderProps {
  children: ReactNode;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useSong must be used within a SongProvider');
  }
  return context;
};

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<ResponseSongDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSong = async (createDto: CreateSongDto) => {
    setLoading(true);
    setError(null);
    try {
      const newSong = await songService.create(createDto);
      setSongs(prev => [...prev, newSong]);
    } catch (err: any) {
      setError(err.message || 'Error al crear canción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchSongs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await songService.findAll();
      setSongs(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar canciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchSong = async (id: string): Promise<ResponseSongDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await songService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar canción');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await songService.remove(id);
      setSongs(prev => prev.filter(song => song.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar canción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSong = async (id: string, updateData: { 
    nameSong: string; 
    idAlbum: string;
    releaseDate?: Date;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await songService.update(id, updateData);
      await fetchSongs(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la canción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <SongContext.Provider value={{
      songs,
      loading,
      error,
      createSong,
      fetchSongs,
      fetchSong,
      deleteSong,
      updateSong,
      clearError,
    }}>
      {children}
    </SongContext.Provider>
  );
};