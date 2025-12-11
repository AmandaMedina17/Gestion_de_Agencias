import React, { useState, useEffect } from "react";
import { useActivityScheduling } from "../../../context/ActivitySchedulingContext";
import { useArtist } from "../../../context/ArtistContext";
import { useGroup } from "../../../context/GroupContext";
import { useActivity } from "../../../context/ActivityContext";
import { Tabs, Tab, Box, Typography, Paper, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import Icon from "../../icons/Icon";
import { ActivityResponseDto } from "../../../../../backend/src/ApplicationLayer/DTOs/activityDto/response-activity.dto";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ActivityData {
  id: string;
  activityId: string;
  scheduledDate?: string | Date;
  status?: string;
  [key: string]: any;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`activity-tabpanel-${index}`}
      aria-labelledby={`activity-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ActivitySchedulingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    scheduleArtistActivity,
    scheduleGroupActivity,
    getArtistActivities,
    getGroupActivities,
    artistActivities,
    groupActivities,
    loading,
    error,
    clearError
  } = useActivityScheduling();

  const { artists, fetchArtists } = useArtist();
  const { groups, fetchGroups } = useGroup();
  const { activities, fetchActivities } = useActivity();

  const [selectedArtist, setSelectedArtist] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
    open: boolean;
  }>({ type: "info", message: "", open: false });

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchArtists(),
          fetchGroups(),
          fetchActivities()
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
        showNotification("error", "No se pudieron cargar los datos iniciales");
      }
    };
    loadData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    clearError();
    setNotification({ ...notification, open: false });
  };

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message, open: true });
    setTimeout(() => setNotification({ ...notification, open: false }), 5000);
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Función para programar actividad a artista
  const handleScheduleArtist = async () => {
    if (!selectedArtist || !selectedActivity) {
      showNotification("error", "Por favor selecciona un artista y una actividad");
      return;
    }

    try {
      console.log("Enviando datos:", { 
        artistId: selectedArtist, 
        activityId: selectedActivity 
      });
      
      await scheduleArtistActivity({
        artistId: selectedArtist,
        activityId: selectedActivity,
      });
      
      // Actualizar actividades del artista
      await getArtistActivities(selectedArtist);
      
      showNotification("success", "Actividad programada exitosamente para el artista");
      setSelectedActivity("");
    } catch (err: any) {
      console.error("Error completo:", err);
      
      if (err.message.includes("El artista ya está programado")) {
        showNotification("info", "El artista ya tiene esta actividad programada");
      } else {
        showNotification("error", err.message || "Error al programar la actividad");
      }
    }
  };

  // Función para programar actividad a grupo
  const handleScheduleGroup = async () => {
    if (!selectedGroup || !selectedActivity) {
      showNotification("error", "Por favor selecciona un grupo y una actividad");
      return;
    }

    try {
      await scheduleGroupActivity({
        groupId: selectedGroup,
        activityId: selectedActivity,
      });
      
      // Actualizar actividades del grupo
      await getGroupActivities(selectedGroup);
      
      showNotification("success", "Actividad programada exitosamente para el grupo");
      setSelectedActivity("");
    } catch (err: any) {
      console.error("Error completo:", err);
      
      if (err.message.includes("El grupo ya está programado")) {
        showNotification("info", "El grupo ya tiene esta actividad programada");
      } else {
        showNotification("error", err.message || "Error al programar la actividad");
      }
    }
  };

  // Cargar actividades del artista/grupo seleccionado
  const handleArtistChange = async (artistId: string) => {
    setSelectedArtist(artistId);
    if (artistId) {
      try {
        await getArtistActivities(artistId);
      } catch (err) {
        console.error("Error loading artist activities:", err);
        showNotification("error", "No se pudieron cargar las actividades del artista");
      }
    }
  };

  const handleGroupChange = async (groupId: string) => {
    setSelectedGroup(groupId);
    if (groupId) {
      try {
        await getGroupActivities(groupId);
      } catch (err) {
        console.error("Error loading group activities:", err);
        showNotification("error", "No se pudieron cargar las actividades del grupo");
      }
    }
  };

  // Formatear fechas para la tabla
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString("es-ES", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
       
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  // Obtener informacin de la actividad
  const getActivityInfo = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    return activity || null;
  };

  const prepareArtistActivities = () => {
    return (artistActivities as ActivityResponseDto[]).map(item => ({
      ...item,
      activityType: item.type || 'N/A',
      classification: item.classification || 'N/A',
      formattedDate: formatDate(item.dates.toString())
    }));
  };

  const prepareGroupActivities = () => {
    return (groupActivities as ActivityResponseDto[]).map(item => ({
      ...item,
      activityType: item.type || 'N/A',
      classification: item.classification || 'N/A',
            formattedDate: formatDate(item.dates.toString())

    }));
  };

  const artistActivityColumns: GridColDef[] = [
    { 
      field: 'activityType', 
      headerName: 'Tipo', 
      width: 300
    },
    { 
      field: 'classification', 
      headerName: 'Clasificación', 
      width: 300
    },
    { 
      field: 'formattedDate', 
      headerName: 'Fecha Programada', 
      width: 300
    },
    
  ];

  const groupActivityColumns: GridColDef[] = [
     { 
      field: 'activityType', 
      headerName: 'Tipo', 
      width: 300
    },
    { 
      field: 'classification', 
      headerName: 'Clasificación', 
      width: 300
    },
    { 
      field: 'formattedDate', 
      headerName: 'Fecha Programada', 
      width: 300
    },
  ];

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Programación de Actividades
      </Typography>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.type}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="activity scheduling tabs">
          <Tab label="Programar a Artista" />
          <Tab label="Programar a Grupo" />
        </Tabs>

        {/* Tab de Artistas */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Selectores para artista */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccionar Artista
                </Typography>
                <select
                  value={selectedArtist}
                  onChange={(e) => handleArtistChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                  disabled={loading}
                >
                  <option value="">Selecciona un artista</option>
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.stageName || 'Sin nombre'} - {artist.status}
                    </option>
                  ))}
                </select>
              </Box>

              <Box sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccionar Actividad
                </Typography>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                  disabled={loading}
                >
                  <option value="">Selecciona una actividad</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.classification || 'Sin nombre'} ({activity.type})
                    </option>
                  ))}
                </select>
              </Box>

              <Button
                variant="contained"
                onClick={handleScheduleArtist}
                disabled={loading || !selectedArtist || !selectedActivity}
                startIcon={loading ? <CircularProgress size={20} /> : <Icon name="calendar" size={18} />}
                sx={{ 
                  mt: 2,
                  alignSelf: 'flex-start',
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                {loading ? 'Programando...' : 'Programar Actividad'}
              </Button>
            </Box>

            {/* Tabla de actividades del artista */}
            {selectedArtist && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Actividades Programadas para {artists.find(a => a.id === selectedArtist)?.stageName || 'Artista'}
                </Typography>
                {artistActivities.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography color="textSecondary">
                      Este artista no tiene actividades programadas aún.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={prepareArtistActivities()}
                      columns={artistActivityColumns}
                      loading={loading}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                      getRowId={(row) => row.id || Math.random()}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Tab de Grupos */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Selectores para grupo */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccionar Grupo
                </Typography>
                <select
                  value={selectedGroup}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                  disabled={loading}
                >
                  <option value="">Selecciona un grupo</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.status})
                    </option>
                  ))}
                </select>
              </Box>

              <Box sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccionar Actividad
                </Typography>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                  disabled={loading}
                >
                  <option value="">Selecciona una actividad</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.classification} ({activity.type})
                    </option>
                  ))}
                </select>
              </Box>

              <Button
                variant="contained"
                onClick={handleScheduleGroup}
                disabled={loading || !selectedGroup || !selectedActivity}
                startIcon={loading ? <CircularProgress size={20} /> : <Icon name="calendar" size={18} />}
                sx={{ 
                  mt: 2,
                  alignSelf: 'flex-start',
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976D2' }
                }}
              >
                {loading ? 'Programando...' : 'Programar Actividad'}
              </Button>
            </Box>

            {/* Tabla de actividades del grupo */}
            {selectedGroup && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Actividades Programadas para {groups.find(g => g.id === selectedGroup)?.name || 'Grupo'}
                </Typography>
                {groupActivities.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography color="textSecondary">
                      Este grupo no tiene actividades programadas aún.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={prepareGroupActivities()}
                      columns={groupActivityColumns}
                      loading={loading}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                      getRowId={(row) => row.id || Math.random()}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>

      
    </Box>
  );
};

export default ActivitySchedulingView;