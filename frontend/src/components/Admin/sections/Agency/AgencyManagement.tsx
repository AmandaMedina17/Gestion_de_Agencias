import React, { useState, useEffect } from "react";
import { useAgency } from "../../../../context/AgencyContext";
import { Icon } from "../../../icons";
import './AgencyStyle.css'

export enum AgencyType {
  PRINCIPAL = "PRINCIPAL",
  SECUNDARIA = "SECUNDARIA",
  TEMPORAL = "TEMPORAL",
}

const AgencyManagement: React.FC = () => {
  const {
    agencies,
    fetchAgencies,
    createAgency,
    updateAgency,
    deleteAgency,
    loading,
    error,
    clearError,
  } = useAgency();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "place" | "dateFundation">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAgency, setEditingAgency] = useState<any>(null);
  const [deletingAgency, setDeletingAgency] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Estados del formulario
  const [newAgency, setNewAgency] = useState({
    place: "",
    nameAgency: "",
    dateFundation: "",
  });

  const [editAgency, setEditAgency] = useState({
    place: "",
    nameAgency: "",
    dateFundation: "",
  });

  // Cargar agencias solo cuando se monta el componente
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await fetchAgencies();
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

  // Filtrar y ordenar agencias
  const filteredAndSortedAgencies = React.useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = agencies;

    // Aplicar filtro por nombre o lugar
    if (filter) {
      filtered = agencies.filter((agency) =>
        agency.nameAgency.toLowerCase().includes(filter.toLowerCase()) ||
        agency.place.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.nameAgency;
          bValue = b.nameAgency;
          break;
        case "place":
          aValue = a.place;
          bValue = b.place;
          break;
        case "dateFundation":
          aValue = new Date(a.dateFundation);
          bValue = new Date(b.dateFundation);
          break;
        default:
          aValue = a.nameAgency;
          bValue = b.nameAgency;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [agencies, filter, sortBy, sortOrder, dataLoaded]);

  // PAGINACIÓN: calcular páginas y slice
  const totalPages = Math.ceil(filteredAndSortedAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgencies = filteredAndSortedAgencies.slice(startIndex, startIndex + itemsPerPage);

  // Manejar creación de agencia
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (
      !newAgency.place.trim() ||
      !newAgency.nameAgency.trim() ||
      !newAgency.dateFundation
    ) {
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios",
      });
      return;
    }

    if (new Date(newAgency.dateFundation) > new Date()) {
      setMessage({
        type: "error",
        text: "La fecha de fundación no puede ser futura",
      });
      return;
    }

    try {
      await createAgency({
        ...newAgency,
        dateFundation: new Date(newAgency.dateFundation),
      });

      setMessage({
        type: "success",
        text: `Agencia "${newAgency.nameAgency}" creada exitosamente`,
      });

      // Resetear formulario
      setNewAgency({
        place: "",
        nameAgency: "",
        dateFundation: "",
      });

      setShowCreateForm(false);
      await fetchAgencies();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear la agencia",
      });
    }
  };

  // Manejar actualización de agencia
  const handleUpdate = async () => {
    if (
      !editingAgency ||
      !editAgency.place.trim() ||
      !editAgency.nameAgency.trim() ||
      !editAgency.dateFundation
    ) {
      return;
    }

    if (new Date(editAgency.dateFundation) > new Date()) {
      setMessage({
        type: "error",
        text: "La fecha de fundación no puede ser futura",
      });
      return;
    }

    try {
      await updateAgency(editingAgency.id, {
        place: editAgency.place.trim(),
        nameAgency: editAgency.nameAgency.trim(),
        dateFundation: new Date(editAgency.dateFundation),
      });

      setMessage({
        type: "success",
        text: `Agencia actualizada exitosamente`,
      });

      setEditingAgency(null);
      setEditAgency({
        place: "",
        nameAgency: "",
        dateFundation: "",
      });

      await fetchAgencies();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar la agencia",
      });
    }
  };

  // Manejar eliminación de agencia
  const handleDelete = async () => {
    if (!deletingAgency) {
      return;
    }

    try {
      await deleteAgency(deletingAgency.id);
      setMessage({
        type: "success",
        text: `Agencia "${deletingAgency.nameAgency}" eliminada exitosamente`,
      });
      setDeletingAgency(null);
      await fetchAgencies();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar la agencia",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    try {
      await fetchAgencies();
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
  const startEdit = (agency: any) => {
    setEditingAgency(agency);
    setEditAgency({
      place: agency.place,
      nameAgency: agency.nameAgency,
      dateFundation: agency.dateFundation.split("T")[0], // Formato YYYY-MM-DD
    });
  };

  // Iniciar eliminación
  const startDelete = (agency: any) => {
    setDeletingAgency(agency);
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
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  // Obtener fecha actual en formato YYYY-MM-DD
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <section id="agency_manager" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Agencias</h1>
          <p className="section-description">
            Administre todas las agencias del sistema
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
              Nueva Agencia
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input
                type="text"
                className="form-input search-input"
                placeholder="Filtrar por nombre o lugar..."
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
                <option value="place">Ordenar por lugar</option>
                <option value="dateFundation">Ordenar por fecha fundación</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={toggleSortOrder}
                disabled={loading}
                title={
                  sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"
                }
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
              {filteredAndSortedAgencies.length} de {agencies.length} {" "}
              agencias
            </span>
            <span className="sort-info">
              Orden: {" "}
              {sortBy === "name"
                ? "Nombre"
                : sortBy === "place"
                ? "Lugar"
                : "Fecha Fundación"} {" "}
              •{sortOrder === "asc" ? " Ascendente" : " Descendente"}
            </span>
          </div>
        )}

        {/* Grid de agencias */}
        <div className="agencies-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando agencias...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedAgencies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>No hay agencias</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando la primera agencia"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={loading}
                >
                  <span className="button-icon"><Icon name="plus" size={20} /></span>
                  Crear Primera Agencia
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="agencies-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Lugar</th>
                    <th>Fecha Fundación</th>
                    <th>Antigüedad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAgencies.map((agency) => (
                    <tr key={agency.id} className="agency-row">
                      <td className="agency-name-cell">
                        <div className="agency-name">{agency.nameAgency}</div>
                      </td>
                      <td>
                        <div className="detail-value">{agency.place}</div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {formatDate(agency.dateFundation.toString())}
                        </div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {Math.floor((new Date().getTime() - new Date(agency.dateFundation).getTime()) / (1000 * 3600 * 24 * 365))} años
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => startEdit(agency)}
                            title="Editar agencia"
                            disabled={loading}
                          >
                            <Icon name="edit" size={18} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => startDelete(agency)}
                            title="Eliminar agencia"
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
        <div className="modal-overlay agency-modal">
          <div className="modal-content">
            <h3>Crear Nueva Agencia</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre de la agencia *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Agencia Central"
                    value={newAgency.nameAgency}
                    onChange={(e) =>
                      setNewAgency({
                        ...newAgency,
                        nameAgency: e.target.value,
                      })
                    }
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lugar *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Ciudad, País"
                    value={newAgency.place}
                    onChange={(e) =>
                      setNewAgency({
                        ...newAgency,
                        place: e.target.value,
                      })
                    }
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Fecha de fundación *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newAgency.dateFundation}
                    onChange={(e) =>
                      setNewAgency({
                        ...newAgency,
                        dateFundation: e.target.value,
                      })
                    }
                    required
                    max={getTodayDate()}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    loading ||
                    !newAgency.nameAgency.trim() ||
                    !newAgency.place.trim() ||
                    !newAgency.dateFundation
                  }
                >
                  {loading ? "Creando..." : "Crear Agencia"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewAgency({
                      place: "",
                      nameAgency: "",
                      dateFundation: "",
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
      {editingAgency && (
        <div className="modal-overlay agency-modal">
          <div className="modal-content">
            <h3>Editar Agencia</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre de la agencia *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editAgency.nameAgency}
                  onChange={(e) =>
                    setEditAgency({
                      ...editAgency,
                      nameAgency: e.target.value,
                    })
                  }
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lugar *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editAgency.place}
                  onChange={(e) =>
                    setEditAgency({
                      ...editAgency,
                      place: e.target.value,
                    })
                  }
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label className="form-label">Fecha de fundación *</label>
                <input
                  type="date"
                  className="form-input"
                  value={editAgency.dateFundation}
                  onChange={(e) =>
                    setEditAgency({
                      ...editAgency,
                      dateFundation: e.target.value,
                    })
                  }
                  required
                  max={getTodayDate()}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={handleUpdate}
                disabled={
                  loading ||
                  !editAgency.nameAgency.trim() ||
                  !editAgency.place.trim() ||
                  !editAgency.dateFundation
                }
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setEditingAgency(null);
                  setEditAgency({
                    place: "",
                    nameAgency: "",
                    dateFundation: "",
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
      {deletingAgency && (
        <div className="modal-overlay agency-modal">
          <div className="modal-content">
            <h3>¿Eliminar Agencia?</h3>
            <div className="delete-confirmation">
              <p>¿Está seguro de que desea eliminar esta agencia?</p>
              <div className="agency-details">
                <div className="detail-item">
                  <strong>Nombre:</strong> {deletingAgency.nameAgency}
                </div>
                <div className="detail-item">
                  <strong>Lugar:</strong> {deletingAgency.place}
                </div>
                <div className="detail-item">
                  <strong>Fecha de fundación:</strong> {formatDate(deletingAgency.dateFundation)}
                </div>
                <div className="detail-item">
                  <strong>Antigüedad:</strong> {Math.floor((new Date().getTime() - new Date(deletingAgency.dateFundation).getTime()) / (1000 * 3600 * 24 * 365))} años
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
                onClick={() => setDeletingAgency(null)}
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

export default AgencyManagement;