import React, { useState, useEffect } from "react";
import { useBillboardList } from "../../../../context/BillboardListContext";
import { Icon } from "../../../icons";
import './BillboardListStyle.css';

export enum BillboardListScope{
    INTERNACIONAL = "INTERNACIONAL",
    NACIONAL = "NACIONAL"
}


const BillboardListManagement: React.FC = () => {
  const {
    billboardLists,
    fetchBillboardLists,
    createBillboardList,
    updateBillboardList,
    deleteBillboardList,
    loading,
    error,
    clearError,
  } = useBillboardList();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"nameList" | "publicDate" | "scope" | "endList">("nameList");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingList, setEditingList] = useState<any>(null);
  const [deletingList, setDeletingList] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Estados del formulario
  const [newList, setNewList] = useState({
    publicDate: "",
    scope: BillboardListScope.NACIONAL,
    nameList: "",
    endList: "100",
  });

  const [editList, setEditList] = useState({
    publicDate: "",
    scope: BillboardListScope.NACIONAL,
    nameList: "",
    endList: "100",
  });

  // Cargar listas cuando se monta el componente
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await fetchBillboardLists();
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

  // Filtrar y ordenar listas
  const filteredAndSortedLists = React.useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = billboardLists;

    // Aplicar filtro por nombre o alcance
    if (filter) {
      filtered = billboardLists.filter((list) =>
        list.nameList.toLowerCase().includes(filter.toLowerCase()) ||
        list.scope.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "nameList":
          aValue = a.nameList;
          bValue = b.nameList;
          break;
        case "publicDate":
          aValue = new Date(a.publicDate);
          bValue = new Date(b.publicDate);
          break;
        case "scope":
          aValue = a.scope;
          bValue = b.scope;
          break;
        case "endList":
          aValue = a.endList;
          bValue = b.endList;
          break;
        default:
          aValue = a.nameList;
          bValue = b.nameList;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [billboardLists, filter, sortBy, sortOrder, dataLoaded]);

  // PAGINACIÓN: calcular páginas y slice
  const totalPages = Math.ceil(filteredAndSortedLists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLists = filteredAndSortedLists.slice(startIndex, startIndex + itemsPerPage);

  // Manejar creación de lista
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (
      !newList.publicDate ||
      !newList.nameList.trim() ||
      !newList.endList
    ) {
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios",
      });
      return;
    }

    const endListNumber = parseInt(newList.endList);
    if (endListNumber <= 0) {
      setMessage({
        type: "error",
        text: "El fin de lista debe ser mayor a 0",
      });
      return;
    }

    try {
      await createBillboardList({
        publicDate: new Date(newList.publicDate),
        scope: newList.scope,
        nameList: newList.nameList.trim(),
        endList: endListNumber,
      });

      setMessage({
        type: "success",
        text: `Lista "${newList.nameList}" creada exitosamente`,
      });

      // Resetear formulario
      setNewList({
        publicDate: "",
        scope: BillboardListScope.NACIONAL,
        nameList: "",
        endList: "100",
      });

      setShowCreateForm(false);
      await fetchBillboardLists();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear la lista",
      });
    }
  };

  // Manejar actualización de lista
  const handleUpdate = async () => {
    if (!editingList) return;

    if (
      !editList.publicDate ||
      !editList.nameList.trim() ||
      !editList.endList
    ) {
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios",
      });
      return;
    }

    const endListNumber = parseInt(editList.endList);
    if (endListNumber <= 0) {
      setMessage({
        type: "error",
        text: "El fin de lista debe ser mayor a 0",
      });
      return;
    }

    try {
      await updateBillboardList(editingList.id, {
        publicDate: new Date(editList.publicDate),
        scope: editList.scope,
        nameList: editList.nameList.trim(),
        endList: endListNumber,
      });

      setMessage({
        type: "success",
        text: `Lista actualizada exitosamente`,
      });

      setEditingList(null);
      setEditList({
        publicDate: "",
        scope: BillboardListScope.NACIONAL,
        nameList: "",
        endList: "100",
      });

      await fetchBillboardLists();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar la lista",
      });
    }
  };

  // Manejar eliminación de lista
  const handleDelete = async () => {
    if (!deletingList) return;

    try {
      await deleteBillboardList(deletingList.id);
      setMessage({
        type: "success",
        text: `Lista "${deletingList.nameList}" eliminada exitosamente`,
      });
      setDeletingList(null);
      await fetchBillboardLists();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar la lista",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    try {
      await fetchBillboardLists();
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
  const startEdit = (list: any) => {
    setEditingList(list);
    setEditList({
      publicDate: list.publicDate.split("T")[0], // Formato YYYY-MM-DD
      scope: list.scope,
      nameList: list.nameList,
      endList: list.endList.toString(),
    });
  };

  // Iniciar eliminación
  const startDelete = (list: any) => {
    setDeletingList(list);
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
    // Sumar un día para compensar diferencia de zona horaria
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("es-ES");
  };

  // Traducir alcances
  const getScopeText = (scope: BillboardListScope) => {
    const scopeMap = {
      [BillboardListScope.INTERNACIONAL]: "Internacional",
      [BillboardListScope.NACIONAL]: "Nacional",
    };
    return scopeMap[scope] || scope;
  };

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <section id="billboard_list_manager" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Listas Billboard</h1>
          <p className="section-description">
            Administre todas las listas Billboard del sistema
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
              Nueva Lista
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input
                type="text"
                className="form-input search-input"
                placeholder="Filtrar por nombre o alcance..."
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
                <option value="nameList">Ordenar por nombre</option>
                <option value="publicDate">Ordenar por fecha</option>
                <option value="scope">Ordenar por alcance</option>
                <option value="endList">Ordenar por fin de lista</option>
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
              {filteredAndSortedLists.length} de {billboardLists.length} listas
            </span>
            <span className="sort-info">
              Orden:{" "}
              {sortBy === "nameList"
                ? "Nombre"
                : sortBy === "publicDate"
                ? "Fecha"
                : sortBy === "scope"
                ? "Alcance"
                : "Fin de lista"}{" "}
              •{sortOrder === "asc" ? " Ascendente" : " Descendente"}
            </span>
          </div>
        )}

        {/* Grid de listas */}
        <div className="billboard-lists-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando listas...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedLists.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No hay listas Billboard</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando la primera lista"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={
                    loading 
                    
                  }
                >
                  <span className="button-icon"><Icon name="plus" size={20} /></span>
                  Crear Primera Lista
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="billboard-lists-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Alcance</th>
                    <th>Fin de Lista</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLists.map((list) => (
                    <tr key={list.id} className="billboard-list-row">
                      <td className="billboard-list-name-cell">
                        <div className="billboard-list-name">{list.nameList}</div>
                      </td>
                      <td>
                        <div className="detail-value">
                          {formatDate(list.publicDate.toString())}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`scope-badge scope-${list.scope.toLowerCase()}`}
                        >
                          {getScopeText(list.scope)}
                        </span>
                      </td>
                      <td>
                        <div className="detail-value">{list.endList}</div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => startEdit(list)}
                            title="Editar lista"
                            disabled={loading}
                          >
                            <Icon name="edit" size={18} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => startDelete(list)}
                            title="Eliminar lista"
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
        <div className="modal-overlay billboard-list-modal">
          <div className="modal-content">
            <h3>Crear Nueva Lista Billboard</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre de la lista *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Top 100 Semanal"
                    value={newList.nameList}
                    onChange={(e) =>
                      setNewList({
                        ...newList,
                        nameList: e.target.value,
                      })
                    }
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de publicación *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newList.publicDate}
                    onChange={(e) =>
                      setNewList({
                        ...newList,
                        publicDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Alcance *</label>
                  <select
                    className="form-select"
                    value={newList.scope}
                    onChange={(e) =>
                      setNewList({
                        ...newList,
                        scope: e.target.value as BillboardListScope,
                      })
                    }
                    required
                  >
                    <option value={BillboardListScope.INTERNACIONAL}>Internacional</option>
                    <option value={BillboardListScope.NACIONAL}>Nacional</option>
                  
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Fin de lista *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Ej: 100"
                    value={newList.endList}
                    onChange={(e) =>
                      setNewList({
                        ...newList,
                        endList: e.target.value,
                      })
                    }
                    required
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    loading ||
                    !newList.publicDate ||
                    !newList.nameList.trim() ||
                    !newList.endList
                  }
                >
                  {loading ? "Creando..." : "Crear Lista"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewList({
                      publicDate: "",
                      scope: BillboardListScope.NACIONAL,
                      nameList: "",
                      endList: "100",
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
      {editingList && (
        <div className="modal-overlay billboard-list-modal">
          <div className="modal-content">
            <h3>Editar Lista Billboard</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre de la lista *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editList.nameList}
                  onChange={(e) =>
                    setEditList({
                      ...editList,
                      nameList: e.target.value,
                    })
                  }
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de publicación *</label>
                <input
                  type="date"
                  className="form-input"
                  value={editList.publicDate}
                  onChange={(e) =>
                    setEditList({
                      ...editList,
                      publicDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Alcance *</label>
                <select
                  className="form-select"
                  value={editList.scope}
                  onChange={(e) =>
                    setEditList({
                      ...editList,
                      scope: e.target.value as BillboardListScope,
                    })
                  }
                  required
                >
                  <option value={BillboardListScope.INTERNACIONAL}>Internacional</option>
                  <option value={BillboardListScope.NACIONAL}>Nacional</option>
                 
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fin de lista *</label>
                <input
                  type="number"
                  className="form-input"
                  value={editList.endList}
                  onChange={(e) =>
                    setEditList({
                      ...editList,
                      endList: e.target.value,
                    })
                  }
                  required
                  min="1"
                  max="1000"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={handleUpdate}
                disabled={
                  loading ||
                  !editList.publicDate ||
                  !editList.nameList.trim() ||
                  !editList.endList
                }
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setEditingList(null);
                  setEditList({
                    publicDate: "",
                    scope: BillboardListScope.NACIONAL,
                    nameList: "",
                    endList: "100",
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
      {deletingList && (
        <div className="modal-overlay billboard-list-modal">
          <div className="modal-content">
            <h3>¿Eliminar Lista Billboard?</h3>
            <div className="delete-confirmation">
              <p>¿Está seguro de que desea eliminar esta lista?</p>
              <div className="billboard-list-details">
                <div className="detail-item">
                  <strong>Nombre:</strong> {deletingList.nameList}
                </div>
                <div className="detail-item">
                  <strong>Fecha:</strong> {formatDate(deletingList.publicDate)}
                </div>
                <div className="detail-item">
                  <strong>Alcance:</strong> {getScopeText(deletingList.scope)}
                </div>
                <div className="detail-item">
                  <strong>Fin de lista:</strong> {deletingList.endList}
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
                onClick={() => setDeletingList(null)}
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

export default BillboardListManagement;