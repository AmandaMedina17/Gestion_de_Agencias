import React, { useState, useEffect } from "react";
import { useSong } from "../../../../context/SongContext";
import { useAlbum } from "../../../../context/AlbumContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reutilizables/CreateModal";
import EditModal from "../../../ui/reutilizables/EditModal";
import DeleteModal from "../../../ui/reutilizables/DeleteModal";
import './SongStyle.css';

// Interfaces de tipos
interface Song {
  id: string;
  name: string;
  albumId?: string;
  album?: string;
  idAlbum?: string;
  releaseDate?: Date;
  fecha: Date;
  duration?: number;
  trackNumber?: number;
}

interface Album {
  id: string;
  title: string;
}

const SongManagement: React.FC = () => {
  // Contextos
  const {
    songs,
    fetchSongs,
    createSong,
    updateSong,
    deleteSong,
    loading,
    error,
    clearError,
  } = useSong();

  const { albums, fetchAlbums } = useAlbum();

  // Estados
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deletingSong, setDeletingSong] = useState<Song | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSongs(),
          fetchAlbums()
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
        showError("Error al Cargar", "No se pudieron cargar los datos. Intente nuevamente.");
      }
    };
    loadData();
  }, []);

  // Helper functions
  const getAlbumName = (albumId: string): string => {
    if (!albumId) return "No asignado";
    const album = albums.find((a: Album) => a.id === albumId);
    return album?.title || "No asignado";
  };

  const getAlbumIdFromSong = (song: Song): string => {
    if (song.albumId) return song.albumId;
    if (song.album && typeof song.album === "string") return song.album;
    if (song.idAlbum) return song.idAlbum;
    return "";
  };

  // Funciones auxiliares para mostrar notificaciones
  const showNotification = (type: "success" | "error" | "info" | "warning", title: string, message: string) => {
    setNotification({ type, title, message });
  };

  const showSuccess = (title: string, message: string) => {
    showNotification("success", title, message);
  };

  const showError = (title: string, message: string) => {
    showNotification("error", title, message);
  };

  // Funciones específicas para operaciones
  const showCreateSuccess = () => {
    showSuccess("¡Canción Creada!", "La canción ha sido creada exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear la canción.");
  };

  const showUpdateSuccess = () => {
    showSuccess("¡Canción Actualizada!", "La canción ha sido actualizada exitosamente.");
  };

  const showUpdateError = (errorMessage?: string) => {
    showError("Error al Actualizar", errorMessage || "No se pudo actualizar la canción.");
  };

  const showDeleteSuccess = () => {
    showSuccess("¡Canción Eliminada!", "La canción ha sido eliminada exitosamente.");
  };

  const showDeleteError = (errorMessage?: string) => {
    showError("Error al Eliminar", errorMessage || "No se pudo eliminar la canción.");
  };

  // FUNCIÓN CRÍTICA: Formatear fecha para el servidor
  const formatDateForServer = (dateString: string): string => {
    if (!dateString) return new Date().toISOString();
    
    // Crear fecha a partir del string YYYY-MM-DD
    const date = new Date(dateString);
    
    // Asegurarse de que sea una fecha válida
    if (isNaN(date.getTime())) {
      console.warn("Fecha inválida, usando fecha actual");
      return new Date().toISOString();
    }
    
    // Ajustar por timezone para que no cambie el día
    const adjustedDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    
    return adjustedDate.toISOString();
  };

  // Manejar creación - ENVIAR COMO STRING ISO AL IGUAL QUE APPRENTICE
  const handleCreate = async (data: Record<string, any>) => {
    try {
      console.log("Datos para crear canción:", data);
      console.log("Fecha convertida a Date:", new Date(data.releaseDate));
      console.log("Fecha como ISO string:", formatDateForServer(data.releaseDate));
      
      // IMPORTANTE: Enviar como string ISO, igual que ApprenticeManagement
      await createSong({
        nameSong: data.name,
        idAlbum: data.albumId,
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchSongs();

    } catch (err: any) {
      console.error("Error al crear canción:", err);
      showCreateError(err.message || "Error desconocido al crear la canción");
    }
  };

  // Manejar actualización
  const handleUpdate = async (id: string | number, data: Record<string, any>) => {
    try {
      await updateSong(id as string, {
        nameSong: data.name,
        idAlbum: data.albumId,
        date: new Date(data.releaseDate) // Enviar como string ISO
      });

      showUpdateSuccess();
      setEditingSong(null);
      await fetchSongs();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingSong) return;

    try {
      await deleteSong(id as string);
      showDeleteSuccess();
      setDeletingSong(null);
      await fetchSongs();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Funciones auxiliares para formatear fechas para visualización
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      
      // Validar que sea una fecha válida
      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }
      
      return date.toLocaleDateString("es-ES", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Error en fecha";
    }
  };

  // Definir campos del formulario para canción
  const songFields: FormField[] = [
    {
      name: "name",
      label: "Nombre de la Canción",
      type: "text",
      placeholder: "Ej: Billie Jean",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
        return null;
      }
    },
    {
      name: "albumId",
      label: "Álbum",
      type: "autocomplete",
      required: true,
      options: albums.map(album => ({
        value: album.id,
        label: album.title
      }))
    },
    {
      name: "releaseDate",
      label: "Fecha de Lanzamiento",
      type: "date",
      required: true,
      validate: (value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Fecha inválida";
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      }
    }
  ];

  // Datos iniciales para creación (formato YYYY-MM-DD para input type="date")
  const initialCreateData = {
    name: "",
    albumId: "",
    releaseDate: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
  };

  // Definir columnas para la tabla
  const columns: Column<Song>[] = [
    {
      key: "name",
      title: "Nombre",
      sortable: true,
      width: "30%",
      align: "center"
    },
    {
      key: "album",
      title: "Álbum",
      sortable: true,
      width: "30%",
      align: "center",
      render: (item) => getAlbumName(getAlbumIdFromSong(item))
    },
    {
      key: "fecha",
      title: "Fecha Lanzamiento",
      sortable: true,
      width: "25%",
      align: "center",
      render: (item) => formatDateForDisplay(item.fecha.toString())
    }
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderSongDetails = (song: Song) => (
    <div className="song-details">
      <div className="detail-item">
        <strong>Nombre:</strong> <span>{song.name}</span>
      </div>
      <div className="detail-item">
        <strong>Álbum:</strong> <span>{getAlbumName(getAlbumIdFromSong(song))}</span>
      </div>
      <div className="detail-item">
        <strong>Fecha Lanzamiento:</strong> <span>{formatDateForDisplay(song.fecha.toString())}</span>
      </div>
    </div>
  );

  // Convertir fecha para edición (formato YYYY-MM-DD)
  const getDateForEdit = (date: Date): string => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
      
      // Formato YYYY-MM-DD para input type="date"
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  };

  return (
    <section id="song_manager" className="content-section active">
      <GenericTable<Song>
        title="Gestión de Canciones"
        description="Administre todas las canciones del sistema"
        data={songs}
        columns={columns}
        loading={loading}
        onReload={() => {
          clearError();
          fetchSongs();
          fetchAlbums();
        }}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingSong}
        onEditingChange={setEditingSong}
        deletingItem={deletingSong}
        onDeletingChange={setDeletingSong}
        itemsPerPage={20}
        className="song-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nueva Canción"
          fields={songFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Canción"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingSong && (
        <EditModal
          title="Editar Canción"
          fields={songFields}
          initialData={{
            name: editingSong.name,
            albumId: getAlbumIdFromSong(editingSong),
            releaseDate: getDateForEdit(editingSong.fecha)
          }}
          itemId={editingSong.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingSong(null)}
          loading={loading}
          submitText="Actualizar Canción"
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingSong && (
        <DeleteModal<Song>
          title="¿Eliminar Canción?"
          item={deletingSong}
          itemName="Canción"
          itemId={deletingSong.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingSong(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderSongDetails}
        />
      )}
    </section>
  );
};

export default SongManagement;