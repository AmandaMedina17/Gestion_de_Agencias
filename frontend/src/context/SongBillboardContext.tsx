// src/context/SongBillboardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { songBillboardService } from '../services/SongBillboard';
import { AddSongToBillboardDto } from '../../../backend/src/ApplicationLayer/DTOs/SongBillboardDto/add.sonBillboard.dto';
import { ResponseSongBillboardDto } from '../../../backend/src/ApplicationLayer/DTOs/SongBillboardDto/response.songBillboard.dto';

interface SongBillboardContextType {
  // Estado
  records: ResponseSongBillboardDto[];
  loading: boolean;
  error: string | null;

  // Acciones CRUD con clave compuesta
  addSongToBillboard: (addDto: AddSongToBillboardDto) => Promise<void>;
  fetchRecords: () => Promise<void>;
  fetchRecord: (songId: string, billboardId: string) => Promise<ResponseSongBillboardDto | null>;
  removeSongFromBillboard: (songId: string, billboardId: string) => Promise<void>;
  updateRecord: (songId: string, billboardId: string, updateData: Partial<AddSongToBillboardDto>) => Promise<void>;
  
  // Consultas
  getRecordsBySongId: (songId: string) => ResponseSongBillboardDto[];
  getRecordsByBillboardId: (billboardId: string) => ResponseSongBillboardDto[];
  getTopPositions: (limit: number) => ResponseSongBillboardDto[];
  getRecentEntries: (days: number) => ResponseSongBillboardDto[];
  
  // Utilidades
  clearError: () => void;
}

interface SongBillboardProviderProps {
  children: ReactNode;
}

const SongBillboardContext = createContext<SongBillboardContextType | undefined>(undefined);

export const useSongBillboard = () => {
  const context = useContext(SongBillboardContext);
  if (!context) {
    throw new Error('useSongBillboard must be used within a SongBillboardProvider');
  }
  return context;
};

export const SongBillboardProvider: React.FC<SongBillboardProviderProps> = ({ children }) => {
  const [records, setRecords] = useState<ResponseSongBillboardDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los registros
  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await songBillboardService.findAll();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar registros de billboard');
    } finally {
      setLoading(false);
    }
  };

  // Obtener un registro específico (por clave compuesta)
  const fetchRecord = async (songId: string, billboardId: string): Promise<ResponseSongBillboardDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await songBillboardService.findOne(songId, billboardId);
    } catch (err: any) {
      setError(err.message || 'Error al cargar registro');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Agregar una canción a un billboard
  const addSongToBillboard = async (addDto: AddSongToBillboardDto) => {
    setLoading(true);
    setError(null);
    try {
      const newRecord = await songBillboardService.create(addDto);
      setRecords(prev => [...prev, newRecord]);
    } catch (err: any) {
      setError(err.message || 'Error al agregar canción al billboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una canción de un billboard específico (clave compuesta)
  const removeSongFromBillboard = async (songId: string, billboardId: string) => {
    setLoading(true);
    setError(null);
    try {
      await songBillboardService.remove(songId, billboardId);
      // IMPORTANTE: El campo en ResponseSongBillboardDto es "billBoardId" (con B mayúscula)
      setRecords(prev => prev.filter(record => 
        !(record.songId === songId && record.billBoardId === billboardId)
      ));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar canción del billboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un registro (por clave compuesta)
  const updateRecord = async (songId: string, billboardId: string, updateData: Partial<AddSongToBillboardDto>) => {
    setLoading(true);
    setError(null);
    try {
      await songBillboardService.update(songId, billboardId, updateData);
      // Recargar la lista completa para reflejar cambios
      await fetchRecords();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Consultas
  const getRecordsBySongId = (songId: string): ResponseSongBillboardDto[] => {
    return records.filter(record => record.songId === songId);
  };

  const getRecordsByBillboardId = (billboardId: string): ResponseSongBillboardDto[] => {
    return records.filter(record => record.billBoardId === billboardId);
  };

  const getTopPositions = (limit: number): ResponseSongBillboardDto[] => {
    return records
      .sort((a, b) => a.place - b.place)
      .slice(0, limit);
  };

  const getRecentEntries = (days: number): ResponseSongBillboardDto[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return records.filter(record => {
      const entryDate = new Date(record.date);
      return entryDate >= cutoffDate;
    });
  };

  const clearError = () => setError(null);

  return (
    <SongBillboardContext.Provider value={{
      records,
      loading,
      error,
      addSongToBillboard,
      fetchRecords,
      fetchRecord,
      removeSongFromBillboard,
      updateRecord,
      getRecordsBySongId,
      getRecordsByBillboardId,
      getTopPositions,
      getRecentEntries,
      clearError,
    }}>
      {children}
    </SongBillboardContext.Provider>
  );
};