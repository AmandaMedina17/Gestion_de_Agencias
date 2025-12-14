import React, { useState, useEffect, useMemo } from "react";
import { useActivityScheduling } from "../../../context/ActivitySchedulingContext";
import { useAuth } from "../../../context/AuthContext";
import { useActivity } from "../../../context/ActivityContext";
import { Box, Typography, Paper, CircularProgress, Alert, Snackbar } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ActivityResponseDto } from "../../../../../backend/src/ApplicationLayer/DTOs/activityDto/response-activity.dto";
import { useArtist } from "../../../context/ArtistContext";

interface NotificationState {
  type: "success" | "error" | "info";
  message: string;
  open: boolean;
}

const ArtistActivitiesView: React.FC = () => {
  const {
    getArtistActivities,
    artistActivities,
    loading,
    error,
    clearError
  } = useActivityScheduling();

  const { user } = useAuth();
  const { artists, fetchArtists } = useArtist();
  const { activities, fetchActivities } = useActivity();
  
  const [notification, setNotification] = useState<NotificationState>({
    type: "info",
    message: "",
    open: false
  });

  // Estado para el artista actual (obtenido del usuario logueado)
  const [currentArtistId, setCurrentArtistId] = useState<string>("");

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Verificar que el usuario tenga un artista asociado
        if (user?.artist) {
          setCurrentArtistId(user.artist);
          
          // 2. Cargar artistas y actividades
          await Promise.all([
            fetchArtists(),
            fetchActivities()
          ]);
          
          // 3. Cargar actividades del artista
          await getArtistActivities(user.artist);
        } else {
          showNotification("info", "No tienes un artista asociado a tu cuenta");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        showNotification("error", "No se pudieron cargar las actividades");
      }
    };
    
    loadData();
  }, [user]);

  // Obtener el nombre del artista usando useMemo
  const memoizedArtistName = useMemo(() => {
    if (!currentArtistId || !artists.length) return "Artista";
    const artist = artists.find(a => a.id === currentArtistId);
    return artist ? artist.stageName : "No encontrado";
  }, [currentArtistId, artists]);

  // Recargar actividades cuando cambia el artista
  useEffect(() => {
    if (currentArtistId) {
      const refreshActivities = async () => {
        try {
          await getArtistActivities(currentArtistId);
        } catch (err) {
          console.error("Error refreshing activities:", err);
        }
      };
      
      refreshActivities();
    }
  }, [currentArtistId]);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message, open: true });
    setTimeout(() => setNotification({ ...notification, open: false }), 5000);
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Formatear fechas para la tabla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("es-ES");
  };

  // Obtener información detallada de la actividad
  const getActivityDetails = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    return activity || null;
  };

  // Preparar datos para la tabla
  const prepareActivities = () => {
    if (!artistActivities.length) return [];
    
    return (artistActivities as ActivityResponseDto[]).map(item => {
      const activityDetails = getActivityDetails(item.id);
      return {
        ...item,
        id: item.id || Math.random().toString(),
        activityType: activityDetails?.type || item.type || 'N/A',
        classification: activityDetails?.classification || item.classification || 'N/A',
        formattedDate: item.dates ? formatDate(item.dates.toString()) : 'No programada',
      };
    });
  };

  // Columnas para la tabla de actividades
  const activityColumns: GridColDef[] = [
    { 
      field: 'classification', 
      headerName: 'Actividad', 
      width: 250,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'formattedDate', 
      headerName: 'Fecha Programada', 
      width: 200
    },
    {
      field: 'type',
      headerName: 'Tipo',
      width:200,

    }
  ];

  // Si no hay artista asociado
  if (!currentArtistId) {
    return (
      <Box sx={{ width: '100%', p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          No tienes un artista asociado a tu cuenta
        </Typography>
        <Typography variant="body1">
          Contacta con tu administrador para que asocie un artista a tu usuario.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Mis Actividades Programadas
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

      <Paper sx={{ width: '100%', mb: 2, p: 3 }}>
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            
            <Box>
              <Typography variant="caption" color="textSecondary">
                Actividades Programadas
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {artistActivities.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Última Actualización
              </Typography>
              <Typography variant="body1">
                {new Date().toLocaleDateString('es-ES')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabla de actividades */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Lista de Actividades
        </Typography>
        
        {loading && artistActivities.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : artistActivities.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#fafafa', borderRadius: 1 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No tienes actividades programadas
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tus actividades aparecerán aquí cuando sean programadas por tu agencia.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 500, width: '100%', mt: 2 }}>
            <DataGrid
              rows={prepareActivities()}
              columns={activityColumns}
              loading={loading}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
                sorting: {
                  sortModel: [{ field: 'formattedDate', sort: 'asc' }],
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        )}

        {/* Resumen estadístico */}
        {artistActivities.length > 0 && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Resumen
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Próxima Actividad
                </Typography>
                
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Actividades Pendientes
                </Typography>
                
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Actividades Completadas
                </Typography>
               
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ArtistActivitiesView;