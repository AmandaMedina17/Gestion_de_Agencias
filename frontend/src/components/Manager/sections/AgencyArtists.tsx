import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAgency } from '../../../context/AgencyContext';
import { agencyService } from '../../../services/AgencyService'; 
import GenericTable from '../../ui/datatable';
import { Column } from '../../ui/datatable';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MicIcon from '@mui/icons-material/Mic';
import CakeIcon from '@mui/icons-material/Cake';
import GroupsIcon from '@mui/icons-material/Groups';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './AgencyApprentices.css';
import AddArtistToAgencyModal from './addArtistToAgencyModal';

interface ArtistWithGroup {
  id: string;
  artist: any;
  group: any | null;
}

const AgencyArtistsView: React.FC = () => {
  const { user } = useAuth();
  const { 
    fetchArtistsWithGroup, 
    fetchAgency,
    addArtistToAgency,
    artistsWithGroup, 
    loading: agencyLoading, 
    error: agencyError, 
    clearError: clearAgencyError 
  } = useAgency();

  const [agencyInfo, setAgencyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [localArtists, setLocalArtists] = useState<ArtistWithGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);
  
  const [addArtistModalOpen, setAddArtistModalOpen] = useState(false);

  const agencyId = user?.agency;

  // Función principal para cargar datos
  const loadData = async () => {
    if (!agencyId) {
      setError('No se pudo identificar la agencia');
      setLoading(false);
      return;
    }

    console.log('=== INICIANDO CARGA DE DATOS ===');
    console.log('Agency ID:', agencyId);
    
    setLoading(true);
    setError(null);
    clearAgencyError();
    
    try {
      // Cargar artistas con grupos directamente del backend
      const artistsResponse = await agencyService.getActiveArtistsWithGroup(agencyId);
      console.log('Respuesta directa del backend:', artistsResponse);
      
      // Procesar la respuesta directamente en el componente
      const processedArtists = processArtistResponse(artistsResponse);
      console.log('Artistas procesados:', processedArtists);
      
      setLocalArtists(processedArtists);
      
      // También intentar usar el contexto
      try {
        const contextArtists = await fetchArtistsWithGroup(agencyId);
        console.log('Artistas del contexto:', contextArtists);
      } catch (contextErr) {
        console.warn('Error cargando del contexto:', contextErr);
      }
      
      // Cargar información de la agencia
      try {
        const agencyData = await fetchAgency(agencyId);
        if (agencyData) {
          setAgencyInfo(agencyData);
          console.log('Información de agencia cargada:', agencyData);
        }
      } catch (agencyErr) {
        console.warn('No se pudo cargar información de la agencia:', agencyErr);
      }
      
    } catch (err: any) {
      console.error('Error en loadData:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
      console.log('=== CARGA FINALIZADA ===');
    }
  };

  // Función para procesar la respuesta del backend
  const processArtistResponse = (response: any): ArtistWithGroup[] => {
    if (!response) {
      console.log('Respuesta vacía');
      return [];
    }
    
    console.log('Procesando respuesta del backend...');
    console.log('Tipo de respuesta:', typeof response);
    
    // Si es array, procesar cada elemento
    if (Array.isArray(response)) {
      console.log('Es un array de longitud:', response.length);

      console.log("Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      console.log(response);
      
      return response.map((item, index) => {
        console.log(`Procesando elemento ${index}:`, item);
        
        // CASO ESPECIAL: Si el item es un array de 2 elementos [artista, grupo]
        if (Array.isArray(item) && item.length === 2) {
          const artist = item[0];
          const group = item[1];
          
          console.log(`  Artista:`, artist);
          console.log(`  Grupo:`, group);
          
          return {
            id: artist?.id || `artist-${index}`,
            artist: artist,
            group: group
          };
        }
        
        // Caso 1: Estructura artista-grupo separada
        if (item.artist && item.group) {
          return {
            id: item.artist.id || `artist-${index}`,
            artist: item.artist,
            group: item.group
          };
        }
        
        // Caso 2: Artista con propiedades de grupo integradas
        if (item.stageName) {
          
          const artistWithGroup: ArtistWithGroup = {
            id: item.id || `artist-${index}`,
            artist: {
              id: item.id,
              stageName: item.stageName,
              birthday: item.birthday,
              transitionDate: item.transitionDate,
              status: item.status,
              apprenticeId: item.apprenticeId
            },
            group: null
          };
          
          // Si tiene propiedades de grupo
          if (item.groupId || item.groupName) {
            artistWithGroup.group = {
              id: item.groupId,
              name: item.groupName,
              status: item.groupStatus,
              concept: item.groupConcept
            };
          }
          
          return artistWithGroup;
        }
        
        // Caso 3: Item simple
        console.log('  Caso 3: Item simple:', item);
        return {
          id: item.id || `item-${index}`,
          artist: item,
          group: null
        };
      });
    }
    
    console.log('No se pudo procesar la respuesta, estructura no reconocida');
    return [];
  };

  useEffect(() => {
    if (agencyId) {
      console.log('Agency ID detectado, cargando datos...');
      loadData();
    } else {
      console.log('No hay agency ID disponible');
    }
  }, [agencyId]);

  // Sincronizar con el contexto cuando cambie
  useEffect(() => {
    console.log('artistsWithGroup del contexto actualizado:', artistsWithGroup);
    if (artistsWithGroup && artistsWithGroup.length > 0) {
      setLocalArtists(artistsWithGroup);
    }
  }, [artistsWithGroup]);

  // Funciones auxiliares
  const calculateAge = (birthday: string | Date): number => {
    if (!birthday) return 0;
    try {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 0;
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Columnas de la tabla
  // Columnas de la tabla - VERSIÓN CORREGIDA
const getArtistColumns = (): Column<ArtistWithGroup>[] => [
  {
    key: 'id',
    title: 'Nombre Artístico',
    sortable: true,
    width: '200px',
    align: 'center',
    render: (item) => {
      const artistData = item.artist;
      const actualArtist = Array.isArray(artistData) ? artistData[0] : artistData;
      const artistName = actualArtist?.stageName || 'Sin nombre';
      
      return (
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Typography variant="body1" fontWeight="bold"  textAlign='center'>
              {artistName}
            </Typography>
        </Box>
      );
    },
  },
  {
    key: 'artist.birthday',
    title: 'Edad',
    sortable: true,
    width: '100px',
    align: 'center',
    render: (item) => {
      const artistData = item.artist;
      const actualArtist = Array.isArray(artistData) ? artistData[0] : artistData;
      const age = calculateAge(actualArtist?.birthday);
      
      return (
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <Typography>{age} años</Typography>
        </Box>
      );
    },
  },
  {
    key: 'artist.status',
    title: 'Estado',
    sortable: true,
    width: '120px',
    align: 'center',
    render: (item) => {
      const artistData = item.artist;
      const actualArtist = Array.isArray(artistData) ? artistData[0] : artistData;
      const status = actualArtist?.status;
      let color: 'success' | 'warning' | 'error' | 'default' = 'default';
      let label = status || 'Desconocido';
      
      if (status === 'ACTIVO') {
        color = 'success';
        label = 'Activo';
      } else if (status === 'EN_PAUSA') {
        color = 'warning';
        label = 'En pausa';
      } else if (status === 'INACTIVO') {
        color = 'error';
        label = 'Inactivo';
      }
      
      return (
        <Chip
          label={label}
          color={color}
          size="small"
          variant="outlined"
        />
      );
    },
  },
  {
    key: 'group',
    title: 'Grupo',
    sortable: true,
    width: '150px',
    align: 'center',
    render: (item) => {
      const hasGroup = item.group && (item.group.name || item.group.groupName);
      
      return (
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          {hasGroup ? (
            <>
              <GroupsIcon fontSize="small" color="primary" />
              <Box textAlign="center">
                <Typography variant="body2" fontWeight="medium">
                  {item.group.name || item.group.groupName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.group.status || ''}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <GroupsIcon fontSize="small" color="disabled" />
              <Typography variant="body2" color="text.disabled">
                Sin grupo
              </Typography>
            </>
          )}
        </Box>
      );
    },
  },
];

  const handleAddArtistClick = () => {
    setAddArtistModalOpen(true);
  };

  const handleArtistAdded = () => {
    // Recargar datos después de agregar
    loadData();
    setNotification({
      type: 'success',
      message: 'Artista agregado exitosamente a la agencia',
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  const displayError = error || agencyError;

  if (!agencyId) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No tienes una agencia asignada.
      </Alert>
    );
  }

  const artistsCount = localArtists.length;
  const artistsWithGroupCount = localArtists.filter(item => 
    item.group && (item.group.name || item.group.groupName)
  ).length;

  return (
    <div className="agency-artists-view">
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Artistas activos de la agencia
            </Typography>
            {agencyInfo && (
              <Typography variant="subtitle1" color="text.secondary">
                {agencyInfo.nameAgency} - {agencyInfo.place}
              </Typography>
            )}
          </Box>
          
          <Box display="flex" gap={2}>
            <Button
              startIcon={<PersonAddIcon />}
              onClick={handleAddArtistClick}
              disabled={loading || agencyLoading}
              variant="contained"
              size="small"
              color="primary"
            >
              Agregar Artista
            </Button>
            
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadData}
              disabled={loading || agencyLoading}
              variant="outlined"
              size="small"
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {displayError && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }} 
            onClose={() => {
              setError(null);
              clearAgencyError();
            }}
          >
            {displayError}
          </Alert>
        )}

        {notification && (
          <Alert severity={notification.type} sx={{ mb: 2 }}>
            {notification.message}
          </Alert>
        )}

      </Box>

      {/* Modal para agregar artista */}
      {agencyInfo && (
        <AddArtistToAgencyModal
          open={addArtistModalOpen}
          onClose={() => setAddArtistModalOpen(false)}
          agencyId={agencyId}
          agencyName={agencyInfo.nameAgency}
          onArtistAdded={handleArtistAdded}
        />
      )}

      {/* Tabla de artistas */}
      <GenericTable<ArtistWithGroup>
        data={localArtists}
        columns={getArtistColumns()}
        title=""
        loading={loading || agencyLoading}
        itemsPerPage={10}
        showSearch={true}
        onReload={loadData}
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
        emptyState={
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay artistas en esta agencia
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {agencyInfo 
                ? `No se han registrado artistas en ${agencyInfo.nameAgency}`
                : 'No hay artistas registrados'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddArtistClick}
              sx={{ mt: 2 }}
            >
              Agregar primer artista
            </Button>
          </Box>
        }
      />

      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Mostrando {artistsCount} artistas
          {agencyInfo && ` • ${agencyInfo.nameAgency} (${agencyInfo.place})`}
          {artistsCount > 0 && (
            <>
              {' • '}
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <GroupsIcon fontSize="inherit" />
                <span>Con grupo: {artistsWithGroupCount}</span>
              </Box>
            </>
          )}
        </Typography>
      </Box>
    </div>
  );
};

export default AgencyArtistsView;