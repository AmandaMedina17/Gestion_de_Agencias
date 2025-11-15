import React, { useState, useEffect } from "react";
import { usePlace } from "../../../../context/PlaceContext";
import { Icon } from "../../../icons";
import "./PlaceStyle.css";

const PlaceManagement: React.FC = () => {
  const {
    places,
    fetchPlaces,
    createPlace,
    updatePlace,
    deletePlace,
    loading,
    error,
    clearError,
  } = usePlace();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState<any>(null);
  const [deletingPlace, setDeletingPlace] = useState<any>(null);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [editPlaceName, setEditPlaceName] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Cargar lugares solo cuando se monta el componente
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await fetchPlaces();
          setDataLoaded(true);
        } catch (err) {
          console.error("Error loading initial data:", err);
        }
      }
    };

    loadInitialData();
  }, [dataLoaded]);

  // Filtrar y ordenar lugares - solo procesamiento local
  const filteredAndSortedPlaces = React.useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = places;

    // Aplicar filtro
    if (filter) {
      filtered = places.filter((place) =>
        place.name.toLowerCase().includes(filter.toLowerCase())
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
  }, [places, filter, sortOrder, dataLoaded]);

  // Manejar creación de lugar
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!newPlaceName.trim()) {
      setMessage({
        type: "error",
        text: "Por favor, ingrese un nombre válido",
      });
      return;
    }

    try {
      await createPlace({ name: newPlaceName.trim() });
      setMessage({
        type: "success",
        text: `Lugar "${newPlaceName.trim()}" creado exitosamente`,
      });
      setNewPlaceName("");
      setShowCreateForm(false);

      // Recargar la lista después de crear
      await fetchPlaces();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear el lugar",
      });
    }
  };

  // Manejar actualización de lugar
  const handleUpdate = async () => {
    if (!editingPlace || !editPlaceName.trim()) {
      return;
    }

    try {
      await updatePlace(editingPlace.id, { name: editPlaceName.trim() });
      setMessage({
        type: "success",
        text: `Lugar actualizado exitosamente a "${editPlaceName.trim()}"`,
      });
      setEditingPlace(null);
      setEditPlaceName("");

      // Recargar la lista después de actualizar
      await fetchPlaces();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar el lugar",
      });
    }
  };

  // Manejar eliminación de lugar
  const handleDelete = async () => {
    if (!deletingPlace) {
      return;
    }

    try {
      await deletePlace(deletingPlace.id);
      setMessage({
        type: "success",
        text: `Lugar "${deletingPlace.name}" eliminado exitosamente`,
      });
      setDeletingPlace(null);

      // Recargar la lista después de eliminar
      await fetchPlaces();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar el lugar",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    try {
      await fetchPlaces();
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
  const startEdit = (place: any) => {
    setEditingPlace(place);
    setEditPlaceName(place.name);
  };

  // Iniciar eliminación
  const startDelete = (place: any) => {
    setDeletingPlace(place);
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
    <section id="place_management" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Lugares</h1>
          <p className="section-description">
            Administre todos los lugares del sistema en una sola vista
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
              Nuevo Lugar
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
              {filteredAndSortedPlaces.length} de {places.length} lugares
            </span>
            <span className="sort-info">
              Orden: {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </span>
          </div>
        )}

        {/* Grid de lugares */}
        <div className="places-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando lugares...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedPlaces.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>No hay lugares</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando el primer lugar"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  <span className="button-icon">+</span>
                  Crear Primer Lugar
                </button>
              )}
            </div>
          ) : (
            <div className="grid-container">
              {filteredAndSortedPlaces.map((place) => (
                <div key={place.id} className="place-card">
                  <div className="place-name">{place.name}</div>
                  <div className="place-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => startEdit(place)}
                      title="Editar lugar"
                      disabled={loading}
                    >
                      <Icon name="edit" size={18} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => startDelete(place)}
                      title="Eliminar lugar"
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
              <h3>Crear Nuevo Lugar</h3>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label className="form-label">Nombre del lugar</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Auditorio Principal, Sala de Ensayos, etc."
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
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
                    disabled={loading || !newPlaceName.trim()}
                  >
                    {loading ? "Creando..." : "Crear Lugar"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewPlaceName("");
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
        {editingPlace && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Editar Lugar</h3>
              <div className="form-group">
                <label className="form-label">Nombre del lugar</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Auditorio Principal, Sala de Ensayos, etc."
                  value={editPlaceName}
                  onChange={(e) => setEditPlaceName(e.target.value)}
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
                    !editPlaceName.trim() ||
                    editPlaceName === editingPlace.name
                  }
                >
                  {loading ? "Actualizando..." : "Actualizar"}
                </button>
                <button
                  className="cancel-button"
                  onClick={() => {
                    setEditingPlace(null);
                    setEditPlaceName("");
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
        {deletingPlace && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>¿Eliminar Lugar?</h3>
              <div className="delete-confirmation">
                <p>¿Está seguro de que desea eliminar este lugar?</p>
                <div className="place-details">
                  <div className="detail-item">
                    <strong>Nombre:</strong> {deletingPlace.name}
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
                  onClick={() => setDeletingPlace(null)}
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

export default PlaceManagement;
