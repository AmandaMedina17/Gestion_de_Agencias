import React, { useState, useEffect, useMemo } from "react";
import { useAlbum } from "../../../../context/AlbumContext";
import { Icon } from "../../../icons";
import './AlbumStyle.css';

export enum AlbumStatus {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO",
}

const AlbumManagement: React.FC = () => {
  const {
    albums,
    fetchAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    loading,
    error,
    clearError,
  } = useAlbum();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "releaseDate" | "copiesSold" | "numberOfTracks">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [deletingAlbum, setDeletingAlbum] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Estados del formulario
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    releaseDate: "",
    mainProducer: "",
    copiesSold: "",
    numberOfTracks: "",
  });

  const [editAlbum, setEditAlbum] = useState({
    title: "",
    releaseDate: "",
    mainProducer: "",
    copiesSold: 0,
    numberOfTracks: "",
  });

  // Cargar álbumes cuando se monta el componente
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await fetchAlbums();
          setDataLoaded(true);
        } catch (err) {
          console.error("Error loading albums:", err);
        }
      }
    };

    loadInitialData();
  }, [dataLoaded]);

  // Resetear página cuando cambien filtro u orden
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy, sortOrder]);

  // Filtrar y ordenar álbumes
  const filteredAndSortedAlbums = useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = albums;

    // Aplicar filtro por título
    if (filter) {
      filtered = albums.filter((album) =>
        album.title.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "releaseDate":
          aValue = new Date(a.releaseDate);
          bValue = new Date(b.releaseDate);
          break;
        case "copiesSold":
          aValue = a.copiesSold;
          bValue = b.copiesSold;
          break;
        case "numberOfTracks":
          aValue = a.numberOfTracks;
          bValue = b.numberOfTracks;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [albums, filter, sortBy, sortOrder, dataLoaded]);

  // PAGINACIÓN: calcular páginas y slice
  const totalPages = Math.ceil(filteredAndSortedAlbums.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlbums = filteredAndSortedAlbums.slice(startIndex, startIndex + itemsPerPage);

  // Manejar creación de álbum
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!newAlbum.title.trim() || !newAlbum.mainProducer.trim()) {
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios",
      });
      return;
    }

    try {
      await createAlbum({
        title: newAlbum.title,
        mainProducer: newAlbum.mainProducer,
        date: newAlbum.releaseDate ? new Date(newAlbum.releaseDate) : undefined,
        copiesSold: 0
        
      });

      setMessage({
        type: "success",
        text: `Álbum "${newAlbum.title}" creado exitosamente`,
      });

      // Resetear formulario
      setNewAlbum({
        title: "",
        releaseDate: "",
        mainProducer: "",
        copiesSold: "",
        numberOfTracks: "",
      });

      setShowCreateForm(false);
      await fetchAlbums();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear el álbum",
      });
    }
  };

  // Manejar actualización de álbum
  const handleUpdate = async () => {
    if (!editingAlbum || !editAlbum.title.trim() || !editAlbum.mainProducer.trim()) {
      return;
    }

    try {
      await updateAlbum(editingAlbum.id, {
        title: editAlbum.title,
        mainProducer: editAlbum.mainProducer,
        releaseDate: editAlbum.releaseDate ? new Date(editAlbum.releaseDate) : undefined,
        copiesSold: editAlbum.copiesSold
      });

      setMessage({
        type: "success",
        text: `Álbum actualizado exitosamente`,
      });

      setEditingAlbum(null);
      setEditAlbum({
        title: "",
        releaseDate: "",
        mainProducer: "",
        copiesSold: 0,
        numberOfTracks: "",
      });

      await fetchAlbums();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar el álbum",
      });
    }
  };

  // Manejar eliminación de álbum
  const handleDelete = async () => {
    if (!deletingAlbum) {
      return;
    }

    try {
      await deleteAlbum(deletingAlbum.id);
      setMessage({
        type: "success",
        text: `Álbum "${deletingAlbum.title}" eliminado exitosamente`,
      });
      setDeletingAlbum(null);
      await fetchAlbums();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar el álbum",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    try {
      await fetchAlbums();
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
  const startEdit = (album: any) => {
    setEditingAlbum(album);
    setEditAlbum({
      title: album.title,
      releaseDate: album.releaseDate ? album.releaseDate.split("T")[0] : "",
      mainProducer: album.mainProducer,
      copiesSold: album.copiesSold?.toString() || "",
      numberOfTracks: album.numberOfTracks?.toString() || "",
    });
  };

  // Iniciar eliminación
  const startDelete = (album: any) => {
    setDeletingAlbum(album);
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

  // Formatear números con separadores de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
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
    <section id="album_manager" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Álbumes</h1>
          <p className="section-description">
            Administre todos los álbumes del sistema
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
              Nuevo Álbum
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input
                type="text"
                className="form-input search-input"
                placeholder="Filtrar por título..."
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
                <option value="title">Ordenar por título</option>
                <option value="releaseDate">Ordenar por fecha lanzamiento</option>
                <option value="copiesSold">Ordenar por copias vendidas</option>
                <option value="numberOfTracks">Ordenar por número de pistas</option>
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
              {filteredAndSortedAlbums.length} de {albums.length} álbumes
            </span>
            <span className="sort-info">
              Orden:{" "}
              {sortBy === "title"
                ? "Título"
                : sortBy === "releaseDate"
                ? "Fecha Lanzamiento"
                : sortBy === "copiesSold"
                ? "Copias Vendidas"
                : "Número de Pistas"}{" "}
              •{sortOrder === "asc" ? " Ascendente" : " Descendente"}
            </span>
          </div>
        )}

        {/* Grid de álbumes */}
        <div className="albums-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando álbumes...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedAlbums.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💿</div>
              <h3>No hay álbumes</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando el primer álbum"}
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
                  Crear Primer Álbum
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="albums-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Productor Principal</th>
                    <th>Fecha Lanzamiento</th>
                    <th>Copias Vendidas</th>
                    <th>Número de Pistas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAlbums.map((album) => (
                    <tr key={album.id} className="album-row">
                      <td className="album-title-cell">
                        <div className="album-title">{album.title}</div>
                      </td>
                      <td>
                        <div className="detail-value">{album.mainProducer}</div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {formatDate(album.releaseDate.toString())}
                        </div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {formatNumber(album.copiesSold)} copias
                        </div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {album.numberOfTracks} pistas
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => startEdit(album)}
                            title="Editar álbum"
                            disabled={loading}
                          >
                            <Icon name="edit" size={18} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => startDelete(album)}
                            title="Eliminar álbum"
                            disabled={loading}
                          >
                            <Icon name="trash" size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
        <div className="modal-overlay album-modal">
          <div className="modal-content">
            <h3>Crear Nuevo Álbum</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Título *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Thriller"
                    value={newAlbum.title}
                    onChange={(e) =>
                      setNewAlbum({
                        ...newAlbum,
                        title: e.target.value,
                      })
                    }
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Productor Principal *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Quincy Jones"
                    value={newAlbum.mainProducer}
                    onChange={(e) =>
                      setNewAlbum({
                        ...newAlbum,
                        mainProducer: e.target.value,
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
                    value={newAlbum.releaseDate}
                    onChange={(e) =>
                      setNewAlbum({
                        ...newAlbum,
                        releaseDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>


              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading || !newAlbum.title.trim() || !newAlbum.mainProducer.trim()}
                >
                  {loading ? "Creando..." : "Crear Álbum"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewAlbum({
                      title: "",
                      releaseDate: "",
                      mainProducer: "",
                      copiesSold: "",
                      numberOfTracks: "",
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
      {editingAlbum && (
        <div className="modal-overlay album-modal">
          <div className="modal-content">
            <h3>Editar Álbum</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editAlbum.title}
                  onChange={(e) =>
                    setEditAlbum({
                      ...editAlbum,
                      title: e.target.value,
                    })
                  }
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Productor Principal *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editAlbum.mainProducer}
                  onChange={(e) =>
                    setEditAlbum({
                      ...editAlbum,
                      mainProducer: e.target.value,
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
                  value={editAlbum.releaseDate}
                  onChange={(e) =>
                    setEditAlbum({
                      ...editAlbum,
                      releaseDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Copias Vendidas</label>
                <input
                  type="number"
                  className="form-input"
                  value={editAlbum.copiesSold}
                  onChange={(e) =>
                    setEditAlbum({
                      ...editAlbum,
                      copiesSold: parseInt(e.target.value) ,
                    })
                  }
                  min="0"
                  
                />
              </div>
            </div>

        

            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={handleUpdate}
                disabled={loading || !editAlbum.title.trim() || !editAlbum.mainProducer.trim()}
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setEditingAlbum(null);
                  setEditAlbum({
                    title: "",
                    releaseDate: "",
                    mainProducer: "",
                    copiesSold: 0,
                    numberOfTracks: "",
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
      {deletingAlbum && (
        <div className="modal-overlay album-modal">
          <div className="modal-content">
            <h3>¿Eliminar Álbum?</h3>
            <div className="delete-confirmation">
              <p>¿Está seguro de que desea eliminar este álbum?</p>
              <div className="album-details">
                <div className="detail-item">
                  <strong>Título:</strong> {deletingAlbum.title}
                </div>
                <div className="detail-item">
                  <strong>Productor Principal:</strong> {deletingAlbum.mainProducer}
                </div>
                <div className="detail-item">
                  <strong>Fecha Lanzamiento:</strong> {formatDate(deletingAlbum.releaseDate)}
                </div>
                <div className="detail-item">
                  <strong>Copias Vendidas:</strong> {formatNumber(deletingAlbum.copiesSold)} copias
                </div>
                <div className="detail-item">
                  <strong>Número de Pistas:</strong> {deletingAlbum.numberOfTracks}
                </div>
              </div>
              <p className="warning-text">
                ⚠️ Esta acción no se puede deshacer y también eliminará todas las canciones asociadas.
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
                onClick={() => setDeletingAlbum(null)}
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

export default AlbumManagement;