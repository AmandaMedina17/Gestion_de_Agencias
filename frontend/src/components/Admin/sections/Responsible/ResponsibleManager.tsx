import React, { useState, useEffect } from "react";
import { useResponsible } from "../../../../context/ResponsibleContext";
import { Icon } from "../../../icons";
import './ResponsibleStyle.css';

const ResponsibleManagement: React.FC = () => {
  const {
    responsibles,
    fetchResponsibles,
    createResponsible,
    updateResponsible,
    deleteResponsible,
    loading,
    error,
    clearError,
  } = useResponsible();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingResponsible, setEditingResponsible] = useState<any>(null);
  const [deletingResponsible, setDeletingResponsible] = useState<any>(null);
  const [newResponsibleName, setNewResponsibleName] = useState("");
  const [editResponsibleName, setEditResponsibleName] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Cargar responsables solo cuando se monta el componente
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await fetchResponsibles();
          setDataLoaded(true);
        } catch (err) {
          console.error("Error loading initial data:", err);
        }
      }
    };

    loadInitialData();
  }, [dataLoaded]);

  // Filtrar y ordenar responsables - solo procesamiento local
  const filteredAndSortedResponsibles = React.useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = responsibles;

    // Aplicar filtro
    if (filter) {
      filtered = responsibles.filter((resp) =>
        resp.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Aplicar ordenamiento por nombre
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
      } else {
        return b.name.localeCompare(a.name, "es", { sensitivity: "base" });
      }
    });

    return sorted;
  }, [responsibles, filter, sortOrder, dataLoaded]);

  // Manejar creación de responsable
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!newResponsibleName.trim()) {
      setMessage({
        type: "error",
        text: "Por favor, ingrese un nombre válido",
      });
      return;
    }

    try {
      await createResponsible({ name: newResponsibleName.trim() });
      setMessage({
        type: "success",
        text: `Responsable "${newResponsibleName.trim()}" creado exitosamente`,
      });
      setNewResponsibleName("");
      setShowCreateForm(false);

      // Recargar la lista después de crear
      await fetchResponsibles();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear el responsable",
      });
    }
  };

  // Manejar actualización de responsable
  const handleUpdate = async () => {
    if (!editingResponsible || !editResponsibleName.trim()) {
      return;
    }

    try {
      await updateResponsible(editingResponsible.id, {
        name: editResponsibleName.trim(),
      });
      setMessage({
        type: "success",
        text: `Responsable actualizado exitosamente a "${editResponsibleName.trim()}"`,
      });
      setEditingResponsible(null);
      setEditResponsibleName("");

      // Recargar la lista después de actualizar
      await fetchResponsibles();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar el responsable",
      });
    }
  };

  // Manejar eliminación de responsable
  const handleDelete = async () => {
    if (!deletingResponsible) {
      return;
    }

    try {
      await deleteResponsible(deletingResponsible.id);
      setMessage({
        type: "success",
        text: `Responsable "${deletingResponsible.name}" eliminado exitosamente`,
      });
      setDeletingResponsible(null);

      // Recargar la lista después de eliminar
      await fetchResponsibles();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar el responsable",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    try {
      await fetchResponsibles();
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
  const startEdit = (responsible: any) => {
    setEditingResponsible(responsible);
    setEditResponsibleName(responsible.name);
  };

  // Iniciar eliminación
  const startDelete = (responsible: any) => {
    setDeletingResponsible(responsible);
  };

  // Limpiar filtro
  const handleClearFilter = () => {
    setFilter("");
  };

  // Alternar ordenamiento
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <section id="responsible_management" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Responsables</h1>
          <p className="section-description">
            Administre todos los responsables del sistema
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
              Nuevo Responsable
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
              <button
                className="sort-order-btn"
                onClick={toggleSortOrder}
                disabled={loading}
                title={sortOrder === "asc" ? "Orden A-Z" : "Orden Z-A"}
              >
                {sortOrder === "asc" ? <Icon name="down" size={18} />: <Icon name="up" size={18} />}
              </button>
            </div>

            <button
              className="reload-button"
              onClick={handleReload}
              disabled={loading}
              title="Recargar datos"
            >
              <Icon name="reload" size={16} />
            </button>
          </div>
        </div>

        {/* Contador de resultados */}
        {dataLoaded && (
          <div className="results-info">
            <span className="results-count">
              {filteredAndSortedResponsibles.length} de {responsibles.length}{" "}
              responsables
            </span>
            <span className="sort-info">
              Orden: {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </span>
          </div>
        )}

        {/* Grid de responsables */}
        <div className="responsibles-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando responsables...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedResponsibles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No hay responsables</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando el primer responsable"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  <span className="button-icon">+</span>
                  Crear Primer Responsable
                </button>
              )}
            </div>
          ) : (
            <div className="grid-container">
              {filteredAndSortedResponsibles.map((responsible) => (
                <div key={responsible.id} className="responsible-card">
                  <div className="responsible-name">{responsible.name}</div>
                  <div className="responsible-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => startEdit(responsible)}
                      title="Editar responsable"
                      disabled={loading}
                    >
                      <Icon name="edit" size={18} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => startDelete(responsible)}
                      title="Eliminar responsable"
                      disabled={loading}
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de creación */}
        {showCreateForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Crear Nuevo Responsable</h3>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Juan Pérez García"
                    value={newResponsibleName}
                    onChange={(e) => setNewResponsibleName(e.target.value)}
                    autoFocus
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading || !newResponsibleName.trim()}
                  >
                    {loading ? "Creando..." : "Crear Responsable"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewResponsibleName("");
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
        {editingResponsible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Editar Responsable</h3>
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Juan Pérez García"
                  value={editResponsibleName}
                  onChange={(e) => setEditResponsibleName(e.target.value)}
                  autoFocus
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
              <div className="modal-actions">
                <button
                  className="submit-button"
                  onClick={handleUpdate}
                  disabled={
                    loading ||
                    !editResponsibleName.trim() ||
                    editResponsibleName === editingResponsible.name
                  }
                >
                  {loading ? "Actualizando..." : "Actualizar"}
                </button>
                <button
                  className="cancel-button"
                  onClick={() => {
                    setEditingResponsible(null);
                    setEditResponsibleName("");
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
        {deletingResponsible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>¿Eliminar Responsable?</h3>
              <div className="delete-confirmation">
                <p>¿Está seguro de que desea eliminar al responsable?</p>
                <div className="responsible-details">
                  <div className="detail-item">
                    <strong>Nombre:</strong> {deletingResponsible.name}
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
                  onClick={() => setDeletingResponsible(null)}
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

export default ResponsibleManagement;
