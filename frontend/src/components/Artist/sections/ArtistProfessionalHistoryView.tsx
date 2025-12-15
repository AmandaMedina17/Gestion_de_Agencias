import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useArtist } from '../../../context/ArtistContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './ProfessionalHistory.css';

// Iconos
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import DescriptionIcon from '@mui/icons-material/Description';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ContractStatus } from '../../Admin/sections/Contract/ContractManagement';

const ArtistProfessionalHistoryView: React.FC = () => {
  const { user } = useAuth();
  const { 
    professionalHistory,
    professionalHistoryLoading,
    professionalHistoryError,
    fetchProfessionalHistory,
    clearProfessionalHistoryError
  } = useArtist();
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const artistId = user?.artist;

  // Cargar historial profesional
  const loadHistory = async () => {
    if (!artistId) {
      setNotification({
        type: 'error',
        message: 'No se pudo identificar al artista'
      });
      return;
    }

    try {
      await fetchProfessionalHistory(artistId);
      setNotification(null);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al cargar el historial'
      });
    }
  };

  useEffect(() => {
    if (artistId) {
      loadHistory();
    }
  }, [artistId]);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Presente';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Construir timeline combinando eventos de diferentes fuentes
  const buildTimeline = () => {
    const timelineEvents: Array<{
      id: string;
      date: Date | string | null;
      title: string;
      description: string;
      type: string;
    }> = [];

    // Agregar debuts al timeline
    if (professionalHistory?.debutHistory) {
      professionalHistory.debutHistory.forEach(debut => {
        timelineEvents.push({
          id: `debut-${debut.role}`,
          date: debut.debutDate,
          title: debut.role || `Debut en ${debut.group?.name || 'grupo'}`,
          description: debut.role || `Rol: ${debut.role || 'Miembro'}`,
          type: 'DEBUT'
        });
      });
    }

    // Agregar contratos activos al timeline
    if (professionalHistory?.activeContracts) {
      professionalHistory.activeContracts.forEach(contract => {
        timelineEvents.push({
          id: `contract-start-${contract.id}`,
          date: contract.startDate,
          title: `Contrato con ${contract.agency?.nameAgency || 'Agencia'}`,
          description: `Porcentaje: ${contract.distributionPercentage}% - ${contract.conditions || 'Sin condiciones especificadas'}`,
          type: 'CONTRACT_START'
        });

        if (contract.endDate) {
          timelineEvents.push({
            id: `contract-end-${contract.id}`,
            date: contract.endDate,
            title: `Fin de contrato con ${contract.agency?.nameAgency || 'Agencia'}`,
            description: 'Contrato finalizado',
            type: 'CONTRACT_END'
          });
        }
      });
    }

    // Agregar colaboraciones con grupos al timeline
    if (professionalHistory?.groupCollaborations) {
      professionalHistory.groupCollaborations.forEach(collab => {
        timelineEvents.push({
          id: `group-collab-${collab.artist}`,
          date: collab.date,
          title: `Colaboración con ${collab.group?.name || 'Grupo'}`,
          description: 'Colaboración grupal',
          type: 'GROUP_COLLABORATION'
        });
      });
    }

    // Agregar colaboraciones individuales al timeline
    if (professionalHistory?.artistCollaborations) {
      professionalHistory.artistCollaborations.forEach(collab => {
        timelineEvents.push({
          id: `artist-collab-${collab.artist1}`,
          date: collab.date,
          title: `Colaboración con ${collab.artist2?.stageName || 'Artista'}`,
          description: 'Proyecto colaborativo',
          type: 'ARTIST_COLLABORATION'
        });
      });
    }

    // Agregar actividades al timeline
    if (professionalHistory?.activities) {
      professionalHistory.activities.forEach(activity => {
        activity.dates?.forEach(date => {
          timelineEvents.push({
            id: `activity-${activity.id}-${date}`,
            date: date,
            title: `${activity.classification} - ${activity.type}`,
            description: activity.responsibles?.map(r => r.name).join(', ') || 'Sin responsables',
            type: 'ACTIVITY'
          });
        });
      });
    }

    // Ordenar por fecha (más antiguo primero para timeline)
    return timelineEvents.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  // Calcular estadísticas
  const calculateStatistics = () => {
    if (!professionalHistory) return null;

    return {
      totalDebuts: professionalHistory.debutHistory?.length || 0,
      totalContracts: professionalHistory.activeContracts?.length || 0,
      artistCollaborationsCount: professionalHistory.artistCollaborations?.length || 0,
      groupCollaborationsCount: professionalHistory.groupCollaborations?.length || 0,
      totalActivities: professionalHistory.activities?.length || 0
    };
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'DEBUT': return 'success';
      case 'CONTRACT_START': return 'primary';
      case 'CONTRACT_END': return 'error';
      case 'GROUP_COLLABORATION': return 'secondary';
      case 'ARTIST_COLLABORATION': return 'info';
      case 'ACTIVITY': return 'warning';
      default: return 'default';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'DEBUT': return <StarIcon />;
      case 'CONTRACT_START': return <DescriptionIcon />;
      case 'CONTRACT_END': return <DescriptionIcon />;
      case 'GROUP_COLLABORATION': return <GroupsIcon />;
      case 'ARTIST_COLLABORATION': return <HandshakeIcon />;
      case 'ACTIVITY': return <EventIcon />;
      default: return <EventIcon />;
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
    clearProfessionalHistoryError();
  };

  if (!artistId) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No tienes un artista asignado. Solo los artistas pueden ver su historial profesional.
      </Alert>
    );
  }

  if (professionalHistoryLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando historial profesional...
        </Typography>
      </Box>
    );
  }

  if (professionalHistoryError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={loadHistory}>
            Reintentar
          </Button>
        }
      >
        {professionalHistoryError}
      </Alert>
    );
  }

  const timelineEvents = buildTimeline();
  const statistics = calculateStatistics();

  return (
    <div className="artist-professional-history-view">
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Historial Profesional
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Revisa toda tu trayectoria artística en detalle
            </Typography>
          </Box>
          
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadHistory}
            disabled={professionalHistoryLoading}
            variant="outlined"
            size="small"
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Notificación */}
      {notification && (
        <Alert 
          severity={notification.type} 
          onClose={handleCloseNotification}
          sx={{ mb: 2 }}
        >
          {notification.message}
        </Alert>
      )}

      {professionalHistory ? (
        <>
          {/* Información del artista */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                <Box display="flex" alignItems="center" gap={2} sx={{ width: { xs: '100%', md: '33%' } }}>
                  <PersonIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6">
                      {professionalHistory.artist?.stageName || 'Sin nombre artístico'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estado: {professionalHistory.artist?.status || 'Desconocido'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Nacimiento: {formatDate(professionalHistory.artist?.birthday)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  width: { xs: '95%', md: '70%' },
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  gap: 2,
                  py: 1
                }}>
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'primary.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="primary.main">
                      {statistics?.totalDebuts || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Debuts
                    </Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'secondary.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="secondary.main">
                      {statistics?.totalContracts || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Contratos
                    </Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'success.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="success.main">
                      {statistics?.artistCollaborationsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Colab. Artistas
                    </Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'info.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="info.main">
                      {statistics?.groupCollaborationsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Colab. Grupos
                    </Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'warning.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="warning.main">
                      {statistics?.totalActivities || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Actividades
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Línea de tiempo */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon /> Línea de Tiempo Profesional
              </Typography>
              
              {timelineEvents.length > 0 ? (
                <Timeline position="alternate">
                  {timelineEvents.map((event, index) => (
                    <TimelineItem key={event.id}>
                      <TimelineOppositeContent color="text.secondary">
                        {formatDate(event.date)}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot >
                          {getEventIcon(event.type)}
                        </TimelineDot>
                        {index < timelineEvents.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} sx={{ p: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                          <Chip
                            label={event.type.replace('_', ' ')}
                            size="small"
                            sx={{ mt: 1 }}
                            color={getEventColor(event.type) as any}
                          />
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" py={4}>
                  No hay eventos en la línea de tiempo
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Contratos Activos */}
          {professionalHistory.activeContracts && professionalHistory.activeContracts.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon /> Contratos Activos
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Agencia</TableCell>
                        <TableCell>Inicio</TableCell>
                        <TableCell>Fin</TableCell>
                        <TableCell>Porcentaje</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {professionalHistory.activeContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>{contract.agency?.nameAgency || 'N/A'}</TableCell>
                          <TableCell>{formatDate(contract.startDate)}</TableCell>
                          <TableCell>{formatDate(contract.endDate)}</TableCell>
                          <TableCell>{contract.distributionPercentage}%</TableCell>
                          <TableCell>
                            <Chip
                              label={contract.status || 'ACTIVE'}
                              size="small"
                              color={
                                contract.status === ContractStatus.ACTIVO ? 'success' :
                                contract.status === ContractStatus.FINALIZADO ? 'error' : 'default'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Colaboraciones con Grupos */}
          {professionalHistory.groupCollaborations && professionalHistory.groupCollaborations.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsIcon /> Colaboraciones con Grupos
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Grupo</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Artista</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {professionalHistory.groupCollaborations.map((collab) => (
                        <TableRow>
                          <TableCell>{collab.group?.name || 'N/A'}</TableCell>
                          <TableCell>{formatDate(collab.date)}</TableCell>
                          <TableCell>{collab.artist?.stageName || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Historial de Debuts */}
          {professionalHistory.debutHistory && professionalHistory.debutHistory.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon /> Historial de Debuts
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {professionalHistory.debutHistory.map((debut) => (
                    <Box key={debut.role} sx={{ 
                      width: { 
                        xs: '100%', 
                        sm: 'calc(50% - 8px)', 
                        md: 'calc(33.333% - 8px)' 
                      } 
                    }}>
                      <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {debut.group?.name || 'Debut'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDate(debut.debutDate)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Rol:</strong> {debut.role || 'Miembro'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Inicio:</strong> {formatDate(debut.startDate)}
                        </Typography>
                        {debut.endDate && (
                          <Typography variant="body2">
                            <strong>Fin:</strong> {formatDate(debut.endDate)}
                          </Typography>
                        )}
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Colaboraciones con Artistas */}
          {professionalHistory.artistCollaborations && professionalHistory.artistCollaborations.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HandshakeIcon /> Colaboraciones con Artistas
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Artista 1</TableCell>
                        <TableCell>Artista 2</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {professionalHistory.artistCollaborations.map((collab) => (
                        <TableRow >
                          <TableCell>{formatDate(collab.date)}</TableCell>
                          <TableCell>{collab.artist1?.stageName || 'N/A'}</TableCell>
                          <TableCell>{collab.artist2?.stageName || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Actividades */}
          {professionalHistory.activities && professionalHistory.activities.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon /> Actividades
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {professionalHistory.activities.map((activity) => (
                    <Box key={activity.id} sx={{ 
                      width: { 
                        xs: '100%', 
                        sm: 'calc(50% - 8px)' 
                      } 
                    }}>
                      <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {activity.type} - {activity.classification}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Fechas: {activity.dates?.map(d => formatDate(d)).join(', ') || 'No especificadas'}
                        </Typography>
                        {activity.responsibles && activity.responsibles.length > 0 && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Responsables:</strong> {activity.responsibles.map(r => r.name).join(', ')}
                          </Typography>
                        )}
                        {activity.places && activity.places.length > 0 && (
                          <Typography variant="body2">
                            <strong>Lugares:</strong> {activity.places.map(p => p.name).join(', ')}
                          </Typography>
                        )}
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {!professionalHistory.activeContracts?.length && 
           !professionalHistory.groupCollaborations?.length && 
           !professionalHistory.debutHistory?.length && 
           !professionalHistory.artistCollaborations?.length && 
           !professionalHistory.activities?.length && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay historial profesional disponible para mostrar.
            </Alert>
          )}
        </>
      ) : (
        <Alert severity="info">
          No se ha cargado el historial profesional. Haz clic en "Actualizar" para cargar los datos.
        </Alert>
      )}

      
    </div>
  );
};

export default ArtistProfessionalHistoryView;