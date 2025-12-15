import React, { createContext, useContext, useState, ReactNode } from 'react';
import { artistService, ArtistDebutHistoryWithActivitiesAndContractsResponseDto } from '../services/ArtistService';
import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { ArtistStatus } from '../../../backend/src/DomainLayer/Enums';
import { ProfessionalHistoryResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/professional_historyDto/response-professional-history.dto';

interface ArtistContextType {
  // Estado básico
  artists: ArtistResponseDto[];
  artistsCompleteInfo: ArtistDebutHistoryWithActivitiesAndContractsResponseDto[];
  loading: boolean;
  error: string | null;
  completeInfoLoading: boolean;
  completeInfoError: string | null;
  
  // Historial profesional
  professionalHistory: ProfessionalHistoryResponseDto | null;
  professionalHistoryLoading: boolean;
  professionalHistoryError: string | null;
  
  // Grupos del artista
  artistGroups: any[];
  artistGroupsLoading: boolean;
  artistGroupsError: string | null;
  
  // Colaboraciones
  artistCollaborations: any;
  artistGroupCollaborations: any;
  collaborationsLoading: boolean;
  collaborationsError: string | null;

  // Acciones básicas
  createArtist: (createDto: CreateArtistDto) => Promise<ArtistResponseDto>;
  fetchArtists: () => Promise<void>;
  fetchArtist: (id: string) => Promise<ArtistResponseDto | null>;
  deleteArtist: (id: string) => Promise<void>;
  updateArtist: (id: string, updateData: { transitionDate:Date, status: ArtistStatus, stageName: string, birthday: Date, groupId: string, apprenticeId : string}) => Promise<void>;
  
  // Acciones para información completa
  fetchArtistsCompleteInfo: (agencyId: string) => Promise<void>;
  fetchProfessionalHistory: (artistId: string) => Promise<void>;
  fetchArtistGroups: (artistId: string) => Promise<void>;
  fetchArtistCollaborations: (artistId: string) => Promise<void>;
  
  // Limpieza de errores
  clearError: () => void;
  clearCompleteInfoError: () => void;
  clearProfessionalHistoryError: () => void;
  clearArtistGroupsError: () => void;
  clearCollaborationsError: () => void;
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
  const [professionalHistory, setProfessionalHistory] = useState<ProfessionalHistoryResponseDto | null>(null);
  const [artistGroups, setArtistGroups] = useState<any[]>([]);
  const [artistCollaborations, setArtistCollaborations] = useState<any>(null);
  const [artistGroupCollaborations, setArtistGroupCollaborations] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completeInfoLoading, setCompleteInfoLoading] = useState(false);
  const [completeInfoError, setCompleteInfoError] = useState<string | null>(null);
  const [professionalHistoryLoading, setProfessionalHistoryLoading] = useState(false);
  const [professionalHistoryError, setProfessionalHistoryError] = useState<string | null>(null);
  const [artistGroupsLoading, setArtistGroupsLoading] = useState(false);
  const [artistGroupsError, setArtistGroupsError] = useState<string | null>(null);
  const [collaborationsLoading, setCollaborationsLoading] = useState(false);
  const [collaborationsError, setCollaborationsError] = useState<string | null>(null);

  const createArtist = async (createDto: CreateArtistDto): Promise<ArtistResponseDto> => {
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
      await fetchArtists();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el artista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

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

  const fetchProfessionalHistory = async (artistId: string) => {
    setProfessionalHistoryLoading(true);
    setProfessionalHistoryError(null);
    try {
      const data = await artistService.getProfessionalHistory(artistId);
      setProfessionalHistory(data);
    } catch (err: any) {
      setProfessionalHistoryError(err.message || 'Error al cargar historial profesional');
      throw err;
    } finally {
      setProfessionalHistoryLoading(false);
    }
  };

  const fetchArtistGroups = async (artistId: string) => {
    setArtistGroupsLoading(true);
    setArtistGroupsError(null);
    try {
      const data = await artistService.getArtistGroups(artistId);
      setArtistGroups(data);
    } catch (err: any) {
      setArtistGroupsError(err.message || 'Error al cargar grupos del artista');
      throw err;
    } finally {
      setArtistGroupsLoading(false);
    }
  };

  const fetchArtistCollaborations = async (artistId: string) => {
    setCollaborationsLoading(true);
    setCollaborationsError(null);
    try {
      const [artistCollabs, groupCollabs] = await Promise.all([
        artistService.getArtistCollaborations(artistId),
        artistService.getArtistGroupCollaborations(artistId)
      ]);
      setArtistCollaborations(artistCollabs);
      setArtistGroupCollaborations(groupCollabs);
    } catch (err: any) {
      setCollaborationsError(err.message || 'Error al cargar colaboraciones');
      throw err;
    } finally {
      setCollaborationsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearCompleteInfoError = () => setCompleteInfoError(null);
  const clearProfessionalHistoryError = () => setProfessionalHistoryError(null);
  const clearArtistGroupsError = () => setArtistGroupsError(null);
  const clearCollaborationsError = () => setCollaborationsError(null);

  return (
    <ArtistContext.Provider value={{
      // Estado
      artists,
      artistsCompleteInfo,
      professionalHistory,
      artistGroups,
      artistCollaborations,
      artistGroupCollaborations,
      
      // Estados de carga
      loading,
      completeInfoLoading,
      professionalHistoryLoading,
      artistGroupsLoading,
      collaborationsLoading,
      
      // Errores
      error,
      completeInfoError,
      professionalHistoryError,
      artistGroupsError,
      collaborationsError,
      
      // Acciones
      createArtist,
      fetchArtists,
      fetchArtist,
      deleteArtist,
      updateArtist,
      fetchArtistsCompleteInfo,
      fetchProfessionalHistory,
      fetchArtistGroups,
      fetchArtistCollaborations,
      
      // Limpieza de errores
      clearError,
      clearCompleteInfoError,
      clearProfessionalHistoryError,
      clearArtistGroupsError,
      clearCollaborationsError,
    }}>
      {children}
    </ArtistContext.Provider>
  );
};