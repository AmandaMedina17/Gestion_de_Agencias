// CollaborationManagement.tsx - Versión optimizada usando grupos de la agencia
import React, { useState, useEffect, useMemo } from "react";
import { useCollaboration } from "../../../context/CollaborationContext";
import { useAgency } from "../../../context/AgencyContext";
import { useGroup } from "../../../context/GroupContext";
import { useAuth } from "../../../context/AuthContext";
import GenericTable, { Column } from "../../ui/datatable";
import CreateModal, { FormField } from "../../ui/reusable/CreateModal";
import EditModal from "../../ui/reusable/EditModal";
import DeleteModal from "../../ui/reusable/DeleteModal";
import ViewModal from "../../ui/reusable/ViewModal";
import { 
  Tabs, 
  Tab, 
  Box, 
  Paper, 
  Typography, 
  Alert, 
  Chip, 
  IconButton, 
  Tooltip, 
  Button,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';

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
      id={`collaboration-tabpanel-${index}`}
      aria-labelledby={`collaboration-tab-${index}`}
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

const CollaborationManagement: React.FC = () => {
  // Contexto de Colaboraciones (para operaciones CRUD)
  const {
    createArtistCollaboration,
    createArtistGroupCollaboration,
    updateArtistCollaboration,
    updateArtistGroupCollaboration,
    deleteArtistCollaboration,
    deleteArtistGroupCollaboration,
    artistGroupCollaborations,
    fetchArtistGroupCollaborations,
    loading: collaborationLoading,
    error: collaborationError
  } = useCollaboration();

  // Contexto de Agencias (para obtener datos)
  const { 
    collaborations,
    loading: agencyLoading,
    error: agencyError,
    fetchAgencyCollaborations,
    fetchAgencyArtists,
    fetchAllArtists,
    artists: agencyArtists,
    artistsWithGroup
  } = useAgency();
  
  const { groups, fetchGroups } = useGroup();
  const { user } = useAuth();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [showCreateArtistCollabModal, setShowCreateArtistCollabModal] = useState(false);
  const [showCreateGroupCollabModal, setShowCreateGroupCollabModal] = useState(false);
  const [editingArtistCollab, setEditingArtistCollab] = useState<any | null>(null);
  const [editingGroupCollab, setEditingGroupCollab] = useState<any | null>(null);
  const [deletingArtistCollab, setDeletingArtistCollab] = useState<any | null>(null);
  const [deletingGroupCollab, setDeletingGroupCollab] = useState<any | null>(null);
  const [viewingArtistCollab, setViewingArtistCollab] = useState<any | null>(null);
  const [viewingGroupCollab, setViewingGroupCollab] = useState<any | null>(null);
  const [availableArtists, setAvailableArtists] = useState<any[]>([]);
  const [availableGroups, setAvailableGroups] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Filtrar grupos por agencia del usuario (usando useMemo para optimización)
  const agencyGroups = useMemo(() => {
    if (!user?.agency) return [];
    return groups.filter(group => group.agencyID === user.agency);
  }, [groups, user?.agency]);

  // Cargar datos una sola vez cuando cambie la agencia del usuario
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.agency && !dataLoaded) {
          console.log("Cargando datos de colaboraciones...");
          console.log(collaborations.artistGroupCollaborations.length);
          const group = await fetchArtistGroupCollaborations(user.agency);
          console.log(artistGroupCollaborations);
          // Cargar grupos de todas las agencias
          await fetchGroups();
          
          // Filtrar grupos por la agencia del usuario
          const filteredGroups = groups.filter(group => group.agencyID === user.agency);
          setAvailableGroups(filteredGroups);
          
          // Obtener artistas de la agencia
          const artistsData = await fetchAgencyArtists(user.agency);
          if (artistsData) {
            setAvailableArtists(artistsData);
          } else {
            // Si no hay artistas del contexto, extraer de artistsWithGroup
            const artistsFromGroup = artistsWithGroup.map(item => item.artist).filter((artist, index, self) =>
              index === self.findIndex(a => a.id === artist.id)
            );
            setAvailableArtists(artistsFromGroup);
          }
          
          // Obtener colaboraciones de la agencia
          await fetchAgencyCollaborations(user.agency);
          
          setDataLoaded(true);
          console.log("Datos cargados exitosamente");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        showError("Error", "No se pudieron cargar los datos");
      }
    };
    
    loadData();
  }, [user?.agency, groups]); // Depende de user?.agency y groups

  // Recargar colaboraciones cuando se realicen operaciones CRUD
  const reloadCollaborations = async () => {
    if (user?.agency) {
      await fetchAgencyCollaborations(user.agency);
    }
  };

  // Resetear dataLoaded cuando cambia la agencia del usuario
  useEffect(() => {
    if (user?.agency) {
      setDataLoaded(false);
      setAvailableArtists([]);
      setAvailableGroups([]);
    }
  }, [user?.agency]);

  // Funciones para mostrar notificaciones
  const showNotification = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string
  ) => {
    setNotification({ type, title, message });
  };

  const showSuccess = (title: string, message: string) => {
    showNotification("success", title, message);
  };

  const showError = (title: string, message: string) => {
    showNotification("error", title, message);
  };

  // Campos para colaboración artista-artista
  const artistCollabFields: FormField[] = useMemo(() => [
    {
      name: "artist1Id",
      label: "Artista 1",
      type: "autocomplete",
      required: true,
      options: availableArtists.map(artist => ({
        value: artist.id,
        label: `${artist.stageName} (ID: ${artist.id})`,
      })),
      validate: (value) => {
        if (!value) return "Selecciona el primer artista";
        return null;
      },
    },
    {
      name: "artist2Id",
      label: "Artista 2",
      type: "autocomplete",
      required: true,
      options: availableArtists.map(artist => ({
        value: artist.id,
        label: `${artist.stageName} (ID: ${artist.id})`,
      })),
      validate: (value, formData) => {
        if (!value) return "Selecciona el segundo artista";
        if (formData && value === formData.artist1Id) return "Los artistas deben ser diferentes";
        return null;
      },
    },
    {
      name: "date",
      label: "Fecha de Colaboración",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha es requerida";
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      },
    },
  ], [availableArtists]);

  const artistCollabEditFields = useMemo(() => [...artistCollabFields], [artistCollabFields]);

  // Campos para colaboración artista-grupo
  const groupCollabFields: FormField[] = useMemo(() => [
    {
      name: "artistId",
      label: "Artista",
      type: "autocomplete",
      required: true,
      options: availableArtists.map(artist => ({
        value: artist.id,
        label: `${artist.stageName} (ID: ${artist.id})`,
      })),
      validate: (value) => {
        if (!value) return "Selecciona un artista";
        return null;
      },
    },
    {
      name: "groupId",
      label: "Grupo",
      type: "autocomplete",
      required: true,
      options: agencyGroups.map(group => ({
        value: group.id,
        label: `${group.name} (ID: ${group.id})`,
      })),
      validate: (value) => {
        if (!value) return "Selecciona un grupo";
        return null;
      },
    },
    {
      name: "date",
      label: "Fecha de Colaboración",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha es requerida";
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      },
    },
  ], [availableArtists, agencyGroups]);

  const groupCollabEditFields = useMemo(() => [...groupCollabFields], [groupCollabFields]);

  // Manejar creación de colaboración artista-artista
  const handleCreateArtistCollab = async (data: Record<string, any>) => {
    try {
      await createArtistCollaboration({
        artist1Id: data.artist1Id,
        artist2Id: data.artist2Id,
        date: new Date(data.date),
      });
      
      showSuccess("¡Colaboración Creada!", "La colaboración entre artistas se ha creado exitosamente.");
      setShowCreateArtistCollabModal(false);
      
      // Recargar colaboraciones de la agencia
      await reloadCollaborations();
    } catch (err: any) {
      showError("Error al Crear", err.message || "No se pudo crear la colaboración.");
    }
  };

  // Manejar creación de colaboración artista-grupo
  const handleCreateGroupCollab = async (data: Record<string, any>) => {
    try {
      await createArtistGroupCollaboration({
        artistId: data.artistId,
        groupId: data.groupId,
        date: new Date(data.date),
      });
      
      showSuccess("¡Colaboración Creada!", "La colaboración entre artista y grupo se ha creado exitosamente.");
      setShowCreateGroupCollabModal(false);
      
      // Recargar colaboraciones de la agencia
      await reloadCollaborations();
    } catch (err: any) {
      showError("Error al Crear", err.message || "No se pudo crear la colaboración.");
    }
  };

  // Función para actualizar colaboración artista-artista
  const handleUpdateArtistCollab = async (id: string | number, data: Record<string, any>) => {
    if (!editingArtistCollab) return;
    
    try {
      // Extraer IDs originales de la colaboración que se está editando
      const [artist1Id, artist2Id] = typeof id === 'string' ? id.split('-') : [editingArtistCollab.artist1?.id, editingArtistCollab.artist2?.id];
      const originalDate = new Date(editingArtistCollab.date);
      
      await updateArtistCollaboration(
        artist1Id,
        artist2Id,
        originalDate,
        {
          artist1Id: data.artist1Id,
          artist2Id: data.artist2Id,
          date: new Date(data.date),
        }
      );
      
      showSuccess("¡Colaboración Actualizada!", "La colaboración entre artistas se ha actualizado exitosamente.");
      setEditingArtistCollab(null);
      
      // Recargar colaboraciones de la agencia
      await reloadCollaborations();
    } catch (err: any) {
      showError("Error al Actualizar", err.message || "No se pudo actualizar la colaboración.");
    }
  };

  // Función para actualizar colaboración artista-grupo
  const handleUpdateGroupCollab = async (id: string | number, data: Record<string, any>) => {
    if (!editingGroupCollab) return;
    
    try {
      // Extraer IDs originales de la colaboración que se está editando
      const [artistId, groupId] = typeof id === 'string' ? id.split('-') : [editingGroupCollab.artist?.id, editingGroupCollab.group?.id];
      const originalDate = new Date(editingGroupCollab.date);
      
      await updateArtistGroupCollaboration(
        artistId,
        groupId,
        originalDate,
        {
          artistId: data.artistId,
          groupId: data.groupId,
          date: new Date(data.date),
        }
      );
      
      showSuccess("¡Colaboración Actualizada!", "La colaboración entre artista y grupo se ha actualizada exitosamente.");
      setEditingGroupCollab(null);
      
      // Recargar colaboraciones de la agencia
      await reloadCollaborations();
    } catch (err: any) {
      showError("Error al Actualizar", err.message || "No se pudo actualizar la colaboración.");
    }
  };

  // Manejar eliminación de colaboración artista-artista
  const handleDeleteArtistCollab = async () => {
    if (!deletingArtistCollab) return;
    try {
      await deleteArtistCollaboration(
        deletingArtistCollab.artist1?.id,
        deletingArtistCollab.artist2?.id,
        new Date(deletingArtistCollab.date)
      );
      
      showSuccess("¡Colaboración Eliminada!", "La colaboración entre artistas se ha eliminado exitosamente.");
      setDeletingArtistCollab(null);
      
      // Recargar colaboraciones de la agencia
      await reloadCollaborations();
    } catch (err: any) {
      showError("Error al Eliminar", err.message || "No se pudo eliminar la colaboración.");
    }
  };

  // Manejar eliminación de colaboración artista-grupo
  const handleDeleteGroupCollab = async () => {
    if (!deletingGroupCollab) return;
    try {
      await deleteArtistGroupCollaboration(
        deletingGroupCollab.artist?.id,
        deletingGroupCollab.group?.id,
        new Date(deletingGroupCollab.date)
      );
      
      showSuccess("¡Colaboración Eliminada!", "La colaboración entre artista y grupo se ha eliminado exitosamente.");
      setDeletingGroupCollab(null);
      
      // Recargar colaboraciones de la agencia
      await reloadCollaborations();
    } catch (err: any) {
      showError("Error al Eliminar", err.message || "No se pudo eliminar la colaboración.");
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Columnas para colaboraciones artista-artista
  const artistCollabColumns: Column<any>[] = useMemo(() => [
    {
      key: "artist1",
      title: "Artista 1",
      sortable: true,
      width: "25%",
      align: "center",
      render: (item) => (
        <Box className="collab-artist-info">
          <Typography variant="subtitle1" fontWeight="bold">
            {item.artist1?.stageName || "Artista desconocido"}
          </Typography>
          {item.artist1?.id && (
            <Chip 
              label={`ID: ${item.artist1.id}`} 
              size="small" 
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      ),
    },
    {
      key: "artist2",
      title: "Artista 2",
      sortable: true,
      width: "25%",
      align: "center",
      render: (item) => (
        <Box className="collab-artist-info">
          <Typography variant="subtitle1" fontWeight="bold">
            {item.artist2?.stageName || "Artista desconocido"}
          </Typography>
          {item.artist2?.id && (
            <Chip 
              label={`ID: ${item.artist2.id}`} 
              size="small" 
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      ),
    },
    {
      key: "date",
      title: "Fecha de Colaboración",
      sortable: true,
      width: "20%",
      align: "center",
      render: (item) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(item.date)}
        </Typography>
      ),
    },
  ], []);

  // Columnas para colaboraciones artista-grupo
  const groupCollabColumns: Column<any>[] = useMemo(() => [
    {
      key: "artist",
      title: "Artista",
      sortable: true,
      width: "25%",
      align: "center",
      render: (item) => (
        <Box className="collab-artist-info">
          <Typography variant="subtitle1" fontWeight="bold">
            {item.artist?.stageName || "Artista desconocido"}
          </Typography>
          {item.artist?.id && (
            <Chip 
              label={`ID: ${item.artist.id}`} 
              size="small" 
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      ),
    },
    {
      key: "group",
      title: "Grupo",
      sortable: true,
      width: "25%",
      align: "center",
      render: (item) => (
        <Box className="collab-group-info">
          <Typography variant="subtitle1" fontWeight="bold">
            {item.group?.name || "Grupo desconocido"}
          </Typography>
          {item.group?.id && (
            <Chip 
              label={`ID: ${item.group.id}`} 
              size="small" 
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      ),
    },
    {
      key: "date",
      title: "Fecha de Colaboración",
      sortable: true,
      width: "20%",
      align: "center",
      render: (item) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(item.date)}
        </Typography>
      ),
    },
  ], []);

  // Renderizar acciones para colaboraciones artista-artista
  const renderArtistCollabActions = (item: any) => (
    <Box className="collab-actions">
      <Tooltip title="Ver detalles">
        <IconButton
          size="small"
          onClick={() => setViewingArtistCollab(item)}
          color="info"
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar">
        <IconButton
          size="small"
          onClick={() => setEditingArtistCollab(item)}
          color="primary"
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eliminar">
        <IconButton
          size="small"
          onClick={() => setDeletingArtistCollab(item)}
          color="error"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  // Renderizar acciones para colaboraciones artista-grupo
  const renderGroupCollabActions = (item: any) => (
    <Box className="collab-actions">
      <Tooltip title="Ver detalles">
        <IconButton
          size="small"
          onClick={() => setViewingGroupCollab(item)}
          color="info"
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar">
        <IconButton
          size="small"
          onClick={() => setEditingGroupCollab(item)}
          color="primary"
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eliminar">
        <IconButton
          size="small"
          onClick={() => setDeletingGroupCollab(item)}
          color="error"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const loading = collaborationLoading || agencyLoading || !dataLoaded;
  const error = collaborationError || agencyError;

  if (loading && !dataLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <section id="collaboration_management" className="content-section active">
      <Typography variant="h4" gutterBottom>
        🎭 Gestión de Colaboraciones
      </Typography>
      
      {user?.agency ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            Mostrando colaboraciones de la agencia actual. Solo puedes gestionar colaboraciones entre artistas y grupos de tu agencia.
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ width: '100%', mb: 2, boxShadow: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="collaboration tabs"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }
              }}
            >
              <Tab 
                icon={<span>🎤</span>}
                iconPosition="start"
                label={`Artista-Artista (${collaborations?.artistCollaborations?.length || 0})`} 
                id="collaboration-tab-0"
              />
              <Tab 
                icon={<span>👥</span>}
                iconPosition="start"
                label={`Artista-Grupo (${collaborations?.artistGroupCollaborations?.length || 0})`} 
                id="collaboration-tab-1"
              />
            </Tabs>

            {/* Pestaña de colaboraciones artista-artista */}
            <TabPanel value={activeTab} index={0}>
              {/* Botón de crear fuera de la tabla */}
              {availableArtists.length > 1 && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setShowCreateArtistCollabModal(true)}
                    disabled={loading}
                    sx={{ 
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                  >
                    Crear Colaboración Artista-Artista
                  </Button>
                </Box>
              )}
              
              <GenericTable<any>
                title="Colaboraciones entre Artistas"
                description="Colaboraciones entre artistas de tu agencia"
                data={collaborations?.artistCollaborations || []}
                columns={artistCollabColumns}
                loading={loading}
                onReload={reloadCollaborations}
                showCreateForm={showCreateArtistCollabModal}
                onShowCreateChange={setShowCreateArtistCollabModal}
                editingItem={editingArtistCollab}
                onEditingChange={setEditingArtistCollab}
                deletingItem={deletingArtistCollab}
                onDeletingChange={setDeletingArtistCollab}
                itemsPerPage={10}
                className="collaboration-table"
                notification={notification || undefined}
                onNotificationClose={() => setNotification(null)}
                showActionsColumn={true}
                showCreateButton={false}
                showSearch={true}
                showReloadButton={true}
                renderCustomActions={renderArtistCollabActions}
              />
              
              {availableArtists.length <= 1 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Necesitas al menos 2 artistas en tu agencia para crear colaboraciones entre artistas.
                </Alert>
              )}
            </TabPanel>

            {/* Pestaña de colaboraciones artista-grupo */}
            <TabPanel value={activeTab} index={1}>
              {/* Botón de crear fuera de la tabla */}
              {availableArtists.length > 0 && agencyGroups.length > 0 && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setShowCreateGroupCollabModal(true)}
                    disabled={loading}
                    sx={{ 
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                  >
                    Crear Colaboración Artista-Grupo
                  </Button>
                </Box>
              )}
              
              <GenericTable<any>
                title="Colaboraciones Artista-Grupo"
                description="Colaboraciones entre artistas y grupos de tu agencia"
                data={collaborations?.artistGroupCollaborations || []}
                columns={groupCollabColumns}
                loading={loading}
                onReload={reloadCollaborations}
                showCreateForm={showCreateGroupCollabModal}
                onShowCreateChange={setShowCreateGroupCollabModal}
                editingItem={editingGroupCollab}
                onEditingChange={setEditingGroupCollab}
                deletingItem={deletingGroupCollab}
                onDeletingChange={setDeletingGroupCollab}
                itemsPerPage={10}
                className="collaboration-table"
                notification={notification || undefined}
                onNotificationClose={() => setNotification(null)}
                showActionsColumn={true}
                showCreateButton={false}
                showSearch={true}
                showReloadButton={true}
                renderCustomActions={renderGroupCollabActions}
              />
              
              {availableArtists.length === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No hay artistas en tu agencia para crear colaboraciones.
                </Alert>
              )}
              
              {agencyGroups.length === 0 && availableArtists.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No hay grupos en tu agencia para crear colaboraciones.
                </Alert>
              )}
            </TabPanel>
          </Paper>

          {/* Modal para crear colaboración artista-artista */}
          {showCreateArtistCollabModal && (
            <CreateModal
              title="🎭 Crear Colaboración Artista-Artista"
              fields={artistCollabFields}
              initialData={{
                artist1Id: "",
                artist2Id: "",
                date: new Date().toISOString().split("T")[0],
              }}
              onSubmit={handleCreateArtistCollab}
              onClose={() => setShowCreateArtistCollabModal(false)}
              loading={loading}
              submitText="Crear Colaboración"
            />
          )}

          {/* Modal para crear colaboración artista-grupo */}
          {showCreateGroupCollabModal && (
            <CreateModal
              title="👥 Crear Colaboración Artista-Grupo"
              fields={groupCollabFields}
              initialData={{
                artistId: "",
                groupId: "",
                date: new Date().toISOString().split("T")[0],
              }}
              onSubmit={handleCreateGroupCollab}
              onClose={() => setShowCreateGroupCollabModal(false)}
              loading={loading}
              submitText="Crear Colaboración"
            />
          )}

          {/* Modal para editar colaboración artista-artista */}
          {editingArtistCollab && (
            <EditModal
              title="✏️ Editar Colaboración Artista-Artista"
              fields={artistCollabEditFields}
              initialData={{
                artist1Id: editingArtistCollab.artist1?.id || "",
                artist2Id: editingArtistCollab.artist2?.id || "",
                date: editingArtistCollab.date ? 
                  new Date(editingArtistCollab.date).toISOString().split("T")[0] : 
                  new Date().toISOString().split("T")[0],
              }}
              itemId={`${editingArtistCollab.artist1?.id || ""}-${editingArtistCollab.artist2?.id || ""}`}
              onSubmit={handleUpdateArtistCollab}
              onClose={() => setEditingArtistCollab(null)}
              loading={loading}
              submitText="Actualizar Colaboración"
            />
          )}

          {/* Modal para editar colaboración artista-grupo */}
          {editingGroupCollab && (
            <EditModal
              title="✏️ Editar Colaboración Artista-Grupo"
              fields={groupCollabEditFields}
              initialData={{
                artistId: editingGroupCollab.artist?.id || "",
                groupId: editingGroupCollab.group?.id || "",
                date: editingGroupCollab.date ? 
                  new Date(editingGroupCollab.date).toISOString().split("T")[0] : 
                  new Date().toISOString().split("T")[0],
              }}
              itemId={`${editingGroupCollab.artist?.id || ""}-${editingGroupCollab.group?.id || ""}`}
              onSubmit={handleUpdateGroupCollab}
              onClose={() => setEditingGroupCollab(null)}
              loading={loading}
              submitText="Actualizar Colaboración"
            />
          )}

          {/* Modal para ver detalles de colaboración artista-artista */}
          {viewingArtistCollab && (
            <ViewModal
              title="👁️ Detalles de Colaboración Artista-Artista"
              item={viewingArtistCollab}
              onClose={() => setViewingArtistCollab(null)}
              fields={[
                { label: "Artista 1", value: viewingArtistCollab.artist1?.stageName || "Desconocido" },
                { label: "ID Artista 1", value: viewingArtistCollab.artist1?.id || "N/A" },
                { label: "Artista 2", value: viewingArtistCollab.artist2?.stageName || "Desconocido" },
                { label: "ID Artista 2", value: viewingArtistCollab.artist2?.id || "N/A" },
                { label: "Fecha de Colaboración", value: formatDate(viewingArtistCollab.date) },
              ]}
            />
          )}

          {/* Modal para ver detalles de colaboración artista-grupo */}
          {viewingGroupCollab && (
            <ViewModal
              title="👁️ Detalles de Colaboración Artista-Grupo"
              item={viewingGroupCollab}
              onClose={() => setViewingGroupCollab(null)}
              fields={[
                { label: "Artista", value: viewingGroupCollab.artist?.stageName || "Desconocido" },
                { label: "ID Artista", value: viewingGroupCollab.artist?.id || "N/A" },
                { label: "Grupo", value: viewingGroupCollab.group?.name || "Desconocido" },
                { label: "ID Grupo", value: viewingGroupCollab.group?.id || "N/A" },
                { label: "Fecha de Colaboración", value: formatDate(viewingGroupCollab.date) },
              ]}
            />
          )}

          {/* Modal para eliminar colaboración artista-artista */}
          {deletingArtistCollab && (
            <DeleteModal<any>
              title="🗑️ ¿Eliminar Colaboración?"
              item={deletingArtistCollab}
              itemName="Colaboración Artista-Artista"
              itemId={`${deletingArtistCollab.artist1?.id || ""}-${deletingArtistCollab.artist2?.id || ""}`}
              onConfirm={handleDeleteArtistCollab}
              onClose={() => setDeletingArtistCollab(null)}
              loading={loading}
              confirmText="Sí, Eliminar"
              warningMessage="⚠️ Esta acción no se puede deshacer. Se eliminará permanentemente la colaboración entre los artistas."
              renderDetails={(item) => (
                <Box className="collab-details" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Detalles de la colaboración:</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2"><strong>Artista 1:</strong> {item.artist1?.stageName || "Desconocido"}</Typography>
                    <Typography variant="body2"><strong>Artista 2:</strong> {item.artist2?.stageName || "Desconocido"}</Typography>
                    <Typography variant="body2"><strong>Fecha:</strong> {formatDate(item.date)}</Typography>
                  </Box>
                </Box>
              )}
            />
          )}

          {/* Modal para eliminar colaboración artista-grupo */}
          {deletingGroupCollab && (
            <DeleteModal<any>
              title="🗑️ ¿Eliminar Colaboración?"
              item={deletingGroupCollab}
              itemName="Colaboración Artista-Grupo"
              itemId={`${deletingGroupCollab.artist?.id || ""}-${deletingGroupCollab.group?.id || ""}`}
              onConfirm={handleDeleteGroupCollab}
              onClose={() => setDeletingGroupCollab(null)}
              loading={loading}
              confirmText="Sí, Eliminar"
              warningMessage="⚠️ Esta acción no se puede deshacer. Se eliminará permanentemente la colaboración entre el artista y el grupo."
              renderDetails={(item) => (
                <Box className="collab-details" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Detalles de la colaboración:</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2"><strong>Artista:</strong> {item.artist?.stageName || "Desconocido"}</Typography>
                    <Typography variant="body2"><strong>Grupo:</strong> {item.group?.name || "Desconocido"}</Typography>
                    <Typography variant="body2"><strong>Fecha:</strong> {formatDate(item.date)}</Typography>
                  </Box>
                </Box>
              )}
            />
          )}
        </>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Necesitas pertenecer a una agencia para gestionar colaboraciones.
        </Alert>
      )}
    </section>
  );
};

export default CollaborationManagement;