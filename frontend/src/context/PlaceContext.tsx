import React, { createContext, useContext, useState, ReactNode } from 'react';
import { placeService } from '../services/PlaceService';
import { PlaceResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/placeDto/response-place.dto';
import { CreatePlaceDto } from '../../../backend/src/ApplicationLayer/DTOs/placeDto/create-place.dto';

interface PlaceContextType {
  // Estado - CORREGIDO: usa "places" en lugar de "responsibles"
  places: PlaceResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createPlace: (createDto: CreatePlaceDto) => Promise<void>;
  fetchPlaces: () => Promise<void>;
  fetchPlace: (id: string) => Promise<PlaceResponseDto | null>;
  deletePlace: (id: string) => Promise<void>;
  updatePlace: (id: string, updateData: { name: string }) => Promise<void>;
  clearError: () => void;
}

interface PlaceProviderProps {
  children: ReactNode;
}

const PlaceContext = createContext<PlaceContextType | undefined>(undefined);

export const usePlace = () => {
  const context = useContext(PlaceContext);
  if (!context) {
    throw new Error('usePlace must be used within a PlaceProvider');
  }
  return context;
};

export const PlaceProvider: React.FC<PlaceProviderProps> = ({ children }) => {
  // CORREGIDO: usa "places" y "setPlaces"
  const [places, setPlaces] = useState<PlaceResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlace = async (createDto: CreatePlaceDto) => {
    setLoading(true);
    setError(null);
    try {
      const newPlace = await placeService.create(createDto);
      setPlaces(prev => [...prev, newPlace]);
    } catch (err: any) {
      setError(err.message || 'Error al crear lugar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await placeService.findAll();
      setPlaces(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar lugares');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlace = async (id: string): Promise<PlaceResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await placeService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar lugar');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePlace = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await placeService.remove(id);
      setPlaces(prev => prev.filter(place => place.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar lugar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlace = async (id: string, updateData: { name: string }) => {
    setLoading(true);
    setError(null);
    try {
      await placeService.update(id, updateData);
      await fetchPlaces(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el lugar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <PlaceContext.Provider value={{
      places, // CORREGIDO
      loading,
      error,
      createPlace,
      fetchPlaces,
      fetchPlace,
      deletePlace,
      updatePlace,
      clearError,
    }}>
      {children}
    </PlaceContext.Provider>
  );
};