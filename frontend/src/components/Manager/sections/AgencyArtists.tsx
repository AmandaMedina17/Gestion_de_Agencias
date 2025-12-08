import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { agencyService } from '../../../services/AgencyService';
import { ArtistResponseDto } from '../../../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { AgencyResponseDto } from '../../../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto';
import GenericTable from '../../ui/datatable';
import { Column } from '../../ui/datatable';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import MicIcon from '@mui/icons-material/Mic';
import CakeIcon from '@mui/icons-material/Cake';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './AgencyApprentices.css';

// Enums locales
export enum ArtistStatus {
  ACTIVO = "ACTIVO",
  EN_PAUSA = "EN_PAUSA",
  INACTIVO = "INACTIVO",
}

interface AgencyArtistsViewProps {
  showActions?: boolean;
  readOnly?: boolean;
  onArtistSelect?: (artist: ArtistResponseDto) => void;
}

const AgencyArtistsView: React.FC<AgencyArtistsViewProps> = ({
  showActions = true,
  readOnly = false,
  onArtistSelect,
}) => {
  const { user } = useAuth();
  const [artists, setArtists] = useState<ArtistResponseDto[]>([]);
  const [agencyInfo, setAgencyInfo] = useState<AgencyResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
  } | null>(null);

  const agencyId = user?.agency;

  // Cargar artistas e información de la agencia
  const fetchArtists = async () => {
    if (!agencyId) {
      setError('No se pudo identificar la agencia');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const artistsData = await agencyService.getAgencyArtists(agencyId);
      setArtists(artistsData);
      
      try {
        const agencyData = await agencyService.findOne(agencyId);
        setAgencyInfo(agencyData);
      } catch (agencyErr) {
        console.warn('No se pudo cargar información adicional de la agencia:', agencyErr);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar los artistas');
      console.error('Error fetching artists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agencyId) {
      fetchArtists();
    }
  }, [agencyId]);

  // Calcular edad a partir de la fecha de cumpleaños
  const calculateAge = (birthday: Date | string): number => {
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

  // Formatear fecha
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Formatear fecha con hora
  const formatDateTime = (date: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: ArtistStatus) => {
    switch (status) {
      case ArtistStatus.ACTIVO: return 'Activo';
      case ArtistStatus.EN_PAUSA: return 'En pausa';
      case ArtistStatus.INACTIVO: return 'Inactivo';
      default: return status;
    }
  };

  // Obtener color del estado
  const getStatusColor = (status: ArtistStatus) => {
    switch (status) {
      case ArtistStatus.ACTIVO: return 'success';
      case ArtistStatus.EN_PAUSA: return 'warning';
      case ArtistStatus.INACTIVO: return 'error';
      default: return 'default';
    }
  };

  // Renderizar el estado
  const renderStatus = (status: ArtistStatus) => (
    <Chip
      label={getStatusText(status)}
      color={getStatusColor(status)}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 500 }}
    />
  );

  // Definir columnas basadas en el DTO
  const getArtistColumns = (): Column<ArtistResponseDto>[] => [
    {
      key: 'stageName',
      title: 'Nombre Artístico',
      sortable: true,
      width: '180px',
      render: (item) => (
        <div className="artist-name-cell">
          <Box display="flex" alignItems="center" gap={1}>
            <MicIcon fontSize="small" color="primary" />
            <div>
              <Typography variant="body1" fontWeight="bold">
                {item.stageName}
              </Typography>
              {item.apprenticeId && (
                <Typography variant="caption" color="text.secondary" display="block">
                  ID Aprendiz: {item.apprenticeId.substring(0, 8)}...
                </Typography>
              )}
            </div>
          </Box>
        </div>
      ),
    },
    {
      key: 'birthday',
      title: 'Información Personal',
      sortable: true,
      width: '150px',
      render: (item) => (
        <div className="artist-info-cell">
          {item.birthday && (
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CakeIcon fontSize="small" color="action" />
              <div>
                <Typography variant="body2">
                  {formatDate(item.birthday)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {calculateAge(item.birthday)} años
                </Typography>
              </div>
            </Box>
          )}
          {item.groupId && (
            <Box display="flex" alignItems="center" gap={1}>
              <GroupsIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                Grupo: {item.groupId.substring(0, 8)}...
              </Typography>
            </Box>
          )}
        </div>
      ),
    },
    {
      key: 'transitionDate',
      title: 'Fecha de Transición',
      sortable: true,
      width: '140px',
      align: 'center',
      render: (item) => (
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <div>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(item.transitionDate)}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {item.transitionDate && new Date(item.transitionDate).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
          </div>
        </Box>
      ),
    },
    {
      key: 'status',
      title: 'Estado',
      sortable: true,
      width: '120px',
      align: 'center',
      render: (item) => renderStatus(item.status as ArtistStatus),
    },
  ];

  const handleViewDetails = (artist: ArtistResponseDto) => {
    if (onArtistSelect) {
      onArtistSelect(artist);
    } else {
      setNotification({
        type: 'info',
        title: 'Detalles del Artista',
        message: `Ver detalles de ${artist.stageName}`,
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  if (!agencyId) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No tienes una agencia asignada. Contacta al administrador para que te asigne una.
      </Alert>
    );
  }

  // Calcular estadísticas
  const statsByStatus = [
    {
      label: 'Activos',
      value: artists.filter(a => a.status === ArtistStatus.ACTIVO).length,
      color: '#2e7d32',
      status: ArtistStatus.ACTIVO,
      icon: '🎤',
    },
    {
      label: 'En Pausa',
      value: artists.filter(a => a.status === ArtistStatus.EN_PAUSA).length,
      color: '#ed6c02',
      status: ArtistStatus.EN_PAUSA,
      icon: '⏸️',
    },
    {
      label: 'Inactivos',
      value: artists.filter(a => a.status === ArtistStatus.INACTIVO).length,
      color: '#d32f2f',
      status: ArtistStatus.INACTIVO,
      icon: '🚫',
    },
  ];

  // Calcular edad promedio
  const averageAge = artists.length > 0 
    ? artists.reduce((sum, artist) => sum + calculateAge(artist.birthday), 0) / artists.length
    : 0;

  // Calcular años desde transición
  const calculateYearsSinceTransition = (transitionDate: Date | string): number => {
    if (!transitionDate) return 0;
    try {
      const transition = new Date(transitionDate);
      const today = new Date();
      return today.getFullYear() - transition.getFullYear();
    } catch {
      return 0;
    }
  };

  const averageExperience = artists.length > 0
    ? artists.reduce((sum, artist) => sum + calculateYearsSinceTransition(artist.transitionDate), 0) / artists.length
    : 0;

  return (
    <div className="agency-artists-view">
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <div>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Artistas de la Agencia
            </Typography>
            {agencyInfo && (
              <Typography variant="subtitle1" color="text.secondary">
                {agencyInfo.nameAgency} - {agencyInfo.place}
              </Typography>
            )}
          </div>
          
          <Box display="flex" gap={2}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchArtists}
              disabled={loading}
              variant="outlined"
              size="small"
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {/* Estadísticas generales */}
        {artists.length > 0 && (
          <Box mb={3}>
            <Box display="flex" gap={2} mb={2} className="stats-container">
              <div className="stat-card total">
                <Typography variant="body2" color="text.secondary">
                  Total Artistas
                </Typography>
                <Typography variant="h5" className="stat-value">
                  {artists.length}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Edad promedio
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {averageAge.toFixed(1)} años
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Experiencia promedio
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {averageExperience.toFixed(1)} años
                  </Typography>
                </Box>
              </div>
              
              {/* Estadísticas por estado */}
              {statsByStatus.map((stat, index) => (
                <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h5" 
                    className="stat-value" 
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {artists.length > 0 ? ((stat.value / artists.length) * 100).toFixed(0) : 0}%
                  </Typography>
                </div>
              ))}
            </Box>
          </Box>
        )}

        {/* Distribución por años de experiencia */}
        {artists.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="medium">
              Distribución por Años de Experiencia
            </Typography>
            <Box display="flex" gap={2} mb={2} className="experience-container">
              {[
                { label: '0-1 años', range: [0, 1], icon: '🆕', color: '#1976d2' },
                { label: '2-5 años', range: [2, 5], icon: '📈', color: '#2e7d32' },
                { label: '6-10 años', range: [6, 10], icon: '🏆', color: '#ed6c02' },
                { label: '+10 años', range: [11, Infinity], icon: '👑', color: '#7b1fa2' },
              ].map((range, index) => {
                const count = artists.filter(artist => {
                  const experience = calculateYearsSinceTransition(artist.transitionDate);
                  return experience >= range.range[0] && experience <= range.range[1];
                }).length;
                
                return (
                  <div key={index} className="experience-card" style={{ borderLeft: `4px solid ${range.color}` }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <span style={{ fontSize: '20px' }}>{range.icon}</span>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">
                        {range.label}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h5" 
                      className="stat-value" 
                      style={{ color: range.color }}
                    >
                      {count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {artists.length > 0 ? ((count / artists.length) * 100).toFixed(0) : 0}%
                    </Typography>
                  </div>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* Tabla de artistas */}
      <GenericTable<ArtistResponseDto>
        data={artists}
        columns={getArtistColumns()}
        title=""
        loading={loading}
        itemsPerPage={10}
        showHeader={false}
        showCreateButton={false}
        showActionsColumn={showActions && !readOnly}
        showSearch={true}
        showReloadButton={false}
        onReload={fetchArtists}
        notification={notification || undefined}
        onNotificationClose={handleNotificationClose}
        className="artists-table"
        
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
          </Box>
        }
        
        loadingComponent={
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Cargando artistas...
            </Typography>
          </Box>
        }
        
        renderCustomActions={showActions && !readOnly ? (artist) => (
          <div className="artist-actions">
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(artist)}
              sx={{ 
                fontSize: '0.75rem',
                textTransform: 'none',
                fontWeight: 'medium'
              }}
            >
              Ver Detalles
            </Button>
          </div>
        ) : undefined}
      />

      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Mostrando {artists.length} artistas de tu agencia asignada
          {agencyInfo && ` • ${agencyInfo.nameAgency} (${agencyInfo.place})`}
          {artists.length > 0 && (
            <>
              {' • '}
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <CakeIcon fontSize="inherit" />
                <span>Edad promedio: {averageAge.toFixed(1)} años</span>
              </Box>
            </>
          )}
        </Typography>
      </Box>
    </div>
  );
};

export default AgencyArtistsView;