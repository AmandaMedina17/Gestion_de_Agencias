import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAgency } from '../../../context/AgencyContext';
import GenericTable from '../../ui/datatable';
import { Column } from '../../ui/datatable';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Interfaces para los datos basadas en la respuesta de la API
interface ApiArtist {
  id: string;
  transitionDate: string;
  status: string;
  stageName: string;
  birthday: string;
  apprenticeId: string;
  fullName?: string; // Nota: no aparece en la respuesta, podrías necesitar ajustar esto
  nationality?: string; // Nota: no aparece en la respuesta
  gender?: string; // Nota: no aparece en la respuesta
}

interface ApiGroup {
  id: string;
  name: string;
  status: string;
  debut_date: string;
  members_num: number;
  concept: string;
  is_created: boolean;
  agencyID: string;
  fandomName?: string; // Nota: no aparece en la respuesta
}

interface ApiAgency {
  id: string;
  place: {
    id: string;
    name: string;
  };
  nameAgency: string;
  dateFundation: string;
}

interface ApiContract {
  id: string;
  startDate: string;
  endDate: string | null;
  agency: ApiAgency;
  artist: ApiArtist;
  distributionPercentage: number;
  status: string;
  conditions: string;
  type?: string; // Nota: no aparece en la respuesta
  details?: string; // Nota: no aparece en la respuesta
}

interface ApiResponseItem {
  artist: ApiArtist;
  debutGroups: ApiGroup[];
  activeContracts: ApiContract[];
}

// Interfaces para el componente
interface ContractData {
  id: string;
  startDate: Date | string;
  endDate: Date | string | null;
  status: string;
  type: string;
  details?: string;
}

interface GroupData {
  id: string;
  name: string;
  debutDate: Date | string;
  fandomName?: string;
  status: string;
}

interface ArtistWithDebutAndContracts {
  id: string;
  artist: {
    id: string;
    fullName: string;
    stageName: string;
    birthDate: Date | string;
    nationality: string;
    gender: string;
  };
  group: GroupData | null;
  contract: ContractData | null;
  debutCount: number;
  lastDebutDate: Date | string;
}

const ArtistsWithDebutAndContractsView: React.FC = () => {
  const { user } = useAuth();
  const { 
    fetchArtistsWithDebutAndContracts,
    loading, 
    error,
    clearError 
  } = useAgency();
  
  const [artistsData, setArtistsData] = useState<ArtistWithDebutAndContracts[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
  } | null>(null);

  const agencyId = user?.agency;

  // Función para transformar los datos de la API al formato esperado por el componente
  const transformApiData = (apiData: ApiResponseItem[]): ArtistWithDebutAndContracts[] => {
    return apiData.map(item => {
      // Obtener el primer grupo (si existe)
      const firstGroup = item.debutGroups.length > 0 ? item.debutGroups[0] : null;
      
      // Obtener el primer contrato activo (si existe)
      const firstContract = item.activeContracts.length > 0 ? item.activeContracts[0] : null;
      
      // Encontrar la fecha de debut más reciente
      const lastDebutDate = item.debutGroups.length > 0 
        ? item.debutGroups.reduce((latest, group) => {
            const groupDate = new Date(group.debut_date);
            const latestDate = new Date(latest);
            return groupDate > latestDate ? group.debut_date : latest;
          }, item.debutGroups[0].debut_date)
        : new Date().toISOString(); // Fallback si no hay grupos

      return {
        id: item.artist.id,
        artist: {
          id: item.artist.id,
          fullName: item.artist.stageName, // Usar stageName como fallback para fullName
          stageName: item.artist.stageName,
          birthDate: item.artist.birthday,
          nationality: 'No especificada', // Valor por defecto ya que no viene en la API
          gender: 'No especificado' // Valor por defecto ya que no viene en la API
        },
        group: firstGroup ? {
          id: firstGroup.id,
          name: firstGroup.name,
          debutDate: firstGroup.debut_date,
          fandomName: firstGroup.fandomName,
          status: firstGroup.status
        } : null,
        contract: firstContract ? {
          id: firstContract.id,
          startDate: firstContract.startDate,
          endDate: firstContract.endDate,
          status: firstContract.status,
          type: 'Contrato Principal', // Valor por defecto ya que no viene en la API
          details: firstContract.conditions
        } : null,
        debutCount: item.debutGroups.length,
        lastDebutDate: lastDebutDate
      };
    });
  };

  // Cargar artistas con debut y contratos
  const fetchData = async () => {
    if (!agencyId) {
      setNotification({
        type: 'error',
        message: 'No se pudo identificar la agencia',
      });
      return;
    }

    try {
      const apiData = await fetchArtistsWithDebutAndContracts(agencyId);
      const transformedData = transformApiData(apiData);
      setArtistsData(transformedData);
      
      if (transformedData.length === 0) {
        setNotification({
          type: 'info',
          title: 'Sin datos',
          message: 'No se encontraron artistas que cumplan los criterios',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Error al cargar los datos',
      });
    }
  };

  useEffect(() => {
    if (agencyId) {
      fetchData();
    }
  }, [agencyId]);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const calculateAge = (birthDate: Date | string) => {
    if (!birthDate) return 'N/A';
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 'N/A';
    }
  };

  const getContractStatusColor = (status: string | null | undefined) => {
    if (!status) return 'default';
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'ACTIVO':
        return 'success';
      case 'PENDING':
      case 'PENDIENTE':
        return 'warning';
      case 'EXPIRED':
      case 'EXPIRADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getContractStatusText = (status: string | null | undefined) => {
    if (!status) return 'Sin contrato';
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'ACTIVO':
        return 'Activo';
      case 'PENDING':
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EXPIRED':
      case 'EXPIRADO':
        return 'Expirado';
      default:
        return status || 'Desconocido';
    }
  };

  const getGroupStatusColor = (status: string | null | undefined) => {
    if (!status) return 'default';
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'ACTIVO':
        return 'success';
      case 'INACTIVE':
      case 'INACTIVO':
        return 'error';
      case 'ON_HIATUS':
      case 'HIATO':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getGroupStatusText = (status: string | null | undefined) => {
    if (!status) return 'N/A';
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'ACTIVO':
        return 'Activo';
      case 'INACTIVE':
      case 'INACTIVO':
        return 'Inactivo';
      case 'ON_HIATUS':
      case 'HIATO':
        return 'En Hiato';
      default:
        return status || 'Desconocido';
    }
  };

  // Definir columnas de la tabla con verificaciones de seguridad
  const getColumns = (): Column<ArtistWithDebutAndContracts>[] => [
    {
      key: 'artist.stageName',
      title: 'Nombre Artístico',
      sortable: true,
      width: '180px',
      align: 'center',
      render: (item) => (
        <div className="artist-name-cell">
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" color="primary" />
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {item.artist.stageName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.artist.fullName}
              </Typography>
            </Box>
          </Box>
        </div>
      ),
    },
    {
      key: 'artist.age',
      title: 'Edad',
      sortable: true,
      width: '80px',
      align: 'center',
      render: (item) => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="body1" fontWeight="medium">
            {calculateAge(item.artist.birthDate)}
          </Typography>
        </Box>
      ),
    },
    
    {
      key: 'group.name',
      title: 'Grupo',
      sortable: true,
      width: '50px',
      align: 'center',
      render: (item) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Box>
            <Typography variant="body2" fontWeight={item.group ? "medium" : "regular"}>
              { item.group?.name || 'Sin grupo'}
            </Typography>
            {item.group && item.group.fandomName && (
              <Typography variant="caption" color="text.secondary">
                {item.group.fandomName}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      key: 'group.status',
      title: 'Estado Grupo',
      sortable: true,
      width: '120px',
      align: 'center',
      render: (item) => (
        item.group ? (
          <Chip
            label={getGroupStatusText(item.group.status)}
            color={getGroupStatusColor(item.group.status) as any}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            N/A
          </Typography>
        )
      ),
    },
    {
      key: 'contract.startDate',
      title: 'Inicio Contrato',
      sortable: true,
      width: '130px',
      align: 'center',
      render: (item) => (
        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {item.contract ? formatDate(item.contract.startDate) : 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'contract.endDate',
      title: 'Fin Contrato',
      sortable: true,
      width: '130px',
      align: 'center',
      render: (item) => (
        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {item.contract?.endDate ? formatDate(item.contract.endDate) : 'Indefinido'}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'contract.status',
      title: 'Estado Contrato',
      sortable: true,
      width: '120px',
      align: 'center',
      render: (item) => (
        <Chip
          label={getContractStatusText(item.contract?.status)}
          color={getContractStatusColor(item.contract?.status) as any}
          size="small"
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
   
  ];

  const handleNotificationClose = () => {
    setNotification(null);
    clearError();
  };

  if (!agencyId) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No tienes una agencia asignada. Contacta al administrador para que te asigne una.
      </Alert>
    );
  }

  // Calcular estadísticas CON VERIFICACIONES DE SEGURIDAD
  const totalArtists = artistsData.length;
  
  // Verificar que contract existe antes de acceder a status
  const activeContracts = artistsData.filter(item => {
    const contract = item.contract;
    if (!contract || !contract.status) return false;
    const status = contract.status.toUpperCase();
    return status === 'ACTIVE' || status === 'ACTIVO';
  }).length;
  
  const artistsWithGroup = artistsData.filter(item => item.group !== null).length;
  const totalDebuts = artistsData.reduce((sum, item) => sum + item.debutCount, 0);

  return (
    <div className="artists-with-debut-contracts-view">
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <div>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Artistas con Debut y Contratos
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Artistas que han participado en al menos un debut y tienen contratos registrados
            </Typography>
          </div>
          
          <Box display="flex" gap={2}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              disabled={loading}
              variant="outlined"
              size="small"
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {/* Estadísticas */}
        {artistsData.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Resumen
            </Typography>
            <Box display="flex" gap={2} mb={2} className="stats-container">
              <div className="stat-card total">
                <Typography variant="body2" color="text.secondary">
                  Total Artistas
                </Typography>
                <Typography variant="h5" className="stat-value">
                  {totalArtists}
                </Typography>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #2e7d32' }}>
                <Typography variant="body2" color="text.secondary">
                  Contratos Activos
                </Typography>
                <Typography variant="h5" className="stat-value" style={{ color: '#2e7d32' }}>
                  {activeContracts}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalArtists > 0 ? ((activeContracts / totalArtists) * 100).toFixed(0) : 0}%
                </Typography>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #1976d2' }}>
                <Typography variant="body2" color="text.secondary">
                  Con Grupo
                </Typography>
                <Typography variant="h5" className="stat-value" style={{ color: '#1976d2' }}>
                  {artistsWithGroup}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalArtists > 0 ? ((artistsWithGroup / totalArtists) * 100).toFixed(0) : 0}%
                </Typography>
              </div>
              
            </Box>
          </Box>
        )}
      </Box>

      {/* Tabla de artistas */}
      <GenericTable<ArtistWithDebutAndContracts>
        data={artistsData}
        columns={getColumns()}
        title=""
        loading={loading}
        itemsPerPage={10}
        showHeader={false}
        showCreateButton={false}
        showActionsColumn={false}
        showSearch={true}
        showReloadButton={false}
        onReload={fetchData}
        notification={notification || error ? {
          type: 'error',
          message: error || notification?.message || '',
          title: notification?.title || 'Error'
        } : undefined}
        onNotificationClose={handleNotificationClose}
        className="artists-with-debut-table"
        
        emptyState={
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron artistas
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              No hay artistas que hayan participado en al menos un debut y tengan contratos registrados en este momento.
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              variant="outlined"
              size="small"
            >
              Intentar nuevamente
            </Button>
          </Box>
        }
        
        loadingComponent={
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Cargando artistas con debut y contratos...
            </Typography>
          </Box>
        }
      />

      
    </div>
  );
};

export default ArtistsWithDebutAndContractsView;