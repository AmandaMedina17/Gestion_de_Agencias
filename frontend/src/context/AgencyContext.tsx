import React, { createContext, useContext, useState, ReactNode } from 'react';
import { agencyService } from '../services/AgencyService';
import { CreateAgencyDto } from '../../../backend/src/ApplicationLayer/DTOs/agencyDto/create-agency.dto';
import { AgencyResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto';
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { ApprenticeResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto';
import { CreateArtistAgencyDto } from '../../../backend/src/ApplicationLayer/DTOs/artist_agencyDto/create-artist-agency.dto';
import { GroupResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto';

interface ArtistWithGroup {
  id:string;
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

  // Acciones
  createAgency: (createDto: CreateAgencyDto) => Promise<void>;
  fetchAgencies: () => Promise<void>;
  fetchAgency: (id: string) => Promise<AgencyResponseDto | null>;
  deleteAgency: (id: string) => Promise<void>;
  updateAgency: (id: string, updateData: { place: string, nameAgency: string, dateFundation: Date }) => Promise<void>;
  fetchAgencyArtists: (agencyId: string) => Promise<void>;
  fetchAgencyApprentices: (agencyId: string) => Promise<void>;
  fetchArtistsWithGroup: (agencyId: string) => Promise<any[]>;
  addArtistToAgency: (agencyId: string, createArtistAgencyDto: CreateArtistAgencyDto) => Promise<void>;
  clearError: () => void;
  fetchAllArtists: () => Promise<ArtistResponseDto[]>;
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

  const updateAgency = async (id: string, updateData: { place: string, nameAgency: string, dateFundation: Date }) => {
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

  const fetchAgencyArtists = async (agencyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const artistsData = await agencyService.getAgencyArtists(agencyId);
      setArtists(artistsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar artistas de la agencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistsWithGroup = async (agencyId: string) => {
  setLoading(true);
  setError(null);
  try {
    const response = await agencyService.getActiveArtistsWithGroup(agencyId);
    
    console.log('=== CONTEXTO: Respuesta del servicio ===');
    console.log('Respuesta completa:', response);
    console.log('Tipo:', typeof response);
    console.log('Es array?', Array.isArray(response));
    
    let processedData: any[] = [];
    
    // Caso más común: respuesta directa del backend
    if (Array.isArray(response)) {
      console.log('Procesando array de respuesta');
      console.log(response);
      processedData = response.map((item: any, index: number) => {
        // Si el item tiene la estructura completa
          return {
            id: item.artist.id || `artist-${index}`,
            artist: item.artist,
            group: item.group
          };
        
        
      });
    }
    // Caso: objeto con keys y values
    else if (response && response.keys && response.values) {
      console.log('Procesando estructura keys/values');
      processedData = response.keys.map((artist: any, index: number) => ({
        id: artist.id || `key-${index}`,
        artist: artist,
        group: response.values[index] || null
      }));
    }
    // Caso: objeto simple
    else if (response && typeof response === 'object') {
      console.log('Procesando objeto simple');
      // Intentar extraer datos de diferentes maneras
      const data = response.data || response.artists || [response];
      if (Array.isArray(data)) {
        processedData = data.map((item: any, index: number) => ({
          id: item.id || `obj-${index}`,
          artist: item,
          group: null
        }));
      }
    }
    
    console.log('=== DATOS PROCESADOS ===');
    console.log('Cantidad:', processedData.length);
    console.log('Primeros 3:', processedData.slice(0, 3));
    
    setArtistsWithGroup(processedData);
    
    // Devolver los datos procesados
    return processedData;
    
  } catch (err: any) {
    console.error('Error en fetchArtistsWithGroup:', err);
    setError(err.message || 'Error al cargar artistas con grupos');
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
    // Preparar el DTO para enviar
    const dtoToSend: any = {
      artistid: createArtistAgencyDto.artistid,
      startDate: createArtistAgencyDto.startDate,
    };

    // Solo agregar endDate si es una instancia válida de Date
    if (createArtistAgencyDto.endDate instanceof Date && !isNaN(createArtistAgencyDto.endDate.getTime())) {
      dtoToSend.endDate = createArtistAgencyDto.endDate;
    }
    // Si endDate es una cadena vacía o undefined, no lo incluimos
    // Esto asegura que el backend reciba undefined cuando no hay fecha de fin

    console.log('Enviando DTO al servicio:', dtoToSend);
    
    await agencyService.addArtistToAgency(agencyId, dtoToSend);
    
    // Actualizar la lista de artistas con grupos
    await fetchArtistsWithGroup(agencyId);
  } catch (err: any) {
    console.error('Error en addArtistToAgency:', err);
    setError(err.message || 'Error al agregar artista a la agencia');
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
      fetchAllArtists,
      clearError,
    }}>
      {children}
    </AgencyContext.Provider>
  );
};