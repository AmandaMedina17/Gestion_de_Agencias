// context/CollaborationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { collaborationService } from '../services/CollaborationService';
import { CreateArtistCollaborationDto } from '../../../backend/src/ApplicationLayer/DTOs/artistCollaborationsDto/create-artist-collaboration.dto';
import { CreateArtistGroupCollaborationDto } from '../../../backend/src/ApplicationLayer/DTOs/artist_groupCollaborationDto/create-artist-group-collaboration.dto';
import { ArtistCollaborationResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistCollaborationsDto/response-artist-collaboration.dto';
import { ArtistGroupCollaborationResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artist_groupCollaborationDto/response-artist-group-collaboration.dto';

interface CollaborationContextType {
  // Estado
  artistCollaborations: ArtistCollaborationResponseDto[];
  artistGroupCollaborations: ArtistGroupCollaborationResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createArtistCollaboration: (createDto: CreateArtistCollaborationDto) => Promise<ArtistCollaborationResponseDto>;
  createArtistGroupCollaboration: (createDto: CreateArtistGroupCollaborationDto) => Promise<ArtistGroupCollaborationResponseDto>;
  fetchArtistCollaborations: (agencyId: string) => Promise<void>;
  fetchArtistGroupCollaborations: (agencyId: string) => Promise<void>;
  updateArtistCollaboration: (
    artist1Id: string, 
    artist2Id: string, 
    date: Date, 
    updateDto: CreateArtistCollaborationDto
  ) => Promise<ArtistCollaborationResponseDto>;
  updateArtistGroupCollaboration: (
    artistId: string, 
    groupId: string, 
    date: Date,
    updateDto: CreateArtistGroupCollaborationDto
  ) => Promise<ArtistGroupCollaborationResponseDto>;
  deleteArtistCollaboration: (artist1Id: string, artist2Id: string, date: Date) => Promise<void>;
  deleteArtistGroupCollaboration: (artistId: string, groupId: string, date: Date) => Promise<void>;
  clearError: () => void;
}

interface CollaborationProviderProps {
  children: ReactNode;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ children }) => {
  const [artistCollaborations, setArtistCollaborations] = useState<ArtistCollaborationResponseDto[]>([]);
  const [artistGroupCollaborations, setArtistGroupCollaborations] = useState<ArtistGroupCollaborationResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArtistCollaboration = async (createDto: CreateArtistCollaborationDto): Promise<ArtistCollaborationResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const newCollaboration = await collaborationService.createArtistCollaboration(createDto);
      setArtistCollaborations(prev => [...prev, newCollaboration]);
      return newCollaboration;
    } catch (err: any) {
      setError(err.message || 'Error al crear colaboración entre artistas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createArtistGroupCollaboration = async (createDto: CreateArtistGroupCollaborationDto): Promise<ArtistGroupCollaborationResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const newCollaboration = await collaborationService.createArtistGroupCollaboration(createDto);
      setArtistGroupCollaborations(prev => [...prev, newCollaboration]);
      return newCollaboration;
    } catch (err: any) {
      setError(err.message || 'Error al crear colaboración entre artista y grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistCollaborations = async (agencyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await collaborationService.getArtistCollaborationsByAgency(agencyId);
      setArtistCollaborations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar colaboraciones entre artistas');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistGroupCollaborations = async (agencyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await collaborationService.getArtistGroupCollaborationsByAgency(agencyId);
      setArtistGroupCollaborations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar colaboraciones entre artista y grupo');
    } finally {
      setLoading(false);
    }
  };

  const updateArtistCollaboration = async (
    artist1Id: string, 
    artist2Id: string, 
    date: Date, 
    updateDto: CreateArtistCollaborationDto
  ): Promise<ArtistCollaborationResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const updatedCollaboration = await collaborationService.updateArtistCollaboration(
        artist1Id, 
        artist2Id, 
        date, 
        updateDto
      );
      
      // Actualizar en el estado
      setArtistCollaborations(prev => prev.map(collab => {
        if (
          ((collab.artist1.id === artist1Id && collab.artist2.id === artist2Id) ||
           (collab.artist1.id === artist2Id && collab.artist2.id === artist1Id)) &&
          new Date(collab.date).getTime() === new Date(date).getTime()
        ) {
          return updatedCollaboration;
        }
        return collab;
      }));
      
      return updatedCollaboration;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar colaboración entre artistas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateArtistGroupCollaboration = async (
    artistId: string, 
    groupId: string, 
    date: Date,
    updateDto: CreateArtistGroupCollaborationDto
  ): Promise<ArtistGroupCollaborationResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const updatedCollaboration = await collaborationService.updateArtistGroupCollaboration(
        artistId, 
        groupId, 
        date,
        updateDto
      );
      
      // Actualizar en el estado
      setArtistGroupCollaborations(prev => prev.map(collab => {
        if (
          collab.artist.id === artistId && 
          collab.group.id === groupId &&
          new Date(collab.date).getTime() === new Date(date).getTime()
        ) {
          return updatedCollaboration;
        }
        return collab;
      }));
      
      return updatedCollaboration;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar colaboración entre artista y grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteArtistCollaboration = async (artist1Id: string, artist2Id: string, date: Date) => {
    setLoading(true);
    setError(null);
    try {
      await collaborationService.deleteArtistCollaboration(artist1Id, artist2Id, date);
      
      // Eliminar del estado
      setArtistCollaborations(prev => prev.filter(collab => 
        !((collab.artist1.id === artist1Id && collab.artist2.id === artist2Id && 
           new Date(collab.date).getTime() === new Date(date).getTime()) ||
          (collab.artist1.id === artist2Id && collab.artist2.id === artist1Id && 
           new Date(collab.date).getTime() === new Date(date).getTime()))
      ));
      
    } catch (err: any) {
      setError(err.message || 'Error al eliminar colaboración entre artistas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteArtistGroupCollaboration = async (artistId: string, groupId: string, date: Date) => {
    setLoading(true);
    setError(null);
    try {
      await collaborationService.deleteArtistGroupCollaboration(artistId, groupId, date);
      
      // Eliminar del estado
      setArtistGroupCollaborations(prev => prev.filter(collab => 
        !(collab.artist.id === artistId && 
          collab.group.id === groupId &&
          new Date(collab.date).getTime() === new Date(date).getTime())
      ));
      
    } catch (err: any) {
      setError(err.message || 'Error al eliminar colaboración entre artista y grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <CollaborationContext.Provider value={{
      artistCollaborations,
      artistGroupCollaborations,
      loading,
      error,
      createArtistCollaboration,
      createArtistGroupCollaboration,
      fetchArtistCollaborations,
      fetchArtistGroupCollaborations,
      updateArtistCollaboration,
      updateArtistGroupCollaboration,
      deleteArtistCollaboration,
      deleteArtistGroupCollaboration,
      clearError,
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};