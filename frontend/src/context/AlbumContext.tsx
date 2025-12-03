import React, { createContext, useContext, useState, ReactNode } from 'react';
import { albumService } from '../services/AlbumService';
import { CreateAlbumDto } from '../../../backend/src/ApplicationLayer/DTOs/albumDto/create.album.dto';
import { ResponseAlbumDto } from '../../../backend/src/ApplicationLayer/DTOs/albumDto/response.album.dto';

interface AlbumContextType {
  // Estado
  albums: ResponseAlbumDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createAlbum: (createDto: CreateAlbumDto) => Promise<void>;
  fetchAlbums: () => Promise<void>;
  fetchAlbum: (id: string) => Promise<ResponseAlbumDto | null>;
  deleteAlbum: (id: string) => Promise<void>;
  updateAlbum: (id: string, updateData: { 
    title: string; 
    releaseDate?: Date; 
    mainProducer: string;
    copiesSold: number;
  }) => Promise<void>;
  clearError: () => void;
}

interface AlbumProviderProps {
  children: ReactNode;
}

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

export const useAlbum = () => {
  const context = useContext(AlbumContext);
  if (!context) {
    throw new Error('useAlbum must be used within an AlbumProvider');
  }
  return context;
};

export const AlbumProvider: React.FC<AlbumProviderProps> = ({ children }) => {
  const [albums, setAlbums] = useState<ResponseAlbumDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAlbum = async (createDto: CreateAlbumDto) => {
    setLoading(true);
    setError(null);
    try {
      const newAlbum = await albumService.create(createDto);
      setAlbums(prev => [...prev, newAlbum]);
    } catch (err: any) {
      setError(err.message || 'Error al crear álbum');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await albumService.findAll();
      setAlbums(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar álbumes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbum = async (id: string): Promise<ResponseAlbumDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await albumService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar álbum');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await albumService.remove(id);
      setAlbums(prev => prev.filter(album => album.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar álbum');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAlbum = async (id: string, updateData: { 
    title: string; 
    releaseDate?: Date; 
    mainProducer: string;
    copiesSold: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await albumService.update(id, updateData);
      await fetchAlbums(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el álbum');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AlbumContext.Provider value={{
      albums,
      loading,
      error,
      createAlbum,
      fetchAlbums,
      fetchAlbum,
      deleteAlbum,
      updateAlbum,
      clearError,
    }}>
      {children}
    </AlbumContext.Provider>
  );
};