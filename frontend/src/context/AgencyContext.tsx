import React, { createContext, useContext, useState, ReactNode } from 'react';
import { agencyService } from '../services/AgencyService';
import { CreateAgencyDto } from '../../../backend/src/ApplicationLayer/DTOs/agencyDto/create-agency.dto';
import { AgencyResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto';
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { ApprenticeResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto';
import { CreateArtistAgencyDto } from '../../../backend/src/ApplicationLayer/DTOs/artist_agencyDto/create-artist-agency.dto';
import { GroupResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto';
import { CreateEndMembershipDto } from '../../../backend/src/ApplicationLayer/DTOs/endArtistMembership/create-end-artist-membership.dto';

interface ArtistWithGroup {
  id: string;
  artist: ArtistResponseDto;
  group: GroupResponseDto | null;
}

interface AgencyContextType {
  // Estado
  agencies: AgencyResponseDto[];
  artists: ArtistResponseDto[];
  artistsWithGroup: ArtistWithGroup[];
  apprentices: ApprenticeResponseDto[];
  loading: boolean;
  error: string | null;
  artistsWithDebutAndContracts: any[];

  collaborations: {
    artistCollaborations: any[];
    artistGroupCollaborations: any[];
  };

  // Acciones
  createAgency: (createDto: CreateAgencyDto) => Promise<void>;
  fetchAgencies: () => Promise<void>;
  fetchAgency: (id: string) => Promise<AgencyResponseDto | null>;
  deleteAgency: (id: string) => Promise<void>;
  updateAgency: (id: string, updateData: { placeId: string, nameAgency: string, dateFundation: Date }) => Promise<void>;
  fetchAgencyArtists: (agencyId: string) => Promise<ArtistResponseDto[]>;
  fetchAgencyApprentices: (agencyId: string) => Promise<void>;
  fetchArtistsWithGroup: (agencyId: string) => Promise<any[]>;
  addArtistToAgency: (agencyId: string, createArtistAgencyDto: CreateArtistAgencyDto) => Promise<void>;
  endMembership: (createEndMembershipDto: CreateEndMembershipDto) => Promise<void>;
  clearError: () => void;
  fetchAllArtists: () => Promise<ArtistResponseDto[]>;
    fetchAgencyCollaborations: (agencyId: string) => Promise<void>;
    fetchArtistsWithDebutAndContracts: (agencyId: string) => Promise<any[]>;
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
  const [artists, setArtists] = useState<ArtistResponseDto[]>([]);
  const [artistsWithGroup, setArtistsWithGroup] = useState<ArtistWithGroup[]>([]);
  const [apprentices, setApprentices] = useState<ApprenticeResponseDto[]>([]);
  const [allArtists, setAllArtists] = useState<ArtistResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artistsWithDebutAndContracts, setArtistsWithDebutAndContracts] = useState<any[]>([]);

  const createAgency = async (createDto: CreateAgencyDto) => {
    setLoading(true);
    setError(null);
    try {
      const newAgency = await agencyService.create(createDto);
      setAgencies(prev => [...prev, newAgency]);
    } catch (err: any) {
      setError(err.message || 'Error al crear agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const [collaborations, setCollaborations] = useState<{
    artistCollaborations: any[];
    artistGroupCollaborations: any[];
  }>({
    artistCollaborations: [],
    artistGroupCollaborations: []
  });

    const fetchAgencies = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await agencyService.findAll();
          setAgencies(data);
        } catch (err: any) {
          setError(err.message || 'Error al cargar agencias');
        } finally {
          setLoading(false);
        }
      };

    const fetchAgencyCollaborations = async (agencyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const collaborationsData = await agencyService.getAgencyCollaborations(agencyId);
      
      // Función para deduplicar colaboraciones artista-artista
      const deduplicateCollaborations = (collaborations: any[]) => {
        const seen = new Set<string>();
        return collaborations.filter(collab => {
          if (!collab.artist1?.id || !collab.artist2?.id) return true;
          
          // Crear clave única ordenando los IDs
          const sortedIds = [collab.artist1.id, collab.artist2.id].sort().join('-');
          const key = `${sortedIds}-${collab.date}`;
          
          if (seen.has(key)) {
            return false;
          }
          seen.add(key);
          return true;
        });
      };
      
      // Aplicar deduplicación
      const uniqueArtistCollabs = deduplicateCollaborations(collaborationsData.artistCollaborations || []);
      
      setCollaborations({
        artistCollaborations: uniqueArtistCollabs,
        artistGroupCollaborations: collaborationsData.artistGroupCollaborations || []
      });
      
      console.log("Colaboraciones deduplicadas:", {
        original: collaborationsData.artistCollaborations?.length,
        deduplicadas: uniqueArtistCollabs.length
      });
    } catch (err: any) {
      setError(err.message || 'Error al cargar colaboraciones de la agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAgency = async (id: string): Promise<AgencyResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agencyService.findOne(id);
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
      await agencyService.remove(id);
      setAgencies(prev => prev.filter(agency => agency.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAgency = async (id: string, updateData: { placeId: string, nameAgency: string, dateFundation: Date }) => {
    setLoading(true);
    setError(null);
    try {
      await agencyService.update(id, updateData);
      await fetchAgencies();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencyArtists = async (agencyId: string): Promise<ArtistResponseDto[]> => {
    setLoading(true);
    setError(null);
    try {
      const artistsData = await agencyService.getAgencyArtists(agencyId);
      setArtists(artistsData);
      return artistsData;
    } catch (err: any) {
      setError(err.message || 'Error al cargar artistas de la agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistsWithGroup = async (agencyId: string) => {
    try {
      setLoading(true);
      const response = await agencyService.getActiveArtistsWithGroup(agencyId);
      console.log('=== CONTEXTO: Respuesta del servicio ===');
      console.log('Respuesta completa:', response);
      console.log('Tipo:', typeof response);
      console.log('Es array?', Array.isArray(response));

      if (Array.isArray(response)) {
        console.log('Procesando array de respuesta');
        console.log(response);

        const processed = response
          .filter(item => item && item.length >= 2)
          .map((item, index) => {
            if (Array.isArray(item) && item.length === 2) {
              const artist = item[0];
              const group = item[1];
              
              if (!artist) {
                console.warn(`Artista undefined en posición ${index}:`, item);
                return {
                  id: `unknown-${index}`,
                  artist: {},
                  group: group || null
                };
              }
              
              return {
                id: artist.id || `artist-${index}`,
                artist: artist,
                group: group || null
              };
            }
            
            if (item && typeof item === 'object') {
              const artist = item.artist || item;
              const group = item.group || null;
              
              if (!artist) {
                return {
                  id: `unknown-${index}`,
                  artist: {},
                  group: group
                };
              }
              
              return {
                id: artist.id || `artist-${index}`,
                artist: artist,
                group: group
              };
            }
            
            console.warn(`Formato inesperado en posición ${index}:`, item);
            return {
              id: `unknown-${index}`,
              artist: {},
              group: null
            };
          });

        console.log('Artistas procesados:', processed);
        setArtistsWithGroup(processed);
        return processed;
      } else {
        console.error('La respuesta no es un array:', response);
        setArtistsWithGroup([]);
        return [];
      }
    } catch (err) {
      console.error('Error en fetchArtistsWithGroup:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencyApprentices = async (agencyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const apprenticesData = await agencyService.getAgencyApprentices(agencyId);
      setApprentices(apprenticesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar aprendices de la agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addArtistToAgency = async (agencyId: string, createArtistAgencyDto: CreateArtistAgencyDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const dtoToSend: any = {
        artistid: createArtistAgencyDto.artistid,
        startDate: createArtistAgencyDto.startDate,
      };

      if (createArtistAgencyDto.endDate instanceof Date && !isNaN(createArtistAgencyDto.endDate.getTime())) {
        dtoToSend.endDate = createArtistAgencyDto.endDate;
      }

      console.log('Enviando DTO al servicio:', dtoToSend);
      
      await agencyService.addArtistToAgency(agencyId, dtoToSend);
      
      await fetchArtistsWithGroup(agencyId);
    } catch (err: any) {
      console.error('Error en addArtistToAgency:', err);
      setError(err.message || 'Error al agregar artista a la agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // NUEVA FUNCIÓN: Finalizar membresía de un artista
  const endMembership = async (createEndMembershipDto: CreateEndMembershipDto) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Enviando DTO de finalización de membresía:', createEndMembershipDto);
      await agencyService.endMembership(createEndMembershipDto);
      
      // Actualizar la lista de artistas después de finalizar la membresía
      if (createEndMembershipDto.agencyId) {
        await fetchArtistsWithGroup(createEndMembershipDto.agencyId);
      }
      
    } catch (err: any) {
      console.error('Error en endMembership:', err);
      setError(err.message || 'Error al finalizar la membresía del artista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllArtists = async (): Promise<ArtistResponseDto[]> => {
    setLoading(true);
    setError(null);
    try {
      const allArtistsData = await agencyService.getAllArtists();
      setAllArtists(allArtistsData);
      return allArtistsData;
    } catch (err: any) {
      setError(err.message || 'Error al cargar todos los artistas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistsWithDebutAndContracts = async (agencyId: string): Promise<any[]> => {
  setLoading(true);
  setError(null);
  try {
    const data = await agencyService.getArtistsWithDebutAndContracts(agencyId);
    setArtistsWithDebutAndContracts(data);
    return data;
  } catch (err: any) {
    setError(err.message || 'Error al cargar artistas con debut y contratos activos');
    throw err;
  } finally {
    setLoading(false);
  }
};

  const clearError = () => setError(null);

  return (
    <AgencyContext.Provider value={{
      agencies,
      artists,
      artistsWithGroup,
      apprentices,
      loading,
      error,
      createAgency,
      fetchAgencies,
      fetchAgency,
      deleteAgency,
      updateAgency,
      fetchAgencyArtists,
      fetchAgencyApprentices,
      fetchArtistsWithGroup,
      addArtistToAgency,
      endMembership,
      fetchAllArtists,
      clearError,
       collaborations,
    fetchAgencyCollaborations,
     artistsWithDebutAndContracts,
    fetchArtistsWithDebutAndContracts,
    }}>
      {children}
    </AgencyContext.Provider>
  );
};