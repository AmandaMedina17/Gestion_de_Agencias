import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useArtist } from '../../../context/ArtistContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import TimelineIcon from '@mui/icons-material/Timeline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`artist-tabpanel-${index}`}
      aria-labelledby={`artist-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AgencyArtistsCompleteInfo: React.FC = () => {
  const { user } = useAuth();
  const {
    artistsCompleteInfo,
    completeInfoLoading,
    completeInfoError,
    fetchArtistsCompleteInfo,
    clearCompleteInfoError,
  } = useArtist();

  const [expandedArtist, setExpandedArtist] = useState<string | false>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const agencyId = user?.agency;

  useEffect(() => {
    if (agencyId) {
      loadData();
    }
  }, [agencyId]);

  const loadData = async () => {
    if (!agencyId) return;
    try {
      await fetchArtistsCompleteInfo(agencyId);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleAccordionChange = (artistId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedArtist(isExpanded ? artistId : false);
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleRetry = () => {
    clearCompleteInfoError();
    loadData();
  };

  const handleRefresh = () => {
    loadData();
  };

  // Calcular estadísticas
  const calculateStats = () => {
    const totalArtists = artistsCompleteInfo.length;
    const totalContracts = artistsCompleteInfo.reduce((acc, item) => acc + (item.contracts?.length || 0), 0);
    const totalActivities = artistsCompleteInfo.reduce((acc, item) => acc + (item.activities?.length || 0), 0);
    const totalDebutEntries = artistsCompleteInfo.reduce((acc, item) => acc + (item.debutHistory?.length || 0), 0);
    
    return { totalArtists, totalContracts, totalActivities, totalDebutEntries };
  };

  const stats = calculateStats();

  if (!agencyId) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No tienes una agencia asignada. No puedes ver esta información.
      </Alert>
    );
  }

  if (completeInfoLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando información completa de artistas...
        </Typography>
      </Box>
    );
  }

  if (completeInfoError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={handleRetry}>
            Reintentar
          </Button>
        }
        sx={{ mt: 2 }}
      >
        {completeInfoError}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Información Completa de Artistas
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Visualiza toda la información de artistas: contratos, actividades e historial de debut
            </Typography>
          </Box>
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            variant="outlined"
            disabled={completeInfoLoading}
          >
            Actualizar
          </Button>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            bgcolor: 'primary.light', 
            color: 'white',
            flex: '1 0 150px',
            maxWidth: '200px'
          }}>
            <Typography variant="h5">{stats.totalArtists}</Typography>
            <Typography variant="body2">Artistas</Typography>
          </Paper>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            bgcolor: 'secondary.light', 
            color: 'white',
            flex: '1 0 150px',
            maxWidth: '200px'
          }}>
            <Typography variant="h5">{stats.totalContracts}</Typography>
            <Typography variant="body2">Contratos</Typography>
          </Paper>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            bgcolor: 'success.light', 
            color: 'white',
            flex: '1 0 150px',
            maxWidth: '200px'
          }}>
            <Typography variant="h5">{stats.totalActivities}</Typography>
            <Typography variant="body2">Actividades</Typography>
          </Paper>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            bgcolor: 'warning.light', 
            color: 'white',
            flex: '1 0 150px',
            maxWidth: '200px'
          }}>
            <Typography variant="h5">{stats.totalDebutEntries}</Typography>
            <Typography variant="body2">Entradas de Debut</Typography>
          </Paper>
        </Box>

        {/* Indicadores visuales */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            icon={<PersonIcon />}
            label={`${stats.totalArtists} artistas`}
            color="primary"
            variant="outlined"
          />
          
        </Box>
      </Paper>

      {artistsCompleteInfo.length === 0 ? (
        <Alert severity="info">
          No se encontró información completa de artistas para esta agencia.
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {artistsCompleteInfo.map((artistInfo) => {
            const artist = artistInfo.artist;
            return (
              <Card key={artist.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  {/* Header del artista */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h5" component="div" gutterBottom>
                        {artist.stageName}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                        <Chip
                          icon={<CalendarTodayIcon />}
                          label={`Nacimiento: ${formatDate(artist.birthday)}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<CalendarTodayIcon />}
                          label={`Transición: ${formatDate(artist.transitionDate)}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={artist.status}
                          color={
                            artist.status === 'ACTIVO' ? 'success' : 
                            artist.status === 'INACTIVO' ? 'error' : 'default'
                          }
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Button
                      onClick={(e) => handleAccordionChange(artist.id)(e, expandedArtist !== artist.id)}
                      endIcon={<ExpandMoreIcon />}
                      variant="text"
                    >
                      {expandedArtist === artist.id ? 'Ocultar detalles' : 'Ver detalles'}
                    </Button>
                  </Box>

                  {/* Contadores rápidos - USANDO BOX */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 2, 
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    <Paper sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      bgcolor: 'info.50', 
                      flex: '1 0 100px',
                      maxWidth: '150px'
                    }}>
                      <Typography variant="h6" color="info.main">
                        {artistInfo.contracts?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Contratos
                      </Typography>
                    </Paper>
                    <Paper sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      bgcolor: 'success.50', 
                      flex: '1 0 100px',
                      maxWidth: '150px'
                    }}>
                      <Typography variant="h6" color="success.main">
                        {artistInfo.activities?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Actividades
                      </Typography>
                    </Paper>
                    <Paper sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      bgcolor: 'warning.50', 
                      flex: '1 0 100px',
                      maxWidth: '150px'
                    }}>
                      <Typography variant="h6" color="warning.main">
                        {artistInfo.debutHistory?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Debuts
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Acordeón con detalles */}
                  <Accordion 
                    expanded={expandedArtist === artist.id}
                    onChange={handleAccordionChange(artist.id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center">
                        <TimelineIcon sx={{ mr: 1 }} />
                        <Typography>Información Detallada</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ width: '100%' }}>
                        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                          <Tab icon={<DescriptionIcon />} label="Contratos" />
                          <Tab icon={<EventIcon />} label="Actividades" />
                          <Tab icon={<HistoryIcon />} label="Historial de Debut" />
                          <Tab icon={<PersonIcon />} label="Información Artista" />
                        </Tabs>

                        {/* Panel de Contratos */}
                        <TabPanel value={selectedTab} index={0}>
                          {artistInfo.contracts?.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined">
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Fecha Inicio</TableCell>
                                    <TableCell>Fecha Fin</TableCell>
                                    <TableCell>Términos</TableCell>
                                    <TableCell>Estado</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {artistInfo.contracts.map((contract: any) => (
                                    <TableRow key={contract.id}>
                                      <TableCell>{contract.id}</TableCell>
                                      <TableCell>{formatDate(contract.startDate)}</TableCell>
                                      <TableCell>{formatDate(contract.endDate)}</TableCell>
                                      <TableCell>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                          {contract.terms || 'Sin términos'}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={contract.status || 'ACTIVO'}
                                          size="small"
                                          color={
                                            contract.status === 'ACTIVO' ? 'success' : 
                                            contract.status === 'INACTIVO' ? 'error' : 'default'
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Alert severity="info">
                              No hay contratos registrados para este artista.
                            </Alert>
                          )}
                        </TabPanel>

                        {/* Panel de Actividades */}
                        <TabPanel value={selectedTab} index={1}>
                          {artistInfo.activities?.length > 0 ? (
                            <List>
                              {artistInfo.activities.map((activity: any, index) => (
                                <React.Fragment key={activity.id}>
                                  <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                          <Typography variant="subtitle1" fontWeight="bold">
                                            {activity.name}
                                          </Typography>
                                          <Chip
                                            label={activity.type || 'General'}
                                            size="small"
                                            color="primary"
                                          />
                                        </Box>
                                      }
                                      secondary={
                                        <Box>
                                          <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Fecha: {formatDate(activity.date)} • Duración: {activity.duration || 'N/A'}
                                          </Typography>
                                          {activity.description && (
                                            <Typography variant="body2">
                                              {activity.description}
                                            </Typography>
                                          )}
                                          {activity.location && (
                                            <Typography variant="caption" color="textSecondary">
                                              Ubicación: {activity.location}
                                            </Typography>
                                          )}
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                  {index < artistInfo.activities.length - 1 && <Divider />}
                                </React.Fragment>
                              ))}
                            </List>
                          ) : (
                            <Alert severity="info">
                              No hay actividades registradas para este artista.
                            </Alert>
                          )}
                        </TabPanel>

                        {/* Panel de Historial de Debut */}
                        <TabPanel value={selectedTab} index={2}>
                          {artistInfo.debutHistory?.length > 0 ? (
                            <Box sx={{ position: 'relative', pl: 3 }}>
                              {/* Línea de tiempo */}
                              <Box sx={{
                                position: 'absolute',
                                left: 8,
                                top: 0,
                                bottom: 0,
                                width: 2,
                                bgcolor: 'primary.main',
                                borderRadius: 1
                              }} />
                              
                              {artistInfo.debutHistory.map((debut: any, index) => (
                                <Box key={debut.id} sx={{ position: 'relative', mb: 3 }}>
                                  {/* Punto en la línea de tiempo */}
                                  <Box sx={{
                                    position: 'absolute',
                                    left: -15,
                                    top: 8,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    border: '2px solid white',
                                    boxShadow: 1
                                  }} />
                                  
                                  <Paper sx={{ p: 2, ml: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                      Debut #{index + 1}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Typography variant="body2">
                                          <strong>Fecha:</strong> {formatDate(debut.debutDate)}
                                        </Typography>
                                        
                                      </Box>
                                      {debut.description && (
                                        <Typography variant="body2">
                                          <strong>Descripción:</strong> {debut.description}
                                        </Typography>
                                      )}
                                      {debut.performanceType && (
                                        <Typography variant="body2">
                                          <strong>Tipo de Presentación:</strong> {debut.performanceType}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Paper>
                                </Box>
                              ))}
                            </Box>
                          ) : (
                            <Alert severity="info">
                              No hay historial de debut registrado para este artista.
                            </Alert>
                          )}
                        </TabPanel>

                        {/* Panel de Información del Artista */}
                        <TabPanel value={selectedTab} index={3}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' }, 
                            gap: 2 
                          }}>
                            <Paper sx={{ p: 2, bgcolor: 'grey.50', flex: 1 }}>
                              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Información Personal
                              </Typography>
                              <List dense>
                                <ListItem>
                                  <ListItemText
                                    primary="Nombre Artístico"
                                    secondary={artist.stageName}
                                  />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                  <ListItemText
                                    primary="Fecha de Nacimiento"
                                    secondary={formatDate(artist.birthday)}
                                  />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                  <ListItemText
                                    primary="Estado"
                                    secondary={
                                      <Chip
                                        label={artist.status}
                                        size="small"
                                        color={
                                          artist.status === 'ACTIVO' ? 'success' : 
                                          artist.status === 'INACTIVO' ? 'error' : 'default'
                                        }
                                      />
                                    }
                                  />
                                </ListItem>
                              </List>
                            </Paper>
                            <Paper sx={{ p: 2, bgcolor: 'grey.50', flex: 1 }}>
                              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Información Profesional
                              </Typography>
                              <List dense>
                                <ListItem>
                                  <ListItemText
                                    primary="Fecha de Transición"
                                    secondary={formatDate(artist.transitionDate)}
                                  />
                                </ListItem>
                                
                                
                              </List>
                            </Paper>
                          </Box>
                        </TabPanel>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AgencyArtistsCompleteInfo;