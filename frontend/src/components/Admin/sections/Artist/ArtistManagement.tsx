import React, { useState, useEffect } from "react";
import { useArtist } from "../../../../context/ArtistContext";
import { useApprentice } from "../../../../context/ApprenticeContext";
import { Icon } from "../../../icons";
import './ArtistStyle.css'

export enum ArtistStatus{
    ACTIVO = "ACTIVO",
    EN_PAUSA = "EN_PAUSA",
    INACTIVO = "INACTIVO"
}

const ArtistManagement: React.FC = () => {
  const {
    artists,
    fetchArtists,
    createArtist,
    updateArtist,
    deleteArtist,
    loading,
    error,
    clearError,
  } = useArtist();

  const { apprentices, fetchApprentices } = useApprentice();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"stageName" | "birthDate" | "transitionDate" | "status">("stageName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<any>(null);
  const [deletingArtist, setDeletingArtist] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Estados del formulario
  const [newArtist, setNewArtist] = useState({
    stageName: "",
    birthDate: "",
    transitionDate: "",
    status: ArtistStatus.ACTIVO,
    groupId: "",
    apprenticeId: "",
  });

  const [editArtist, setEditArtist] = useState({
    stageName: "",
    birthDate: "",
    transitionDate: "",
    status: ArtistStatus.ACTIVO,
    groupId: "",
    apprenticeId: "",
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await fetchArtists();
          await fetchApprentices();
          setDataLoaded(true);
        } catch (err) {
          console.error("Error loading initial data:", err);
        }
      }
    };

    loadInitialData();
  }, [dataLoaded]);

  // Filtrar y ordenar artistas
  const filteredAndSortedArtists = React.useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = artists;

    // Aplicar filtro por nombre artístico
    if (filter) {
      filtered = artists.filter((artist) =>
        artist.stageName.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "stageName":
          aValue = a.stageName;
          bValue = b.stageName;
          break;
        case "birthDate":
          aValue = new Date(a.birthday);
          bValue = new Date(b.birthday);
          break;
        case "transitionDate":
          aValue = new Date(a.transitionDate);
          bValue = new Date(b.transitionDate);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.stageName;
          bValue = b.stageName;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [artists, filter, sortBy, sortOrder, dataLoaded]);

  // Obtener nombre del aprendiz por ID
  const getApprenticeName = (apprenticeId: string) => {
    if (!apprenticeId) return "No asignado";
    const apprentice = apprentices.find(a => a.id === apprenticeId);
    return apprentice ? apprentice.fullName : "No encontrado";
  };

  // Manejar creación de artista
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!newArtist.stageName.trim()) {
      setMessage({
        type: "error",
        text: "Por favor, complete el nombre artístico",
      });
      return;
    }

    try {
      await createArtist({
        ...newArtist,
        birthday: new Date(newArtist.birthDate),
        transitionDate: new Date(newArtist.transitionDate),
        
        
      });

      setMessage({
        type: "success",
        text: `Artista "${newArtist.stageName}" creado exitosamente`,
      });

      // Resetear formulario
      setNewArtist({
        stageName: "",
        birthDate: "",
        transitionDate: "",
        status: ArtistStatus.ACTIVO,
        groupId: "",
        apprenticeId: "",
      });

      setShowCreateForm(false);
      await fetchArtists();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear el artista",
      });
    }
  };

  // Manejar actualización de artista
  const handleUpdate = async () => {
    if (!editingArtist || !editArtist.stageName.trim()) {
      return;
    }

    try {
      await updateArtist(editingArtist.id, {
        ...editArtist,
        birthday: new Date(editArtist.birthDate),
        transitionDate: new Date(editArtist.transitionDate),
      });

      setMessage({
        type: "success",
        text: `Artista actualizado exitosamente`,
      });

      setEditingArtist(null);
      setEditArtist({
        stageName: "",
        birthDate: "",
        transitionDate: "",
        status: ArtistStatus.ACTIVO,
        groupId: "",
        apprenticeId: "",
      });

      await fetchArtists();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar el artista",
      });
    }
  };

  // Manejar eliminación de artista
  const handleDelete = async () => {
    if (!deletingArtist) {
      return;
    }

    try {
      await deleteArtist(deletingArtist.id);
      setMessage({
        type: "success",
        text: `Artista "${deletingArtist.stageName}" eliminado exitosamente`,
      });
      setDeletingArtist(null);
      await fetchArtists();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar el artista",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    try {
      await fetchArtists();
      await fetchApprentices();
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
  const startEdit = (artist: any) => {
    setEditingArtist(artist);
    setEditArtist({
      stageName: artist.stageName,
      birthDate: artist.birthday ? artist.birthday.split("T")[0] : "",
      transitionDate: artist.transitionDate ? artist.transitionDate.split("T")[0] : "",
      status: artist.status,
      groupId: artist.groupId || "",
      apprenticeId: artist.apprenticeId || "",
    });
  };

  // Iniciar eliminación
  const startDelete = (artist: any) => {
    setDeletingArtist(artist);
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

  // Traducir estados
    const getStatusText = (status: ArtistStatus) => {
    const statusMap = {
      [ArtistStatus.ACTIVO]: "Activo",
      [ArtistStatus.INACTIVO]: "Inactivo",
      [ArtistStatus.EN_PAUSA]: "En Pausa",
    };
    return statusMap[status] || status;
  };

  return (
    <section id="artist_management" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Artistas</h1>
          <p className="section-description">
            Administre todos los artistas del sistema 
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
              <span className="button-icon"><Icon name="plus" size={20} /></span>
              Nuevo Artista
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input
                type="text"
                className="form-input search-input"
                placeholder="Filtrar por nombre artístico..."
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
                <option value="stageName">Ordenar por nombre</option>
                <option value="birthDate">Ordenar por fecha nacimiento</option>
                <option value="transitionDate">Ordenar por fecha transición</option>
                <option value="status">Ordenar por estado</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={toggleSortOrder}
                disabled={loading}
                title={sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"}
              >
                {sortOrder === "asc" ? <Icon name="down" size={18} /> : <Icon name="up" size={18} />}
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
              {filteredAndSortedArtists.length} de {artists.length} artistas
            </span>
            <span className="sort-info">
              Orden:{" "}
              {sortBy === "stageName"
                ? "Nombre Artístico"
                : sortBy === "birthDate"
                ? "Fecha Nacimiento"
                : sortBy === "transitionDate"
                ? "Fecha Transición"
                : "Estado"}{" "}
              •{sortOrder === "asc" ? " Ascendente" : " Descendente"}
            </span>
          </div>
        )}

        {/* Grid de artistas */}
        <div className="artists-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando artistas...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedArtists.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎤</div>
              <h3>No hay artistas</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando el primer artista"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  <span className="button-icon"><Icon name="plus" size={20} /></span>
                  Crear Primer Artista
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="artists-table">
                <thead>
                  <tr>
                    <th>Nombre Artístico</th>
                    <th>Fecha Nacimiento</th>
                    <th>Fecha Transición</th>
                    <th>Estado</th>
                    <th>Grupo</th>
                    <th>Aprendiz Asociado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedArtists.map((artist) => (
                    <tr key={artist.id} className="artist-row">
                      <td className="artist-name-cell">
                        <div className="artist-name">{artist.stageName}</div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {formatDate(artist.birthday.toString())}
                        </div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {formatDate(artist.transitionDate.toString())}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${artist.status.toLowerCase()}`}
                        >
                          {getStatusText(artist.status)}
                        </span>
                      </td>
                      <td>
                        <div className="detail-value">
                          {artist.groupId || "No asignado"}
                        </div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {getApprenticeName(artist.apprenticeId)}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => startEdit(artist)}
                            title="Editar artista"
                            disabled={loading}
                          >
                            <Icon name="edit" size={18} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => startDelete(artist)}
                            title="Eliminar artista"
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
            </div>
          )}
        </div>

        {/* Modal de creación */}
        {showCreateForm && (
          <div className="modal-overlay artist-modal">
            <div className="modal-content">
              <h3>Crear Nuevo Artista</h3>
              <form onSubmit={handleCreate}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre artístico *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Bad Bunny"
                      value={newArtist.stageName}
                      onChange={(e) =>
                        setNewArtist({
                          ...newArtist,
                          stageName: e.target.value,
                        })
                      }
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha de nacimiento *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newArtist.birthDate}
                      onChange={(e) =>
                        setNewArtist({
                          ...newArtist,
                          birthDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fecha de transición *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newArtist.transitionDate}
                      onChange={(e) =>
                        setNewArtist({
                          ...newArtist,
                          transitionDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={newArtist.status}
                      onChange={(e) =>
                        setNewArtist({
                          ...newArtist,
                          status: e.target.value as ArtistStatus,
                        })
                      }
                    >
                      <option value={ArtistStatus.ACTIVO}>Activo</option>
                      <option value={ArtistStatus.INACTIVO}>Inactivo</option>
                      <option value={ArtistStatus.EN_PAUSA}>En Pausa</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ID de Grupo</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Opcional"
                      value={newArtist.groupId}
                      onChange={(e) =>
                        setNewArtist({
                          ...newArtist,
                          groupId: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Aprendiz Asociado *</label>
                    <select
                      className="form-select"
                      value={newArtist.apprenticeId}
                      onChange={(e) =>
                        setNewArtist({
                          ...newArtist,
                          apprenticeId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Seleccione un aprendiz</option>
                      {apprentices.map((apprentice) => (
                        <option key={apprentice.id} value={apprentice.id}>
                          {apprentice.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading || !newArtist.stageName.trim() || !newArtist.apprenticeId}
                  >
                    {loading ? "Creando..." : "Crear Artista"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewArtist({
                        stageName: "",
                        birthDate: "",
                        transitionDate: "",
                        status: ArtistStatus.ACTIVO,
                        groupId: "",
                        apprenticeId: "",
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
        {editingArtist && (
          <div className="modal-overlay artist-modal">
            <div className="modal-content">
              <h3>Editar Artista</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre artístico *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editArtist.stageName}
                    onChange={(e) =>
                      setEditArtist({
                        ...editArtist,
                        stageName: e.target.value,
                      })
                    }
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de nacimiento *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editArtist.birthDate}
                    onChange={(e) =>
                      setEditArtist({
                        ...editArtist,
                        birthDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha de transición *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editArtist.transitionDate}
                    onChange={(e) =>
                      setEditArtist({
                        ...editArtist,
                        transitionDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={editArtist.status}
                    onChange={(e) =>
                      setEditArtist({
                        ...editArtist,
                        status: e.target.value as ArtistStatus,
                      })
                    }
                  >
                    <option value={ArtistStatus.ACTIVO}>Activo</option>
                    <option value={ArtistStatus.INACTIVO}>Inactivo</option>
                    <option value={ArtistStatus.EN_PAUSA}>En Pausa</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ID de Grupo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editArtist.groupId}
                    onChange={(e) =>
                      setEditArtist({
                        ...editArtist,
                        groupId: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Aprendiz Asociado *</label>
                  <select
                    className="form-select"
                    value={editArtist.apprenticeId}
                    onChange={(e) =>
                      setEditArtist({
                        ...editArtist,
                        apprenticeId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Seleccione un aprendiz</option>
                    {apprentices.map((apprentice) => (
                      <option key={apprentice.id} value={apprentice.id}>
                        {apprentice.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="submit-button"
                  onClick={handleUpdate}
                  disabled={loading || !editArtist.stageName.trim() || !editArtist.apprenticeId}
                >
                  {loading ? "Actualizando..." : "Actualizar"}
                </button>
                <button
                  className="cancel-button"
                  onClick={() => {
                    setEditingArtist(null);
                    setEditArtist({
                      stageName: "",
                      birthDate: "",
                      transitionDate: "",
                      status: ArtistStatus.ACTIVO,
                      groupId: "",
                      apprenticeId: "",
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
        {deletingArtist && (
          <div className="modal-overlay artist-modal">
            <div className="modal-content">
              <h3>¿Eliminar Artista?</h3>
              <div className="delete-confirmation">
                <p>¿Está seguro de que desea eliminar este artista?</p>
                <div className="artist-details">
                  <div className="detail-item">
                    <strong>Nombre Artístico:</strong> {deletingArtist.stageName}
                  </div>
                  <div className="detail-item">
                    <strong>Fecha Nacimiento:</strong> {formatDate(deletingArtist.birthDate)}
                  </div>
                  <div className="detail-item">
                    <strong>Fecha Transición:</strong> {formatDate(deletingArtist.transitionDate)}
                  </div>
                  <div className="detail-item">
                    <strong>Estado:</strong> {getStatusText(deletingArtist.status)}
                  </div>
                  <div className="detail-item">
                    <strong>Grupo:</strong> {deletingArtist.groupId || "No asignado"}
                  </div>
                  <div className="detail-item">
                    <strong>Aprendiz Asociado:</strong> {getApprenticeName(deletingArtist.apprenticeId)}
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
                  onClick={() => setDeletingArtist(null)}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistManagement;