import React, { useState, useEffect } from "react";
import { useAlbum } from "../../../../context/AlbumContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reutilizables/CreateModal";
import EditModal from "../../../ui/reutilizables/EditModal";
import DeleteModal from "../../../ui/reutilizables/DeleteModal";
import './AlbumStyle.css';
import { ResponseAlbumDto as AlbumResponseDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/albumDto/response.album.dto";

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

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<AlbumResponseDto | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState<AlbumResponseDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAlbums();
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

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

  const showCreateSuccess = () => {
    showSuccess("¡Álbum Creado!", "El álbum ha sido creado exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear el álbum.");
  };

  const showUpdateSuccess = () => {
    showSuccess("¡Álbum Actualizado!", "El álbum ha sido actualizado exitosamente.");
  };

  const showUpdateError = (errorMessage?: string) => {
    showError("Error al Actualizar", errorMessage || "No se pudo actualizar el álbum.");
  };

  const showDeleteSuccess = () => {
    showSuccess("¡Álbum Eliminado!", "El álbum ha sido eliminado exitosamente.");
  };

  const showDeleteError = (errorMessage?: string) => {
    showError("Error al Eliminar", errorMessage || "No se pudo eliminar el álbum.");
  };

  // Definir campos del formulario de álbum
  const albumFields: FormField[] = [
    {
      name: "title",
      label: "Título del álbum",
      type: "text",
      placeholder: "Ej: Thriller, Bad, After Hours",
      required: true,
      min: 2,
      max: 150,
      validate: (value) => {
        if (!value.trim()) return "El título del álbum es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";
        if (value.length > 150) return "No puede exceder 150 caracteres";
        return null;
      }
    },
    {
      name: "mainProducer",
      label: "Productor principal",
      type: "text",
      placeholder: "Ej: Quincy Jones, Metro Boomin, Pharrell Williams",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (!value.trim()) return "El productor principal es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";
        if (value.length > 100) return "No puede exceder 100 caracteres";
        return null;
      }
    },
    {
      name: "releaseDate",
      label: "Fecha de lanzamiento",
      type: "date",
      required: false,
      validate: (value) => {
        if (value) {
          const date = new Date(value);
          if (date > new Date()) return "La fecha no puede ser futura";
        }
        return null;
      }
    },
    {
      name: "copiesSold",
      label: "Copias vendidas",
      type: "number",
      required: false,
      min: 0,
      placeholder: "Ej: 1000000",
      validate: (value) => {
        if (value) {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) return "Debe ser un número válido";
          if (numValue < 0) return "No puede ser negativo";
          if (numValue > 1000000000) return "No puede exceder 1,000,000,000 copias";
        }
        return null;
      }
    }
  ];

  const albumEditFields: FormField[] = [
    {
      name: "title",
      label: "Título del álbum",
      type: "text",
      required: true,
      min: 2,
      max: 150,
      validate: (value) => {
        if (!value.trim()) return "El título del álbum es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";
        return null;
      }
    },
    {
      name: "mainProducer",
      label: "Productor principal",
      type: "text",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (!value.trim()) return "El productor principal es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";
        return null;
      }
    },
    {
      name: "releaseDate",
      label: "Fecha de lanzamiento",
      type: "date",
      required: false,
      validate: (value) => {
        if (value) {
          const date = new Date(value);
          if (date > new Date()) return "La fecha no puede ser futura";
        }
        return null;
      }
    },
    {
      name: "copiesSold",
      label: "Copias vendidas",
      type: "number",
      required: false,
      min: 0,
      validate: (value) => {
        if (value) {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) return "Debe ser un número válido";
          if (numValue < 0) return "No puede ser negativo";
        }
        return null;
      }
    }
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    title: "",
    mainProducer: "",
    releaseDate: "",
    copiesSold: ""
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createAlbum({
        title: data.title.trim(),
        mainProducer: data.mainProducer.trim(),
        date: data.releaseDate ? new Date(data.releaseDate) : undefined,
        copiesSold: data.copiesSold ? parseInt(data.copiesSold) : 0,
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchAlbums();

    } catch (err: any) {
      showCreateError(err.message);
    }
  };

  // Manejar actualización
  const handleUpdate = async (id: string | number, data: Record<string, any>) => {
    try {
      await updateAlbum(id as string, {
        title: data.title.trim(),
        mainProducer: data.mainProducer.trim(),
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
        copiesSold: data.copiesSold ? parseInt(data.copiesSold) : 0,
      });

      showUpdateSuccess();
      setEditingAlbum(null);
      await fetchAlbums();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingAlbum) return;

    try {
      await deleteAlbum(id as string);
      showDeleteSuccess();
      setDeletingAlbum(null);
      await fetchAlbums();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Funciones auxiliares
  const formatDate = (date: Date | string) => {
    if (!date) return "No establecida";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleDateString("es-ES");
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  const getYearsSinceRelease = (releaseDate: Date | string) => {
    if (!releaseDate) return "N/A";
    const release = typeof releaseDate === 'string' ? new Date(releaseDate) : releaseDate;
    const today = new Date();
    const years = today.getFullYear() - release.getFullYear();
    return `${years} año${years !== 1 ? 's' : ''}`;
  };

  // Definir columnas para la tabla
  const columns: Column<AlbumResponseDto>[] = [
    {
      key: "title",
      title: "Título",
      sortable: true,
      width: "25%",
      align: "center"
    },
    {
      key: "mainProducer",
      title: "Productor Principal",
      sortable: true,
      width: "20%",
      align: "center"
    },
    {
      key: "releaseDate",
      title: "Lanzamiento",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => formatDate(item.releaseDate)
    },
    {
      key: "yearsSinceRelease",
      title: "Antigüedad",
      sortable: false,
      width: "10%",
      align: "center",
      render: (item) => getYearsSinceRelease(item.releaseDate)
    },
    {
      key: "copiesSold",
      title: "Copias Vendidas",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => `${formatNumber(item.copiesSold)} copias`
    },
    {
      key: "totalTracks",
      title: "Total Pistas",
      sortable: false,
      width: "15%",
      align: "center",
      render: (item) => {
        const tracks = item.numberOfTracks || 0;
        return (
          <span className="tracks-count">
            {tracks} pista{tracks !== 1 ? 's' : ''}
          </span>
        );
      }
    }
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderAlbumDetails = (album: AlbumResponseDto) => {
    const tracks = album.numberOfTracks || 0;
    
    return (
      <div className="album-details">
        <div className="detail-item">
          <strong>Título:</strong> <span>{album.title}</span>
        </div>
        <div className="detail-item">
          <strong>Productor Principal:</strong> <span>{album.mainProducer}</span>
        </div>
        <div className="detail-item">
          <strong>Fecha de Lanzamiento:</strong> <span>{formatDate(album.releaseDate)}</span>
        </div>
        <div className="detail-item">
          <strong>Antigüedad:</strong> <span>{getYearsSinceRelease(album.releaseDate)}</span>
        </div>
        <div className="detail-item">
          <strong>Copias Vendidas:</strong> <span>{formatNumber(album.copiesSold)} copias</span>
        </div>
        <div className="detail-item">
          <strong>Total de Pistas:</strong> <span>{tracks} pista{tracks !== 1 ? 's' : ''}</span>
        </div>
        {tracks > 0 && (
          <div className="detail-item tracks-list">
            <strong>Pistas:</strong>
            
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="album_management" className="content-section active">
      <GenericTable<AlbumResponseDto>
        title="Gestión de Álbumes"
        description="Administre todos los álbumes del sistema"
        data={albums}
        columns={columns}
        loading={loading}
        onReload={() => fetchAlbums()}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingAlbum}
        onEditingChange={setEditingAlbum}
        deletingItem={deletingAlbum}
        onDeletingChange={setDeletingAlbum}
        itemsPerPage={30}
        className="album-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

<<<<<<< Updated upstream
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
=======
      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Álbum"
          fields={albumFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Álbum"
        />
>>>>>>> Stashed changes
      )}

      {/* Modal de edición usando componente genérico */}
      {editingAlbum && (
<<<<<<< Updated upstream
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
=======
        <EditModal
          title="Editar Álbum"
          fields={albumEditFields}
          initialData={{
            title: editingAlbum.title,
            mainProducer: editingAlbum.mainProducer,
            releaseDate: editingAlbum.releaseDate ? 
              (new Date(editingAlbum.releaseDate).toISOString().split("T")[0]) : "",
            copiesSold: editingAlbum.copiesSold.toString()
          }}
          itemId={editingAlbum.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingAlbum(null)}
          loading={loading}
          submitText="Actualizar Álbum"
        />
>>>>>>> Stashed changes
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingAlbum && (
        <DeleteModal<AlbumResponseDto>
          title="¿Eliminar Álbum?"
          item={deletingAlbum}
          itemName="Álbum"
          itemId={deletingAlbum.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingAlbum(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer. Todas las canciones asociadas también serán eliminadas."
          renderDetails={renderAlbumDetails}
        />
      )}
    </section>
  );
};

export default AlbumManagement;