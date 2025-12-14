// GroupCalendarView.tsx - VERSIÓN CON DATOS ADAPTADOS
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Alert, 
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent
} from '@mui/material';
import { 
  DatePicker,
  LocalizationProvider 
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  CalendarMonth, 
  Search, 
  Refresh, 
  LocationOn, 
  AccessTime, 
  Event,
  FilterList,
  Download
} from '@mui/icons-material';
import { es } from 'date-fns/locale';
import { useActivityScheduling } from "../../../context/ActivitySchedulingContext";
import { useGroup } from "../../../context/GroupContext";
import { useAuth } from "../../../context/AuthContext";

// Interfaces para los datos del backend
interface BackendActivity {
  id: string;
  classification: string;
  type: string;
  responsibles: Array<{ id: string; name: string }>;
  places: Array<{ id: string; name: string }>;
  dates: string[];
}

// Interfaz para los datos transformados
interface Activity {
  id: string;
  activity: {
    id: string;
    description: string;
    place: string;
    date: string;
    time: string;
    type: string;
    status: string;
  };
  groupId: string;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  activityTypes: string[];
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  statuses: string[];
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  activityTypes,
  selectedTypes,
  onTypeChange,
  statuses,
  selectedStatuses,
  onStatusChange
}) => {
  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypeChange(newTypes);
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    onStatusChange(newStatuses);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterList />
          <Typography variant="h6">Filtros</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tipo de Actividad
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {activityTypes.map(type => (
              <Chip
                key={type}
                label={type}
                clickable
                color={selectedTypes.includes(type) ? "primary" : "default"}
                onClick={() => handleTypeToggle(type)}
                variant={selectedTypes.includes(type) ? "filled" : "outlined"}
              />
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Estado
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {statuses.map(status => (
              <Chip
                key={status}
                label={status}
                clickable
                color={selectedStatuses.includes(status) ? "primary" : "default"}
                onClick={() => handleStatusToggle(status)}
                variant={selectedStatuses.includes(status) ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Aplicar</Button>
      </DialogActions>
    </Dialog>
  );
};

// Función para transformar los datos del backend al formato esperado
const transformBackendData = (backendData: BackendActivity[], groupId: string): Activity[] => {
  return backendData.map(item => {
    // Extraer la primera fecha si existe
    const firstDate = item.dates && item.dates.length > 0 ? item.dates[0] : null;
    
    // Extraer el primer lugar si existe
    const firstPlace = item.places && item.places.length > 0 ? item.places[0].name : 'No especificado';
    
    // Extraer el primer responsable si existe
    const firstResponsible = item.responsibles && item.responsibles.length > 0 
      ? item.responsibles[0].name 
      : 'No asignado';
    
    // Crear descripción combinando clasificación y responsable
    const description = `${item.classification} - ${firstResponsible}`;
    
    return {
      id: item.id,
      groupId: groupId,
      activity: {
        id: item.id,
        description: description,
        place: firstPlace,
        date: firstDate || new Date().toISOString(),
        time: "00:00", // Hora por defecto, ya que el backend no parece enviar hora específica
        type: item.classification,
        status: "PROGRAMADA" // Estado por defecto
      }
    };
  });
};

const GroupCalendarView: React.FC = () => {
  // Contextos
  const { getGroupActivities, loading, error } = useActivityScheduling();
  const { groups, fetchGroups } = useGroup();
  const { user } = useAuth();

  // Estados
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [agencyGroups, setAgencyGroups] = useState<any[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [hasLoadedGroups, setHasLoadedGroups] = useState(false);

  // Cargar grupos solo una vez
  useEffect(() => {
    const loadGroups = async () => {
      try {
        if (user?.agency && !hasLoadedGroups) {
          await fetchGroups();
          setHasLoadedGroups(true);
        }
      } catch (err) {
        console.error("Error loading groups:", err);
      }
    };
    
    loadGroups();
  }, [user?.agency, hasLoadedGroups, fetchGroups]);

  // Filtrar grupos por agencia del usuario
  useEffect(() => {
    if (user?.agency && groups.length > 0) {
      const userAgencyGroups = groups.filter(group => group.agencyID === user.agency);
      setAgencyGroups(userAgencyGroups);
      
      // Si hay grupos, seleccionar el primero por defecto
      if (userAgencyGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(userAgencyGroups[0].id);
      }
    }
  }, [user?.agency, groups, selectedGroup]);

  // Obtener actividades cuando cambian los filtros
  const fetchActivities = useCallback(async () => {
    if (!selectedGroup || !startDate || !endDate) {
      alert("Por favor, seleccione un grupo y un rango de fechas");
      return;
    }

    try {
      console.log("Solicitando actividades para grupo:", selectedGroup);
      const backendData = await getGroupActivities(selectedGroup, startDate, endDate);
      console.log("Datos crudos del backend:", backendData);
      
      // Transformar datos del backend al formato esperado
      const transformedActivities = transformBackendData(
        Array.isArray(backendData) ? backendData : [], 
        selectedGroup
      );
      
      console.log("Actividades transformadas:", transformedActivities);
      
      setActivities(transformedActivities);
      setFilteredActivities(transformedActivities);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setActivities([]);
      setFilteredActivities([]);
    }
  }, [selectedGroup, startDate, endDate, getGroupActivities]);

  // Función para aplicar filtros
  const applyFilters = useCallback(() => {
    if (activities.length === 0) {
      setFilteredActivities([]);
      return;
    }

    let result = activities.filter(activity => {
      if (!activity?.activity) return false;
      
      const type = activity.activity.type;
      const status = activity.activity.status;
      
      // Filtrar por tipo de actividad
      if (selectedActivityTypes.length > 0) {
        if (!type || !selectedActivityTypes.includes(type)) return false;
      }
      
      // Filtrar por estado
      if (selectedStatuses.length > 0) {
        if (!status || !selectedStatuses.includes(status)) return false;
      }
      
      return true;
    });

    setFilteredActivities(result);
  }, [activities, selectedActivityTypes, selectedStatuses]);

  // Aplicar filtros cuando cambian las selecciones o actividades
  useEffect(() => {
    applyFilters();
  }, [selectedActivityTypes, selectedStatuses, activities, applyFilters]);

  // Obtener tipos de actividad únicos
  const activityTypes = useMemo(() => {
    const types: string[] = [];
    
    activities.forEach(activity => {
      if (activity?.activity?.type && typeof activity.activity.type === 'string') {
        types.push(activity.activity.type);
      }
    });
    
    return Array.from(new Set(types));
  }, [activities]);

  // Obtener estados únicos
  const statuses = useMemo(() => {
    const statusVals: string[] = [];
    
    activities.forEach(activity => {
      if (activity?.activity?.status && typeof activity.activity.status === 'string') {
        statusVals.push(activity.activity.status);
      }
    });
    
    return Array.from(new Set(statusVals));
  }, [activities]);

  // Formatear fecha
  const formatDate = useCallback((dateString: string | undefined | null): string => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("es-ES");
  }, []);

  // Formatear hora
  const formatTime = useCallback((timeString: string | undefined | null): string => {
    if (!timeString) return 'Sin hora';
    try {
      // Asegurar formato HH:MM
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(timeString)) {
        // Si no tiene formato HH:MM, intentar extraer de fecha ISO
        try {
          const date = new Date(timeString);
          if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        } catch {
          return 'Hora inválida';
        }
        return 'Hora inválida';
      }
      
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date(2000, 0, 1, hours, minutes);
      
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Hora inválida';
    }
  }, []);

  // Descargar calendario como CSV
  const downloadCalendar = useCallback(() => {
    if (filteredActivities.length === 0) return;

    const groupName = agencyGroups.find(g => g.id === selectedGroup)?.name || 'Grupo';
    
    // Crear contenido CSV
    const headers = ['Fecha', 'Hora', 'Tipo', 'Descripción', 'Lugar', 'Estado'];
    const rows = filteredActivities.map(activity => {
      const activityData = activity?.activity || {};
      return [
        formatDate(activityData.date),
        formatTime(activityData.time),
        activityData.type || 'Sin tipo',
        activityData.description || 'Sin descripción',
        activityData.place || 'Sin lugar',
        activityData.status || 'Sin estado'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calendario-${groupName}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredActivities, agencyGroups, selectedGroup, formatDate, formatTime]);

  // Manejar cambio de grupo
  const handleGroupChange = useCallback((event: SelectChangeEvent) => {
    setSelectedGroup(event.target.value as string);
  }, []);

  // Renderizar fila de actividad
  const renderActivityRow = useCallback((activity: Activity) => {
    const activityData = activity?.activity;
    
    if (!activityData) {
      return null;
    }

    return (
      <TableRow key={activity.id || Math.random().toString()} hover>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <Event color="primary" />
            <Typography variant="body2">
              {formatDate(activityData.date)}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime color="action" />
            <Typography variant="body2">
              {formatTime(activityData.time)}
            </Typography>
          </Box>
        </TableCell>
        
        <TableCell>
          <Typography variant="body2">
            {activityData.description || 'Sin descripción'}
          </Typography>
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn color="secondary" fontSize="small" />
            <Typography variant="body2">
              {activityData.place || 'Sin lugar'}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip
            label={activityData.status || 'Sin estado'}
            color={
              activityData.status === 'COMPLETADA' ? 'success' :
              activityData.status === 'EN_PROCESO' ? 'warning' :
              activityData.status === 'CANCELADA' ? 'error' : 'default'
            }
            size="small"
          />
        </TableCell>
      </TableRow>
    );
  }, [formatDate, formatTime]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarMonth />
        Calendario de Actividades del Grupo
      </Typography>

      {/* Panel de filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'stretch'
        }}>
          {/* Selector de grupo */}
          <Box sx={{ flex: { xs: '1 0 auto', md: '1' } }}>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Grupo</InputLabel>
              <Select
                value={selectedGroup}
                label="Seleccionar Grupo"
                onChange={handleGroupChange}
                disabled={agencyGroups.length === 0}
              >
                {agencyGroups.map(group => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name} ({group.members_num} miembros)
                  </MenuItem>
                ))}
              </Select>
              {agencyGroups.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  No hay grupos disponibles en tu agencia
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Selector de fecha inicio */}
          <Box sx={{ flex: { xs: '1 0 auto', md: '1' } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          {/* Selector de fecha fin */}
          <Box sx={{ flex: { xs: '1 0 auto', md: '1' } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha Fin"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          {/* Botón de búsqueda */}
          <Box sx={{ 
            flex: { xs: '1 0 auto', md: '0.5' },
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            <Button
              variant="contained"
              fullWidth
              onClick={fetchActivities}
              disabled={loading || !selectedGroup}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ height: '56px' }}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </Box>
        </Box>

        {/* Filtros aplicados */}
        {(selectedActivityTypes.length > 0 || selectedStatuses.length > 0) && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2">Filtros aplicados:</Typography>
            {selectedActivityTypes.map(type => (
              <Chip
                key={type}
                label={`Tipo: ${type}`}
                size="small"
                onDelete={() => 
                  setSelectedActivityTypes(prev => prev.filter(t => t !== type))
                }
              />
            ))}
            {selectedStatuses.map(status => (
              <Chip
                key={status}
                label={`Estado: ${status}`}
                size="small"
                onDelete={() => 
                  setSelectedStatuses(prev => prev.filter(s => s !== status))
                }
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* Panel de acciones */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h6">
            {activities.length > 0 ? (
              <>
                {filteredActivities.length} actividad{filteredActivities.length !== 1 ? 'es' : ''} encontrada{filteredActivities.length !== 1 ? 's' : ''}
              </>
            ) : (
              'No hay actividades programadas'
            )}
          </Typography>
          {activities.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              Mostrando {filteredActivities.length} de {activities.length} actividades
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDialogOpen(true)}
            disabled={activities.length === 0}
          >
            Filtrar
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={downloadCalendar}
            disabled={filteredActivities.length === 0}
          >
            Exportar
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchActivities}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Tabla de actividades */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : filteredActivities.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hora</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lugar</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredActivities.map(renderActivityRow)}
            </TableBody>
          </Table>
        </TableContainer>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <CalendarMonth sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay actividades programadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Selecciona un grupo y un rango de fechas para ver las actividades programadas
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <FilterList sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay actividades que coincidan con los filtros
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta cambiar los filtros o ajusta el rango de fechas
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Dialog de filtros */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        activityTypes={activityTypes}
        selectedTypes={selectedActivityTypes}
        onTypeChange={setSelectedActivityTypes}
        statuses={statuses}
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
      />
    </Box>
  );
};

export default GroupCalendarView;