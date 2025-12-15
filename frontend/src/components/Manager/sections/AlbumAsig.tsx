import React, { useState, useEffect } from "react";
import { useAlbum } from "../../../context/AlbumContext";
import { useAgency } from "../../../context/AgencyContext";
import { useAuth } from "../../../context/AuthContext";
import { Tabs, Tab, Box, Typography, Paper, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`album-assign-tabpanel-${index}`}
      aria-labelledby={`album-assign-tab-${index}`}
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

const AlbumAssignmentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    assignAlbumToArtist,
    assignAlbumToGroup,
    fetchAlbumsByArtist,
    fetchAlbumsByGroup,
    artistAlbums,
    groupAlbums,
    albums,
    fetchAlbums,
    loading: albumLoading,
    error: albumError,
    clearError: clearAlbumError
  } = useAlbum();

  const {
    artistsWithGroup,
    fetchArtistsWithGroup,
    loading: agencyLoading,
    error: agencyError,
    clearError: clearAgencyError,
    agencies
  } = useAgency();

  // Obtener el usuario autenticado y su agencia
  const { user } = useAuth();
  const userAgencyId = user?.agency;

  const [selectedArtist, setSelectedArtist] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [agencyGroups, setAgencyGroups] = useState<any[]>([]);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
    open: boolean;
  }>({ type: "info", message: "", open: false });

  // Obtener nombre de la agencia del usuario
  const getUserAgencyName = () => {
    if (!userAgencyId) return "Sin agencia asignada";
    const agency = agencies.find(a => a.id === userAgencyId);
    return agency?.nameAgency || "Agencia no encontrada";
  };

  // Cargar datos iniciales: álbumes y artistas/grupos de la agencia del usuario
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAlbums();
        
        // Cargar artistas y grupos de la agencia del usuario
        if (userAgencyId) {
          await fetchArtistsWithGroup(userAgencyId);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        showNotification("error", "No se pudieron cargar los datos iniciales");
      }
    };
    loadData();
  }, [userAgencyId]);

  // Extraer grupos únicos de artistsWithGroup
  useEffect(() => {
    if (artistsWithGroup && artistsWithGroup.length > 0) {
      const groupsMap = new Map();
      artistsWithGroup.forEach(item => {
        if (item.group) {
          groupsMap.set(item.group.id, item.group);
        }
      });
      setAgencyGroups(Array.from(groupsMap.values()));
    } else {
      setAgencyGroups([]);
    }
  }, [artistsWithGroup]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    clearAlbumError();
    clearAgencyError();
    setNotification({ ...notification, open: false });
  };

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message, open: true });
    setTimeout(() => setNotification({ ...notification, open: false }), 5000);
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Función para asignar álbum a artista
  const handleAssignToArtist = async () => {
    if (!selectedArtist || !selectedAlbum) {
      showNotification("error", "Por favor selecciona un artista y un álbum");
      return;
    }

    try {
      await assignAlbumToArtist({
        albumId: selectedAlbum,
        artistId: selectedArtist,
      });
      
      // Actualizar álbumes del artista
      await fetchAlbumsByArtist(selectedArtist);
      
      showNotification("success", "Álbum asignado exitosamente al artista");
      setSelectedAlbum("");
    } catch (err: any) {
      console.error("Error completo:", err);
      showNotification("error", err.message || "Error al asignar el álbum");
    }
  };

  // Función para asignar álbum a grupo
  const handleAssignToGroup = async () => {
    if (!selectedGroup || !selectedAlbum) {
      showNotification("error", "Por favor selecciona un grupo y un álbum");
      return;
    }

    try {
      await assignAlbumToGroup({
        albumId: selectedAlbum,
        groupId: selectedGroup,
      });
      
      // Actualizar álbumes del grupo
      await fetchAlbumsByGroup(selectedGroup);
      
      showNotification("success", "Álbum asignado exitosamente al grupo");
      setSelectedAlbum("");
    } catch (err: any) {
      console.error("Error completo:", err);
      showNotification("error", err.message || "Error al asignar el álbum");
    }
  };

  // Cargar álbumes del artista/grupo seleccionado
  const handleArtistChange = async (artistId: string) => {
    setSelectedArtist(artistId);
    setSelectedAlbum(""); // Limpiar álbum seleccionado al cambiar artista
    if (artistId) {
      try {
        await fetchAlbumsByArtist(artistId);
      } catch (err) {
        console.error("Error loading artist albums:", err);
        showNotification("error", "No se pudieron cargar los álbumes del artista");
      }
    }
  };

  const handleGroupChange = async (groupId: string) => {
    setSelectedGroup(groupId);
    setSelectedAlbum(""); // Limpiar álbum seleccionado al cambiar grupo
    if (groupId) {
      try {
        await fetchAlbumsByGroup(groupId);
      } catch (err) {
        console.error("Error loading group albums:", err);
        showNotification("error", "No se pudieron cargar los álbumes del grupo");
      }
    }
  };

  // Función para obtener el nombre del artista por ID
  const getArtistName = (artistId?: string) => {
    if (!artistId) return 'Sin artista';
    const artistWithGroup = artistsWithGroup.find(item => item.artist?.id === artistId);
    return artistWithGroup?.artist?.stageName || 'Artista sin nombre';
  };

  // Función para obtener el nombre del grupo por ID
  const getGroupName = (groupId?: string) => {
    if (!groupId) return 'Sin grupo';
    const group = agencyGroups.find(g => g.id === groupId);
    return group ? group.name || 'Grupo sin nombre' : 'Grupo no encontrado';
  };

  // Formatear fechas para la tabla
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES");
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const prepareArtistAlbums = () => {
    return artistAlbums.map(album => ({
      ...album,
      releaseDate: formatDate(album.releaseDate?.toString()),
      artistName: getArtistName(album.artistId),
      groupName: getGroupName(album.groupId),
      formattedCopiesSold: album.copiesSold?.toLocaleString() || '0'
    }));
  };

  const prepareGroupAlbums = () => {
    return groupAlbums.map(album => ({
      ...album,
      releaseDate: formatDate(album.releaseDate?.toString()),
      artistName: getArtistName(album.artistId),
      groupName: getGroupName(album.groupId),
      formattedCopiesSold: album.copiesSold?.toLocaleString() || '0'
    }));
  };

  const albumColumnsGroup: GridColDef[] = [
    { 
      field: 'title', 
      headerName: 'Título', 
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'mainProducer', 
      headerName: 'Productor Principal', 
      width: 180 
    },
    { 
      field: 'releaseDate', 
      headerName: 'Fecha Lanzamiento', 
      width: 160 
    },
    { 
      field: 'formattedCopiesSold', 
      headerName: 'Copias Vendidas', 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {params.value}
        </Typography>
      )
    },
    
    { 
      field: 'groupName', 
      headerName: 'Grupo', 
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontStyle: params.value === 'Sin grupo' ? 'italic' : 'normal' }}>
          {params.value}
        </Typography>
      )
    },
  ];

  const albumColumnsArtist: GridColDef[] = [
    { 
      field: 'title', 
      headerName: 'Título', 
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'mainProducer', 
      headerName: 'Productor Principal', 
      width: 180 
    },
    { 
      field: 'releaseDate', 
      headerName: 'Fecha Lanzamiento', 
      width: 160 
    },
    { 
      field: 'formattedCopiesSold', 
      headerName: 'Copias Vendidas', 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'artistName', 
      headerName: 'Artista', 
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontStyle: params.value === 'Sin artista' ? 'italic' : 'normal' }}>
          {params.value}
        </Typography>
      )
    },
    
  ];

  const loading = albumLoading || agencyLoading;
  const error = albumError || agencyError;

  const clearError = () => {
    clearAlbumError();
    clearAgencyError();
  };

  // Verificar si el usuario tiene agencia asignada
  if (!userAgencyId) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Asignación de Álbumes
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          No tienes una agencia asignada. Contacta con el administrador.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Asignación de Álbumes
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

      {/* Información de la agencia del usuario */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
        <Typography variant="subtitle1">
          <strong>Agencia:</strong> {getUserAgencyName()}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          <strong>Usuario:</strong> {user?.username} | <strong>Rol:</strong> {user?.role}
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="album assignment tabs">
          <Tab label="Asignar a Artista" />
          <Tab label="Asignar a Grupo" />
        </Tabs>

        {/* Tab de Asignación a Artista */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Selectores para artista */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccionar Artista de tu Agencia
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
                  {artistsWithGroup
                    .filter(item => item.artist)
                    .map((item) => (
                      <option key={item.artist.id} value={item.artist.id}>
                        {item.artist.stageName || 'Sin nombre'} - {item.artist.status}
                      </option>
                    ))}
                </select>
                {artistsWithGroup.length === 0 && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    No hay artistas disponibles en tu agencia
                  </Typography>
                )}
              </Box>

              <Box sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccionar Álbum
                </Typography>
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                  disabled={loading || !selectedArtist}
                >
                  <option value="">Selecciona un álbum</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title} ({album.mainProducer})
                    </option>
                  ))}
                </select>
                {albums.length === 0 && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    No hay álbumes disponibles
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                onClick={handleAssignToArtist}
                disabled={loading || !selectedArtist || !selectedAlbum}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ 
                  mt: 2,
                  alignSelf: 'flex-start',
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                {loading ? 'Asignando...' : 'Asignar Álbum'}
              </Button>
            </Box>

            {/* Tabla de álbumes del artista */}
            {selectedArtist && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Álbumes Asignados a {getArtistName(selectedArtist)}
                </Typography>
                {artistAlbums.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography color="textSecondary">
                      Este artista no tiene álbumes asignados aún.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={prepareArtistAlbums()}
                      columns={albumColumnsArtist}
                      loading={loading}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                      getRowId={(row) => row.id}
                      sx={{
                        '& .MuiDataGrid-cell': {
                          borderBottom: '1px solid #e0e0e0',
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Tab de Asignación a Grupo */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Selectores para grupo */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccionar Grupo de tu Agencia
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
                  {agencyGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.status})
                    </option>
                  ))}
                </select>
                {agencyGroups.length === 0 && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    No hay grupos disponibles en tu agencia
                  </Typography>
                )}
              </Box>

              <Box sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccionar Álbum
                </Typography>
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                  disabled={loading || !selectedGroup}
                >
                  <option value="">Selecciona un álbum</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title} ({album.mainProducer})
                    </option>
                  ))}
                </select>
                {albums.length === 0 && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    No hay álbumes disponibles
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                onClick={handleAssignToGroup}
                disabled={loading || !selectedGroup || !selectedAlbum}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ 
                  mt: 2,
                  alignSelf: 'flex-start',
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976D2' }
                }}
              >
                {loading ? 'Asignando...' : 'Asignar Álbum'}
              </Button>
            </Box>

            {/* Tabla de álbumes del grupo */}
            {selectedGroup && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Álbumes Asignados a {getGroupName(selectedGroup)}
                </Typography>
                {groupAlbums.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography color="textSecondary">
                      Este grupo no tiene álbumes asignados aún.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={prepareGroupAlbums()}
                      columns={albumColumnsGroup}
                      loading={loading}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                      getRowId={(row) => row.id}
                      sx={{
                        '& .MuiDataGrid-cell': {
                          borderBottom: '1px solid #e0e0e0',
                        },
                      }}
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

export default AlbumAssignmentView;