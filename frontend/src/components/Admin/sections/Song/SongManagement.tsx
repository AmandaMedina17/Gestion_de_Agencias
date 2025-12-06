import React, { useState, useEffect, useMemo } from "react";
import { useSong } from "../../../../context/SongContext";
import { useAlbum } from "../../../../context/AlbumContext";
import { Icon } from "../../../icons";
<<<<<<< Updated upstream
import './SongStyle.css';
=======
import "./SongStyle.css";
import AcUnitIcon from "@mui/icons-material/AcUnit";
>>>>>>> Stashed changes

const SongManagement: React.FC = () => {
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

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "fecha" | "album">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  const [deletingSong, setDeletingSong] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Estados del formulario
  const [newSong, setNewSong] = useState({
    nameSong: "",
    idAlbum: "",
    releaseDate: "",
  });

  const [editSong, setEditSong] = useState({
    nameSong: "",
    idAlbum: "",
    releaseDate: "",
  });

  // Cargar canciones y álbumes cuando se monta el componente
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await fetchSongs();
          await fetchAlbums();

          // DEBUG: Verificar estructura de las canciones
          console.log("=== DEBUG CANCIONES ===");
          if (songs.length > 0) {
            const firstSong = songs[0];
            console.log("Primera canción:", firstSong);
            console.log("Propiedades de la canción:", Object.keys(firstSong));
            console.log("¿Tiene albumId?:", "albumId" in firstSong);
            console.log("Valor de albumId:", firstSong.albumId);
            console.log("¿Tiene album?:", "album" in firstSong);
            console.log("¿Tiene idAlbum?:", "idAlbum" in firstSong);
          }

          // DEBUG: Verificar estructura de los álbumes
          console.log("=== DEBUG ÁLBUMES ===");
          if (albums.length > 0) {
            console.log("Primeros 3 álbumes:", albums.slice(0, 3));
          }

          setDataLoaded(true);
        } catch (err) {
          console.error("Error loading initial data:", err);
        }
      }
    };

    loadInitialData();
  }, [dataLoaded]);

  // Resetear página cuando cambien filtro u orden
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy, sortOrder]);

  // Obtener ID del álbum de la canción - CORREGIDO
  const getAlbumIdFromSong = (song: any): string => {
    // Primero intentamos con albumId (del DTO)
    if (song.albumId && typeof song.albumId === "string") {
      return song.albumId;
    }
    // Luego intentamos con album (como en aprendices)
    if (song.album && typeof song.album === "string") {
      return song.album;
    }
    // Luego intentamos con idAlbum
    if (song.idAlbum && typeof song.idAlbum === "string") {
      return song.idAlbum;
    }
    // Si no hay ninguna, retornamos string vacío
    console.warn("Canción sin ID de álbum:", song);
    return "";
  };

  // Obtener nombre del álbum por ID - CORREGIDO
  const getAlbumName = (albumId: string) => {
    console.log("getAlbumName recibió albumId:", albumId);

    if (!albumId || albumId.trim() === "") {
      return "No asignado";
    }

    const album = albums.find((a) => a.id === albumId);

    if (album) {
      return album.title;
    } else {
      console.warn(
        `Álbum con ID "${albumId}" no encontrado en:`,
        albums.map((a) => ({ id: a.id, title: a.title }))
      );
      return "No asignado";
    }
  };

  // Obtener nombre del álbum directamente de la canción - FUNCIÓN ALTERNATIVA
  const getAlbumNameFromSong = (song: any) => {
    const albumId = getAlbumIdFromSong(song);
    return getAlbumName(albumId);
  };

  // Filtrar y ordenar canciones
  const filteredAndSortedSongs = useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = songs;

    // Aplicar filtro por nombre de canción
    if (filter) {
      filtered = songs.filter((song) =>
        song.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "fecha":
          aValue = new Date(a.fecha);
          bValue = new Date(b.fecha);
          break;
        case "album":
          aValue = getAlbumNameFromSong(a);
          bValue = getAlbumNameFromSong(b);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [songs, filter, sortBy, sortOrder, dataLoaded, albums]);

  // PAGINACIÓN: calcular páginas y slice
  const totalPages = Math.ceil(filteredAndSortedSongs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSongs = filteredAndSortedSongs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Manejar creación de canción
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!newSong.nameSong.trim() || !newSong.idAlbum) {
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios",
      });
      return;
    }

    try {
      await createSong({
        nameSong: newSong.nameSong,
        idAlbum: newSong.idAlbum,
<<<<<<< Updated upstream
        releaseDate: newSong.releaseDate ? new Date(newSong.releaseDate) : undefined,
=======
        releaseDate: new Date(newSong.releaseDate),
>>>>>>> Stashed changes
      });

      setMessage({
        type: "success",
        text: `Canción "${newSong.nameSong}" creada exitosamente`,
      });

      // Resetear formulario
      setNewSong({
        nameSong: "",
        idAlbum: "",
        releaseDate: "",
      });

      setShowCreateForm(false);
      await fetchSongs();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear la canción",
      });
    }
  };

  // Manejar actualización de canción
  const handleUpdate = async () => {
    if (!editingSong || !editSong.nameSong.trim() || !editSong.idAlbum) {
      return;
    }

    try {
      await updateSong(editingSong.id, {
        nameSong: editSong.nameSong,
        idAlbum: editSong.idAlbum,
        releaseDate: editSong.releaseDate ? new Date(editSong.releaseDate) : undefined,
      });

      setMessage({
        type: "success",
        text: `Canción actualizada exitosamente`,
      });

      setEditingSong(null);
      setEditSong({
        nameSong: "",
        idAlbum: "",
        releaseDate: "",
      });

      await fetchSongs();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar la canción",
      });
    }
  };

  // Manejar eliminación de canción
  const handleDelete = async () => {
    if (!deletingSong) {
      return;
    }

    try {
      await deleteSong(deletingSong.id);
      setMessage({
        type: "success",
        text: `Canción "${deletingSong.name}" eliminada exitosamente`,
      });
      setDeletingSong(null);
      await fetchSongs();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar la canción",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    setDataLoaded(false); // Forzar recarga
    try {
      await fetchSongs();
      await fetchAlbums();
      setDataLoaded(true);
      setMessage({
        type: "success",
        text: "Datos actualizados correctamente",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al recargar los datos",
      });
    }
  };

  // Iniciar edición
  const startEdit = (song: any) => {
    setEditingSong(song);
    const albumId = getAlbumIdFromSong(song);
    setEditSong({
      nameSong: song.name,
      idAlbum: albumId,
      releaseDate: song.fecha ? song.fecha.split("T")[0] : "",
    });
  };

  // Iniciar eliminación
  const startDelete = (song: any) => {
    setDeletingSong(song);
  };

  // Limpiar filtro
  const handleClearFilter = () => {
    setFilter("");
  };

  // Alternar ordenamiento
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    // Sumar un día
    date.setDate(date.getDate() + 1);

    return date.toLocaleDateString("es-ES");
  };

  // Obtener fecha máxima para el input date (hoy)
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <section id="song_manager" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Canciones</h1>
          <p className="section-description">
            Administre todas las canciones del sistema
          </p>
        </div>
      </div>

      <div className="detail-card">
        {/* Mensajes globales */}
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {error && <div className="message error">{error}</div>}

        {/* Controles superiores */}
        <div className="manager-controls">
          <div className="controls-left">
            <button
              className="create-button"
              onClick={() => setShowCreateForm(true)}
              disabled={loading}
            >
              <span className="button-icon">
                <Icon name="plus" size={20} />
              </span>
              Nueva Canción
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input
                type="text"
                className="form-input search-input"
                placeholder="Filtrar por nombre..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                disabled={loading}
              />
              {filter && (
                <button
                  className="clear-filter-btn"
                  onClick={handleClearFilter}
                  title="Limpiar filtro"
                >
                  ×
                </button>
              )}
            </div>

            <div className="sort-group">
              <select
                className="form-select sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                disabled={loading}
              >
                <option value="name">Ordenar por nombre</option>
                <option value="fecha">Ordenar por fecha lanzamiento</option>
                <option value="album">Ordenar por álbum</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={toggleSortOrder}
                disabled={loading}
                title={
                  sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"
                }
              >
                {sortOrder === "asc" ? (
                  <Icon name="down" size={18} />
                ) : (
                  <Icon name="up" size={18} />
                )}
              </button>
            </div>

            <button
              className="reload-button"
              onClick={handleReload}
              disabled={loading}
              title="Recargar datos"
            >
              {loading ? "⟳" : "↻"}
            </button>
          </div>
        </div>

        {/* Contador de resultados */}
        {dataLoaded && (
          <div className="results-info">
            <span className="results-count">
              {filteredAndSortedSongs.length} de {songs.length} canciones
            </span>
            <span className="sort-info">
              Orden:{" "}
              {sortBy === "name"
                ? "Nombre"
                : sortBy === "fecha"
                ? "Fecha Lanzamiento"
                : "Álbum"}{" "}
              •{sortOrder === "asc" ? " Ascendente" : " Descendente"}
            </span>
          </div>
        )}

        {/* Grid de canciones */}
        <div className="songs-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando canciones...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedSongs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <h3>No hay canciones</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando la primera canción"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={loading}
                >
                  <span className="button-icon">
                    <Icon name="plus" size={20} />
                  </span>
                  Crear Primera Canción
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="songs-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Álbum</th>
                    <th>Fecha Lanzamiento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSongs.map((song) => {
                    const albumName = getAlbumNameFromSong(song);
                    return (
                      <tr key={song.id} className="song-row">
                        <td className="song-name-cell">
                          <div className="song-name">{song.name}</div>
                        </td>
<<<<<<< Updated upstream
                        <td>
                          <div className="detail-value">
                            {albumName}
                          </div>
                        </td>
=======

>>>>>>> Stashed changes
                        <td>
                          <div className="detail-value">
                            {formatDate(song.fecha.toString())}
                          </div>
                        </td>
                        <td>
                          <div className="table-actions-botons">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => startEdit(song)}
                              title="Editar canción"
                              disabled={loading}
                            >
                              <Icon name="edit" size={18} />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => startDelete(song)}
                              title="Eliminar canción"
                              disabled={loading}
                            >
                              <Icon name="trash" size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ◀ Anterior
                  </button>

                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Siguiente ▶
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación */}
      {showCreateForm && (
        <div className="modal-overlay song-modal">
          <div className="modal-content">
            <h3>Crear Nueva Canción</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Nombre de la Canción *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Billie Jean"
                    value={newSong.nameSong}
                    onChange={(e) =>
                      setNewSong({
                        ...newSong,
                        nameSong: e.target.value,
                      })
                    }
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha de Lanzamiento</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newSong.releaseDate}
                    onChange={(e) =>
                      setNewSong({
                        ...newSong,
                        releaseDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Álbum *</label>
                  <select
                    className="form-select"
                    value={newSong.idAlbum}
                    onChange={(e) =>
                      setNewSong({
                        ...newSong,
                        idAlbum: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Seleccione un álbum</option>
                    {albums.map((album) => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    loading || !newSong.nameSong.trim() || !newSong.idAlbum
                  }
                >
                  {loading ? "Creando..." : "Crear Canción"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewSong({
                      nameSong: "",
                      idAlbum: "",
                      releaseDate: "",
                    });
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingSong && (
        <div className="modal-overlay song-modal">
          <div className="modal-content">
            <h3>Editar Canción</h3>
            <div className="form-row">
              <div className="form-group full-width">
                <label className="form-label">Nombre de la Canción *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editSong.nameSong}
                  onChange={(e) =>
                    setEditSong({
                      ...editSong,
                      nameSong: e.target.value,
                    })
                  }
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha de Lanzamiento</label>
                <input
                  type="date"
                  className="form-input"
                  value={editSong.releaseDate}
                  onChange={(e) =>
                    setEditSong({
                      ...editSong,
                      releaseDate: e.target.value,
                    })
                  }
                  max={getTodayDate()}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Álbum *</label>
                <select
                  className="form-select"
                  value={editSong.idAlbum}
                  onChange={(e) =>
                    setEditSong({
                      ...editSong,
                      idAlbum: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Seleccione un álbum</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={handleUpdate}
                disabled={
                  loading || !editSong.nameSong.trim() || !editSong.idAlbum
                }
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setEditingSong(null);
                  setEditSong({
                    nameSong: "",
                    idAlbum: "",
                    releaseDate: "",
                  });
                }}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deletingSong && (
        <div className="modal-overlay song-modal">
          <div className="modal-content">
            <h3>¿Eliminar Canción?</h3>
            <div className="delete-confirmation">
              <p>¿Está seguro de que desea eliminar esta canción?</p>
              <div className="song-details">
                <div className="detail-item">
                  <strong>Nombre:</strong> {deletingSong.name}
                </div>
                <div className="detail-item">
                  <strong>Álbum:</strong> {getAlbumNameFromSong(deletingSong)}
                </div>
                <div className="detail-item">
                  <strong>Fecha Lanzamiento:</strong>{" "}
                  {formatDate(deletingSong.fecha)}
                </div>
              </div>
              <p className="warning-text">
                ⚠️ Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="submit-button delete-button"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Sí, Eliminar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => setDeletingSong(null)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SongManagement;
