// src/views/SuccessManagement/AwardTab.tsx
import React, { useState, useEffect } from "react";
import { useAward } from "../../../../context/AwardContext";
import { useAlbum } from "../../../../context/AlbumContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reutilizables/CreateModal";
import EditModal from "../../../ui/reutilizables/EditModal";
import DeleteModal from "../../../ui/reutilizables/DeleteModal";
import { ResponseAwardDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/AwardDto/response.award.dto";
import { Box, Button, Chip } from "@mui/material";
import { Add, AttachFile } from "@mui/icons-material";

interface AwardTabProps {
  onNotification?: (type: "success" | "error" | "info" | "warning", title: string, message: string) => void;
}

const AwardTab: React.FC<AwardTabProps> = ({ onNotification }) => {
  const {
    awards,
    fetchAwards,
    createAward,
    updateAward,
    deleteAward,
    assignAwardToAlbum,
    loading,
    error,
    clearError,
  } = useAward();

  const { albums, fetchAlbums } = useAlbum();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAward, setEditingAward] = useState<ResponseAwardDto | null>(null);
  const [deletingAward, setDeletingAward] = useState<ResponseAwardDto | null>(null);
  const [assigningAward, setAssigningAward] = useState<ResponseAwardDto | null>(null);
  const [albumIdToAssign, setAlbumIdToAssign] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchAwards(), fetchAlbums()]);
      } catch (err) {
        console.error("Error loading data:", err);
        if (onNotification) {
          onNotification("error", "Error", "No se pudieron cargar los datos");
        }
      }
    };
    loadData();
  }, []);

  // Definir campos del formulario de premio
  const awardFields: FormField[] = [
    {
      name: "name",
      label: "Nombre del Premio",
      type: "text",
      placeholder: "Ej: Grammy, MTV Music Awards, Billboard",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (value.length < 2) return "El nombre del premio debe tener al menos 2 caracteres";
        return null;
      }
    },
    {
      name: "date",
      label: "Fecha del Premio",
      type: "date",
      required: true,
      validate: (value) => {
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      }
    }
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    name: "",
    date: new Date().toISOString().split('T')[0]
  };

  // Función para mostrar notificaciones
  const showNotification = (type: "success" | "error" | "info" | "warning", title: string, message: string) => {
    if (onNotification) {
      onNotification(type, title, message);
    }
  };

  // Manejar asignación de premio a álbum
  const handleAssignToAlbum = async () => {
    if (!assigningAward || !albumIdToAssign.trim()) return;

    try {
      await assignAwardToAlbum(assigningAward.id, albumIdToAssign);
      showNotification("success", "Premio Asignado", "El premio ha sido asignado al álbum exitosamente.");
      setAssigningAward(null);
      setAlbumIdToAssign("");
      await fetchAwards();
    } catch (err: any) {
      showNotification("error", "Error al Asignar Premio", err.message || "No se pudo asignar el premio al álbum.");
    }
  };

  // Funciones auxiliares
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const getAlbumName = (albumId: string | undefined) => {
    if (!albumId) return null;
    const album = albums.find(a => a.id === albumId);
    return album ? album.title : "Álbum desconocido";
  };

  // Definir columnas para la tabla
  const columns: Column<ResponseAwardDto>[] = [
    {
      key: "name",
      title: "Nombre del Premio",
      sortable: true,
      width: "40%",
      render: (item) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Box>
            <div style={{ fontWeight: 600, fontSize: '16px' }}>{item.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>ID: {item.id.substring(0, 8)}...</div>
          </Box>
        </Box>
      )
    },
    {
      key: "date",
      title: "Fecha",
      sortable: true,
      width: "20%",
      render: (item) => (
        <Box textAlign="center">
          <div style={{ fontWeight: 600 }}>{formatYear(item.date.toString())}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{formatDate(item.date.toString())}</div>
        </Box>
      ),
      align: "center"
    },
    {
      key: "albumId",
      title: "Álbum Asignado",
      sortable: true,
      width: "25%",
      render: (item) => {
        const albumName = getAlbumName(item.albumId);
        return (
          <Box textAlign="center">
            {albumName ? (
              <Chip 
                label={albumName} 
                color="success" 
                size="small"
                variant="outlined"
              />
            ) : (
              <Chip 
                label="Sin asignar" 
                color="default" 
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        );
      },
      align: "center"
    },
    {
      key: "actions",
      title: "Acciones",
      sortable: false,
      width: "15%",
      render: (item) => (
        <Box display="flex" gap={1} justifyContent="center">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => setAssigningAward(item)}
            startIcon={<AttachFile />}
            disabled={!!item.albumId}
          >
            {item.albumId ? "Asignado" : "Asignar"}
          </Button>
        </Box>
      ),
      align: "center"
    }
  ];


  return (
    <div className="award-tab">
      
      <GenericTable<ResponseAwardDto>
        title="Premios de Álbumes"
        description="Gestiona y asigna premios a los álbumes de la agencia"
        data={awards}
        columns={columns}
        loading={loading}
        onReload={fetchAwards}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingAward}
        onEditingChange={setEditingAward}
        deletingItem={deletingAward}
        onDeletingChange={setDeletingAward}
        itemsPerPage={10}
        className="award-table"
        notification={undefined}
        onNotificationClose={() => {}}
        emptyState={
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#666' }}>No hay premios registrados</h3>
            <p style={{ color: '#999' }}>Crea tu primer premio para comenzar</p>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateModal(true)}
              sx={{ mt: 2 }}
            >
              Crear primer premio
            </Button>
          </div>
        }
      />



      {/* Modal para asignar premio a álbum */}
      {assigningAward && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Asignar Premio a Álbum</h3>
              <button className="modal-close" onClick={() => {
                setAssigningAward(null);
                setAlbumIdToAssign("");
              }}>×</button>
            </div>
            <div className="modal-body">
              <p>Asignando el premio: <strong>{assigningAward.name}</strong></p>
              
              <div className="form-group">
                <label htmlFor="albumId">Seleccionar Álbum:</label>
                <select
                  id="albumId"
                  value={albumIdToAssign}
                  onChange={(e) => setAlbumIdToAssign(e.target.value)}
                  className="form-input"
                >
                  <option value="">Seleccione un álbum</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>
                      {album.title} - {new Date(album.releaseDate).getFullYear()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="current-assignment">
                <p>
                  <strong>Asignación actual:</strong>{" "}
                  {assigningAward.albumId ? (
                    <span className="album-id-current">
                      {getAlbumName(assigningAward.albumId)}
                    </span>
                  ) : (
                    <span className="no-album-current">No asignado</span>
                  )}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setAssigningAward(null);
                  setAlbumIdToAssign("");
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAssignToAlbum}
                disabled={!albumIdToAssign.trim() || loading}
              >
                {loading ? "Asignando..." : "Asignar al Álbum"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardTab;