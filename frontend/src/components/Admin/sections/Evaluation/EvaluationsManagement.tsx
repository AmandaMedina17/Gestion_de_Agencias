// EvaluationManagement.tsx
import React, { useState, useEffect } from "react";
import { useApprentice } from "../../../../context/ApprenticeContext";
import { useApprenticeEvaluation } from "../../../../context/EvaluationContext";
import { Icon } from "../../../icons";
import "./EvaluationStyle.css";

// Enum para los valores de evaluación
export enum EvaluationValue {
  EXCELENTE = "EXCELENTE",
  BIEN = "BIEN",
  REGULAR = "REGULAR",
  MAL = "MAL",
  INSUFICIENTE = "INSUFICIENTE",
}

const EvaluationManagement: React.FC = () => {
  const {
    apprentices,
    fetchApprentices,
    loading: apprenticeLoading,
    error: apprenticeError,
    clearError: clearApprenticeError,
  } = useApprentice();

  const {
    evaluations,
    fetchEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    fetchByApprenticeId,
    loading: evaluationLoading,
    error: evaluationError,
    clearError: clearEvaluationError,
  } = useApprenticeEvaluation();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"apprentice" | "date" | "evaluation">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<any>(null);
  const [deletingEvaluation, setDeletingEvaluation] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Estados del formulario de creación
  const [newEvaluation, setNewEvaluation] = useState({
    apprentice: "",
    date: "",
    evaluation: EvaluationValue.BIEN,
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearApprenticeError();
        clearEvaluationError();
        try {
          await fetchApprentices();
          await fetchEvaluations();
          setDataLoaded(true);
        } catch (err) {
          console.error("Error loading initial data:", err);
        }
      }
    };

    loadInitialData();
  }, [
    dataLoaded,
    clearApprenticeError,
    clearEvaluationError,
    fetchApprentices,
    fetchEvaluations,
  ]);

  // Resetear página cuando cambien filtro u orden
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy, sortOrder]);

  // Filtrar y ordenar evaluaciones
  const filteredAndSortedEvaluations = React.useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = evaluations;

    // Aplicar filtro por nombre de aprendiz
    if (filter) {
      filtered = evaluations.filter((evaluation) => {
        const apprentice = apprentices.find(
          (a) => a.id === evaluation.apprentice
        );
        return apprentice?.fullName
          .toLowerCase()
          .includes(filter.toLowerCase());
      });
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "apprentice":
          const apprenticeA = apprentices.find(
            (app) => app.id === a.apprentice
          );
          const apprenticeB = apprentices.find(
            (app) => app.id === b.apprentice
          );
          aValue = apprenticeA?.fullName || "";
          bValue = apprenticeB?.fullName || "";
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [evaluations, filter, sortBy, sortOrder, dataLoaded, apprentices]);

  // PAGINACIÓN: calcular páginas y slice
  const totalPages = Math.ceil(
    filteredAndSortedEvaluations.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvaluations = filteredAndSortedEvaluations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Obtener nombre del aprendiz por ID
  const getApprenticeName = (apprenticeId: string) => {
    if (!apprenticeId) return "No asignado";
    const apprentice = apprentices.find((a) => a.id === apprenticeId);
    return apprentice ? apprentice.fullName : "No encontrado";
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("es-ES");
  };

  // Obtener fecha actual en formato string para input max
  const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Validar que la fecha no sea futura
  const isFutureDate = (dateString: string): boolean => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  // Obtener texto del valor de evaluación
  const getEvaluationText = (value: EvaluationValue) => {
    const evaluationMap = {
      [EvaluationValue.EXCELENTE]: "Excelente",
      [EvaluationValue.BIEN]: "Bueno",
      [EvaluationValue.REGULAR]: "Regular",
      [EvaluationValue.INSUFICIENTE]: "Insuficiente",
      [EvaluationValue.MAL]: "Mal",
    };
    return evaluationMap[value] || value;
  };

  // Obtener clase CSS para el valor de evaluación
  const getEvaluationClass = (value: EvaluationValue) => {
    const classMap = {
      [EvaluationValue.EXCELENTE]: "excelente",
      [EvaluationValue.BIEN]: "bueno",
      [EvaluationValue.REGULAR]: "regular",
      [EvaluationValue.INSUFICIENTE]: "insuficiente",
      [EvaluationValue.MAL]: "mal",
    };
    return classMap[value] || "regular";
  };

  // Manejar creación de evaluación
  const handleCreateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    clearEvaluationError();
    setMessage(null);

    if (!newEvaluation.apprentice || !newEvaluation.date) {
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios",
      });
      return;
    }

    // Validar que la fecha no sea futura
    if (isFutureDate(newEvaluation.date)) {
      setMessage({
        type: "error",
        text: "La fecha de evaluación no puede ser futura",
      });
      return;
    }

    try {
      const dateForBackend = new Date(newEvaluation.date);

      await createEvaluation({
        apprentice: newEvaluation.apprentice,
        date: dateForBackend,
        evaluation: newEvaluation.evaluation,
      });

      setMessage({
        type: "success",
        text: `Evaluación agregada exitosamente`,
      });

      // Resetear formulario
      setNewEvaluation({
        apprentice: "",
        date: "",
        evaluation: EvaluationValue.BIEN,
      });

      setShowCreateForm(false);
      await fetchEvaluations();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear la evaluación",
      });
    }
  };

  // Manejar actualización de evaluación
  const handleUpdateEvaluation = async () => {
    if (!editingEvaluation) return;

    try {
      await updateEvaluation(
        editingEvaluation.apprentice,
        editingEvaluation.date,
        { evaluation: editingEvaluation.evaluation }
      );

      setMessage({
        type: "success",
        text: "Evaluación actualizada exitosamente",
      });

      setEditingEvaluation(null);
      await fetchEvaluations();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar la evaluación",
      });
    }
  };

  // Manejar eliminación de evaluación
  const handleDeleteEvaluation = async () => {
    if (!deletingEvaluation) return;

    try {
      await deleteEvaluation(
        deletingEvaluation.apprentice,
        deletingEvaluation.date
      );

      setMessage({
        type: "success",
        text: "Evaluación eliminada exitosamente",
      });

      setDeletingEvaluation(null);
      await fetchEvaluations();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar la evaluación",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearEvaluationError();
    try {
      await fetchEvaluations();
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
  const startEdit = (evaluation: any) => {
    setEditingEvaluation(evaluation);
  };

  // Iniciar eliminación
  const startDelete = (evaluation: any) => {
    setDeletingEvaluation(evaluation);
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
    <section id="evaluation_manager" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Evaluaciones</h1>
          <p className="section-description">
            Agregue y administre evaluaciones para los aprendices
          </p>
        </div>
      </div>

      <div className="detail-card">
        {/* Mensajes globales */}
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {apprenticeError && (
          <div className="message error">{apprenticeError}</div>
        )}
        {evaluationError && (
          <div className="message error">{evaluationError}</div>
        )}

        {/* Controles superiores */}
        <div className="manager-controls">
          <div className="controls-left">
            <button
              className="create-button"
              onClick={() => setShowCreateForm(true)}
              disabled={evaluationLoading}
            >
              <span className="button-icon">
                <Icon name="plus" size={20} />
              </span>
              Nueva Evaluación
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input
                type="text"
                className="form-input search-input"
                placeholder="Filtrar por nombre de aprendiz..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                disabled={evaluationLoading}
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
                disabled={evaluationLoading}
              >
                <option value="date">Ordenar por fecha</option>
                <option value="apprentice">Ordenar por aprendiz</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={toggleSortOrder}
                disabled={evaluationLoading}
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
              disabled={evaluationLoading}
              title="Recargar datos"
            >
              {evaluationLoading ? "⟳" : "↻"}
            </button>
          </div>
        </div>

        {/* Contador de resultados */}
        {dataLoaded && (
          <div className="results-info">
            <span className="results-count">
              {filteredAndSortedEvaluations.length} de {evaluations.length}{" "}
              evaluaciones
            </span>
            <span className="sort-info">
              Orden:{" "}
              {sortBy === "apprentice"
                ? "Aprendiz"
                : sortBy === "date"
                ? "Fecha"
                : "Evaluación"}{" "}
              •{sortOrder === "asc" ? " Ascendente" : " Descendente"}
            </span>
          </div>
        )}

        {/* Tabla de evaluaciones */}
        <div className="evaluations-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando evaluaciones...</p>
            </div>
          ) : evaluationLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedEvaluations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No hay evaluaciones</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando la primera evaluación"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  <span className="button-icon">
                    <Icon name="plus" size={20} />
                  </span>
                  Crear Primera Evaluación
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="evaluations-table">
                <thead>
                  <tr>
                    <th className="text-center">Aprendiz</th>
                    <th className="text-center">Fecha</th>
                    <th className="text-center">Evaluación</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvaluations.map((evaluation) => (
                    <tr key={`${evaluation.apprentice}-${evaluation.date}`}>
                      <td className="apprentice-name text-center">
                        {getApprenticeName(evaluation.apprentice)}
                      </td>
                      <td className="evaluation-date text-center">
                        {formatDate(evaluation.date)}
                      </td>
                      <td className="text-center">
                        <span
                          className={`evaluation-badge ${getEvaluationClass(
                            evaluation.evaluation
                          )}`}
                        >
                          {getEvaluationText(evaluation.evaluation)}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="table-actions-botons">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => startEdit(evaluation)}
                            title="Editar evaluación"
                            disabled={evaluationLoading}
                          >
                            <Icon name="edit" size={16} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => startDelete(evaluation)}
                            title="Eliminar evaluación"
                            disabled={evaluationLoading}
                          >
                            <Icon name="trash" size={16} />
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
        <div className="modal-overlay evaluation-modal">
          <div className="modal-content">
            <h3>Crear Nueva Evaluación</h3>
            <form onSubmit={handleCreateEvaluation}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Aprendiz *</label>
                  <select
                    className="form-select"
                    value={newEvaluation.apprentice}
                    onChange={(e) =>
                      setNewEvaluation({
                        ...newEvaluation,
                        apprentice: e.target.value,
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

                <div className="form-group">
                  <label className="form-label">Fecha de Evaluación *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newEvaluation.date}
                    onChange={(e) =>
                      setNewEvaluation({
                        ...newEvaluation,
                        date: e.target.value,
                      })
                    }
                    required
                    max={getTodayDateString()}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Evaluación *</label>
                  <select
                    className="form-select"
                    value={newEvaluation.evaluation}
                    onChange={(e) =>
                      setNewEvaluation({
                        ...newEvaluation,
                        evaluation: e.target.value as EvaluationValue,
                      })
                    }
                    required
                  >
                    <option value={EvaluationValue.EXCELENTE}>Excelente</option>
                    <option value={EvaluationValue.BIEN}>Bueno</option>
                    <option value={EvaluationValue.REGULAR}>Regular</option>
                    <option value={EvaluationValue.INSUFICIENTE}>
                      Insuficiente
                    </option>
                    <option value={EvaluationValue.MAL}>Mal</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    evaluationLoading ||
                    !newEvaluation.apprentice ||
                    !newEvaluation.date
                  }
                >
                  {evaluationLoading ? "Creando..." : "Crear Evaluación"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewEvaluation({
                      apprentice: "",
                      date: "",
                      evaluation: EvaluationValue.BIEN,
                    });
                  }}
                  disabled={evaluationLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingEvaluation && (
        <div className="modal-overlay evaluation-modal">
          <div className="modal-content">
            <h3>Editar Evaluación</h3>
            <div className="evaluation-details">
              <div className="detail-item">
                <strong>Aprendiz:</strong>{" "}
                {getApprenticeName(editingEvaluation.apprentice)}
              </div>
              <div className="detail-item">
                <strong>Fecha:</strong> {formatDate(editingEvaluation.date)}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Evaluación</label>
              <select
                className="form-select"
                value={editingEvaluation.evaluation}
                onChange={(e) =>
                  setEditingEvaluation({
                    ...editingEvaluation,
                    evaluation: e.target.value as EvaluationValue,
                  })
                }
              >
                <option value={EvaluationValue.EXCELENTE}>Excelente</option>
                <option value={EvaluationValue.BIEN}>Bueno</option>
                <option value={EvaluationValue.REGULAR}>Regular</option>
                <option value={EvaluationValue.INSUFICIENTE}>
                  Insuficiente
                </option>
                <option value={EvaluationValue.MAL}>Mal</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={handleUpdateEvaluation}
                disabled={evaluationLoading}
              >
                {evaluationLoading ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => setEditingEvaluation(null)}
                disabled={evaluationLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deletingEvaluation && (
        <div className="modal-overlay evaluation-modal">
          <div className="modal-content">
            <h3>¿Eliminar Evaluación?</h3>
            <div className="delete-confirmation">
              <p>¿Está seguro de que desea eliminar esta evaluación?</p>
              <div className="evaluation-details">
                <div className="detail-item">
                  <strong>Aprendiz:</strong>{" "}
                  {getApprenticeName(deletingEvaluation.apprentice)}
                </div>
                <div className="detail-item">
                  <strong>Fecha:</strong> {formatDate(deletingEvaluation.date)}
                </div>
                <div className="detail-item">
                  <strong>Evaluación:</strong>{" "}
                  {getEvaluationText(deletingEvaluation.evaluation)}
                </div>
              </div>
              <p className="warning-text">
                ⚠️ Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="submit-button delete-button"
                onClick={handleDeleteEvaluation}
                disabled={evaluationLoading}
              >
                {evaluationLoading ? "Eliminando..." : "Sí, Eliminar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => setDeletingEvaluation(null)}
                disabled={evaluationLoading}
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

export default EvaluationManagement;
