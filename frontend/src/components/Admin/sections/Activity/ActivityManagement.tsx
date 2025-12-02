import React, { useState, useEffect, useRef } from "react";
import { useActivity } from "../../../../context/ActivityContext";
import { useResponsible } from "../../../../context/ResponsibleContext";
import { usePlace } from "../../../../context/PlaceContext";
import { Icon } from "../../../icons";
import CreateIncomeModal from "./Income/CreationIncome"
import ViewActivityIncomesModal from "./Income/ViewActivityIncome";
import './ActivityStyle.css'

export enum ActivityClassification {
    // Training
    CLASE_VOCAL = "CLASE_VOCAL",
    CLASE_BAILE = "CLASE_BAILE",
    CLASE_RAP = "CLASE_RAP",
    ENTRENAMIENTO_FÍSICO = "ENTRENAMIENTO_FÍSICO",
    // Actuación
    CONCIERTO_PRÁCTICA = "CONCIERTO_PRÁCTICA",
    GRABACIÓN_VÍDEO = "GRABACIÓN_VÍDEO",

    // Producción
    GRABACIÓN_AUDIO = "GRABACIÓN_AUDIO",
    SESIÓN_FOTOGRÁFICA = "SESIÓN_FOTOGRÁFICA",
    ENSAYO_COREOGRAFÍA = "ENSAYO_COREOGRAFÍA",

    // Promoción
    ENTREVISTA = "ENTREVISTA",
    REUNIÓN_FAN = "REUNIÓN_FAN",
    EVENTO_PROMOCIONAL = "EVENTO_PROMOCIONAL"
}

export enum ActivityType{
    INDIVIDUAL = "INDIVIDUAL",
    GRUPAL = "GRUPAL"
}

const ActivityManagement: React.FC = () => {
  const {
    activities,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    loading,
    error,
    clearError,
  } = useActivity();

  const { responsibles, fetchResponsibles } = useResponsible();
  const { places, fetchPlaces } = usePlace();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"classification" | "type">("classification");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [deletingActivity, setDeletingActivity] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [showResponsibleDropdown, setShowResponsibleDropdown] = useState(false);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const [showEditResponsibleDropdown, setShowEditResponsibleDropdown] = useState(false);
  const [showEditPlaceDropdown, setShowEditPlaceDropdown] = useState(false);

  // Referencias para cerrar dropdowns al hacer clic fuera
  const responsibleDropdownRef = useRef<HTMLDivElement>(null);
  const placeDropdownRef = useRef<HTMLDivElement>(null);
  const editResponsibleDropdownRef = useRef<HTMLDivElement>(null);
  const editPlaceDropdownRef = useRef<HTMLDivElement>(null);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  //ingresos
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [newlyCreatedActivityId, setNewlyCreatedActivityId] = useState<string | null>(null);

  // Estados para el modal de ver ingresos
  const [showIncomesModal, setShowIncomesModal] = useState(false);
  const [selectedActivityForIncomes, setSelectedActivityForIncomes] = useState<any>(null);


  // Estados del formulario
  const [newActivity, setNewActivity] = useState({
    classification: ActivityClassification.EVENTO_PROMOCIONAL,
    type: ActivityType.INDIVIDUAL,
    responsibleIds: [] as string[], 
    placeIds: [] as string[], 
    dates: [""],
  });

  const [editActivity, setEditActivity] = useState({
    classification: ActivityClassification.EVENTO_PROMOCIONAL,
    type: ActivityType.INDIVIDUAL,
    responsibleIds: [] as string[],
    placeIds: [] as string[],
    dates: [""],
  });

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (responsibleDropdownRef.current && !responsibleDropdownRef.current.contains(event.target as Node)) {
        setShowResponsibleDropdown(false);
      }
      if (placeDropdownRef.current && !placeDropdownRef.current.contains(event.target as Node)) {
        setShowPlaceDropdown(false);
      }
      if (editResponsibleDropdownRef.current && !editResponsibleDropdownRef.current.contains(event.target as Node)) {
        setShowEditResponsibleDropdown(false);
      }
      if (editPlaceDropdownRef.current && !editPlaceDropdownRef.current.contains(event.target as Node)) {
        setShowEditPlaceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar actividades solo cuando se monta el componente
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await Promise.all([
            fetchActivities(),
            fetchResponsibles(),
            fetchPlaces()
          ]);
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

  // Filtrar y ordenar actividades
  const filteredAndSortedActivities = React.useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = activities;

    // Aplicar filtro por clasificación
    if (filter) {
      filtered = activities.filter((activity) =>
        activity.classification.toLowerCase().includes(filter.toLowerCase()) ||
        activity.type.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "classification":
          aValue = a.classification;
          bValue = b.classification;
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = a.classification;
          bValue = b.classification;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [activities, filter, sortBy, sortOrder, dataLoaded]);

  // PAGINACIÓN: calcular páginas y slice
  const totalPages = Math.ceil(filteredAndSortedActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredAndSortedActivities.slice(startIndex, startIndex + itemsPerPage);

  const handleResponsibleCheckboxChange = (responsibleId: string) => {
    setNewActivity(prev => ({
      ...prev,
      responsibleIds: prev.responsibleIds.includes(responsibleId)
        ? prev.responsibleIds.filter(id => id !== responsibleId)
        : [...prev.responsibleIds, responsibleId]
    }));
  };

  const handleEditResponsibleCheckboxChange = (responsibleId: string) => {
    setEditActivity(prev => ({
      ...prev,
      responsibleIds: prev.responsibleIds.includes(responsibleId)
        ? prev.responsibleIds.filter(id => id !== responsibleId)
        : [...prev.responsibleIds, responsibleId]
    }));
  };

  // NUEVO: Manejadores para checkboxes de lugares (dropdown)
  const handlePlaceCheckboxChange = (placeId: string) => {
    setNewActivity(prev => ({
      ...prev,
      placeIds: prev.placeIds.includes(placeId)
        ? prev.placeIds.filter(id => id !== placeId)
        : [...prev.placeIds, placeId]
    }));
  };

  const handleEditPlaceCheckboxChange = (placeId: string) => {
    setEditActivity(prev => ({
      ...prev,
      placeIds: prev.placeIds.includes(placeId)
        ? prev.placeIds.filter(id => id !== placeId)
        : [...prev.placeIds, placeId]
    }));
  };

  // NUEVO: Manejadores para seleccionar/deseleccionar todos
  const handleSelectAllResponsibles = () => {
    if (newActivity.responsibleIds.length === responsibles.length) {
      setNewActivity(prev => ({ ...prev, responsibleIds: [] }));
    } else {
      setNewActivity(prev => ({ 
        ...prev, 
        responsibleIds: responsibles.map(r => r.id) 
      }));
    }
  };

  const handleSelectAllPlaces = () => {
    if (newActivity.placeIds.length === places.length) {
      setNewActivity(prev => ({ ...prev, placeIds: [] }));
    } else {
      setNewActivity(prev => ({ 
        ...prev, 
        placeIds: places.map(p => p.id) 
      }));
    }
  };

  const handleEditSelectAllResponsibles = () => {
    if (editActivity.responsibleIds.length === responsibles.length) {
      setEditActivity(prev => ({ ...prev, responsibleIds: [] }));
    } else {
      setEditActivity(prev => ({ 
        ...prev, 
        responsibleIds: responsibles.map(r => r.id) 
      }));
    }
  };

  const handleEditSelectAllPlaces = () => {
    if (editActivity.placeIds.length === places.length) {
      setEditActivity(prev => ({ ...prev, placeIds: [] }));
    } else {
      setEditActivity(prev => ({ 
        ...prev, 
        placeIds: places.map(p => p.id) 
      }));
    }
  };

  

  const handleAddDate = () => {
    setNewActivity({
      ...newActivity,
      dates: [...newActivity.dates, ""]
    });
  };

  const handleRemoveDate = (index: number) => {
    setNewActivity({
      ...newActivity,
      dates: newActivity.dates.filter((_, i) => i !== index)
    });
  };

  const handleDateChange = (index: number, value: string) => {
    const updatedDates = [...newActivity.dates];
    updatedDates[index] = value;
    setNewActivity({
      ...newActivity,
      dates: updatedDates
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    const validResponsibles = newActivity.responsibleIds;
    const validPlaces = newActivity.placeIds;
    const validDates = newActivity.dates.filter(date => date.trim() !== "");

    if (validResponsibles.length === 0 || validPlaces.length === 0 || validDates.length === 0) {
      setMessage({
        type: "error",
        text: "Por favor, complete al menos un responsable, un lugar y una fecha",
      });
      return;
    }

    const hasPastDate = validDates.some(date => new Date(date) < new Date());
    if (hasPastDate) {
      setMessage({
        type: "error",
        text: "Las fechas deben ser futuras",
      });
      return;
    }

    try {
       const createdActivity = await createActivity({
        classification: newActivity.classification,
        type: newActivity.type,
        responsibleIds: validResponsibles,
        placeIds: validPlaces,
        dates: validDates.map(date => new Date(date)),
      });

      setMessage({
        type: "success",
        text: `Actividad "${getClassificationText(newActivity.classification)} - ${getTypeText(newActivity.type)}" creada exitosamente`,
      });

      setNewlyCreatedActivityId(createdActivity.id);

      setShowCreateForm(false);
      
      // Abre automáticamente el modal de creación de Income
      setTimeout(() => {
        setShowIncomeModal(true);
      }, 500); // Pequeño delay para mejor UX

      await fetchActivities();

      // Resetear formulario correctamente
      setNewActivity({
        classification: ActivityClassification.EVENTO_PROMOCIONAL,
        type: ActivityType.INDIVIDUAL,
        responsibleIds: [],
        placeIds: [],
        dates: [""],
      });

      setShowCreateForm(false);
      await fetchActivities();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al crear la actividad",
      });
    }
  };

  const handleIncomeModalClose = () => {
    setShowIncomeModal(false);
    // Opcional: Resetear los estados de la actividad creada
    setNewlyCreatedActivityId(null);
  };

  // CORREGIDO: Manejar actualización de actividad - FECHAS FUTURAS
  const handleUpdate = async () => {
    if (!editingActivity) return;

    const validResponsibles = editActivity.responsibleIds;
    const validPlaces = editActivity.placeIds;
    const validDates = editActivity.dates.filter(date => date.trim() !== "");

    if (validResponsibles.length === 0 || validPlaces.length === 0 || validDates.length === 0) {
      setMessage({
        type: "error",
        text: "Por favor, complete al menos un responsable, un lugar y una fecha",
      });
      return;
    }

    // CORREGIDO: Validar que las fechas sean futuras
    const hasPastDate = validDates.some(date => new Date(date) < new Date());
    if (hasPastDate) {
      setMessage({
        type: "error",
        text: "Las fechas deben ser futuras",
      });
      return;
    }

    try {
      await updateActivity(editingActivity.id, {
        classification: editActivity.classification,
        type: editActivity.type,
        responsibleIds: validResponsibles,
        placeIds: validPlaces,
        dates: validDates.map(date => new Date(date)),
      });

      setMessage({
        type: "success",
        text: `Actividad actualizada exitosamente`,
      });

      setEditingActivity(null);
      setEditActivity({
        classification: ActivityClassification.EVENTO_PROMOCIONAL,
        type: ActivityType.INDIVIDUAL,
        responsibleIds: [],
        placeIds: [],
        dates: [""],
      });

      await fetchActivities();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar la actividad",
      });
    }
  };

  // Manejar eliminación de actividad
  const handleDelete = async () => {
    if (!deletingActivity) return;

    try {
      await deleteActivity(deletingActivity.id);
      setMessage({
        type: "success",
        text: `Actividad "${getClassificationText(deletingActivity.classification)} - ${getTypeText(deletingActivity.type)}" eliminada exitosamente`,
      });
      setDeletingActivity(null);
      await fetchActivities();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar la actividad",
      });
    }
  };

  
  // Función para abrir el modal de ingresos
  const handleViewIncomes = (activity: any) => {
    setSelectedActivityForIncomes(activity);
    setShowIncomesModal(true);
  };

  // Función para cerrar el modal de ingresos
  const handleCloseIncomesModal = () => {
    setShowIncomesModal(false);
    setSelectedActivityForIncomes(null);
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    try {
      await fetchActivities();
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
  const startEdit = (activity: any) => {
    setEditingActivity(activity);
    setEditActivity({
      classification: activity.classification,
      type: activity.type,
      responsibleIds: activity.responsibles.map((r: any) => r.id || ""),
      placeIds: activity.places.map((p: any) => p.id || ""),
      dates: activity.dates.map((date: string) => {
        // Convertir Date a string en formato YYYY-MM-DD
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }),
    });
  };

  // Iniciar eliminación
  const startDelete = (activity: any) => {
    setDeletingActivity(activity);
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

  // Traducir clasificaciones y tipos
  const getClassificationText = (classification: ActivityClassification) => {
    const classificationMap = {
      [ActivityClassification.CLASE_BAILE]: "Clase de baile",
      [ActivityClassification.CLASE_RAP]: "Clase de rap",
      [ActivityClassification.CLASE_VOCAL]: "Clase vocal",
      [ActivityClassification.CONCIERTO_PRÁCTICA]: "Practica de concierto",
      [ActivityClassification.ENSAYO_COREOGRAFÍA]: "Ensayo de coreografia",
      [ActivityClassification.ENTRENAMIENTO_FÍSICO]: "Entrenamiento fisico",
      [ActivityClassification.ENTREVISTA]: "Entrevista",
      [ActivityClassification.EVENTO_PROMOCIONAL]: "Evento promocional",
      [ActivityClassification.GRABACIÓN_AUDIO]: "Grabacion de audio",
      [ActivityClassification.GRABACIÓN_VÍDEO]: "Grabacion de video",
      [ActivityClassification.REUNIÓN_FAN]: "Reunion con fan",
      [ActivityClassification.SESIÓN_FOTOGRÁFICA]: "Sesion de fotos",
    };
    return classificationMap[classification] || classification;
  };

  const getTypeText = (type: ActivityType) => {
    const typeMap = {
      [ActivityType.GRUPAL]: "Grupal",
      [ActivityType.INDIVIDUAL]: "Individual",
    };
    return typeMap[type] || type;
  };

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <section id="activity_manager" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Actividades</h1>
          <p className="section-description">
            Administre todas las actividades del sistema
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
              Nueva Actividad
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input
                type="text"
                className="form-input search-input"
                placeholder="Filtrar por clasificación o tipo..."
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
                <option value="classification">Ordenar por clasificación</option>
                <option value="type">Ordenar por tipo</option>
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
              {filteredAndSortedActivities.length} de {activities.length} actividades
            </span>
            <span className="sort-info">
              Orden:{" "}
              {sortBy === "classification" ? "Clasificación" : "Tipo"} • 
              {sortOrder === "asc" ? " Ascendente" : " Descendente"}
            </span>
          </div>
        )}

        {/* Grid de actividades */}
        <div className="activities-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando actividades...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No hay actividades</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando la primera actividad"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  <span className="button-icon"><Icon name="plus" size={20} /></span>
                  Crear Primera Actividad
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="activities-table">
                <thead>
                  <tr>
                    <th>Clasificación</th>
                    <th>Tipo</th>
                    <th>Responsables</th>
                    <th>Lugares</th>
                    <th>Fechas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.map((activity) => (
                    <tr key={activity.id} className="activity-row">
                      <td>
                        <span className={`classification-badge `}>
                          {getClassificationText(activity.classification)}
                        </span>
                      </td>
                      <td>
                        <div className="type-value">
                          {getTypeText(activity.type)}
                        </div>
                      </td>
                      <td>
                        <div className="responsibles-list">
                          {activity.responsibles.map((responsible: any, index: number) => (
                            <div key={index} className="responsible-item">
                                {responsible.name || responsible.id}
                            </div>
                            ))}
                        </div>
                      </td>
                      <td>
                        <div className="places-list">
                          {activity.places.map((place: any, index: number) => (
                            <div key={index} className="place-item">
                                {place.name || place.id}
                            </div>
                            ))}
                        </div>
                      </td>
                      <td>
                        <div className="dates-list">
                         {activity.dates.map((date: Date, index: number) => (
                            <div key={index} className="date-item">
                                {formatDate(date.toString())}
                            </div>
                            ))}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn view-income-btn"
                            onClick={() => handleViewIncomes(activity)}
                            title="Ver ingresos"
                            disabled={loading}
                          >
                            <Icon name="eye" size={18} />
                          </button>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => startEdit(activity)}
                            title="Editar actividad"
                            disabled={loading}
                          >
                            <Icon name="edit" size={18} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => startDelete(activity)}
                            title="Eliminar actividad"
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
        <div className="modal-overlay activity-modal">
          <div className="modal-content">
            <h3>Crear Nueva Actividad</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Clasificación *</label>
                  <select
                    className="form-select"
                    value={newActivity.classification}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        classification: e.target.value as ActivityClassification,
                      })
                    }
                  >
                    <option value={ActivityClassification.CLASE_BAILE}>Clase de baile</option>
                    <option value={ActivityClassification.CLASE_RAP}>Clase de rap</option>
                    <option value={ActivityClassification.CLASE_VOCAL}>Clase vocal</option>
                    <option value={ActivityClassification.CONCIERTO_PRÁCTICA}>Practica de concierto</option>
                    <option value={ActivityClassification.ENSAYO_COREOGRAFÍA}>Ensayo de coreografia</option>
                    <option value={ActivityClassification.ENTRENAMIENTO_FÍSICO}>Entrenamiento fisico</option>
                    <option value={ActivityClassification.ENTREVISTA}>Entrevista</option>
                    <option value={ActivityClassification.EVENTO_PROMOCIONAL}>Evento promocional</option>
                    <option value={ActivityClassification.GRABACIÓN_AUDIO}>Grabacion de audio</option>
                    <option value={ActivityClassification.GRABACIÓN_VÍDEO}>Grabacion de video</option>
                    <option value={ActivityClassification.REUNIÓN_FAN}>Reunion con fan</option>
                    <option value={ActivityClassification.SESIÓN_FOTOGRÁFICA}>Sesion de fotos</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo *</label>
                  <select
                    className="form-select"
                    value={newActivity.type}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        type: e.target.value as ActivityType,
                      })
                    }
                  >
                    <option value={ActivityType.GRUPAL}>Grupal</option>
                    <option value={ActivityType.INDIVIDUAL}>Individual</option>
                  </select>
                </div>
              </div>

              {/* Responsables - NUEVO: Checkboxes */}
               <div className="form-group">
                <label className="form-label">Responsables *</label>
                <div className="dropdown-container" ref={responsibleDropdownRef}>
                  <button
                    type="button"
                    className="dropdown-toggle"
                    onClick={() => setShowResponsibleDropdown(!showResponsibleDropdown)}
                  >
                    <span>
                      {newActivity.responsibleIds.length === 0
                        ? "Seleccionar responsables"
                        : `${newActivity.responsibleIds.length} responsable(s) seleccionado(s)`}
                    </span>
                    <Icon name={showResponsibleDropdown ? "up" : "down"} size={16} />
                  </button>
                  
                  {showResponsibleDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <label className="select-all-checkbox">
                          <input
                            type="checkbox"
                            checked={newActivity.responsibleIds.length === responsibles.length && responsibles.length > 0}
                            onChange={handleSelectAllResponsibles}
                          />
                          <span>Seleccionar todos</span>
                        </label>
                      </div>
                      <div className="dropdown-list">
                        {responsibles.map((responsible) => (
                          <div key={responsible.id} className="dropdown-item">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={newActivity.responsibleIds.includes(responsible.id)}
                                onChange={() => handleResponsibleCheckboxChange(responsible.id)}
                                className="checkbox-input"
                              />
                              <span className="checkbox-custom"></span>
                              {responsible.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {newActivity.responsibleIds.length > 0 && (
                  <div className="selected-items">
                    <strong>Seleccionados:</strong> {newActivity.responsibleIds.length}
                  </div>
                )}
                {responsibles.length === 0 && (
                  <div className="no-items">No hay responsables disponibles</div>
                )}
              </div>

              {/* Lugares - NUEVO: Checkboxes */}
              <div className="form-group">
                <label className="form-label">Lugares *</label>
                <div className="dropdown-container" ref={placeDropdownRef}>
                  <button
                    type="button"
                    className="dropdown-toggle"
                    onClick={() => setShowPlaceDropdown(!showPlaceDropdown)}
                  >
                    <span>
                      {newActivity.placeIds.length === 0
                        ? "Seleccionar lugares"
                        : `${newActivity.placeIds.length} lugar(es) seleccionado(s)`}
                    </span>
                    <Icon name={showPlaceDropdown ? "up" : "down"} size={16} />
                  </button>
                  
                  {showPlaceDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <label className="select-all-checkbox">
                          <input
                            type="checkbox"
                            checked={newActivity.placeIds.length === places.length && places.length > 0}
                            onChange={handleSelectAllPlaces}
                          />
                          <span>Seleccionar todos</span>
                        </label>
                      </div>
                      <div className="dropdown-list">
                        {places.map((place) => (
                          <div key={place.id} className="dropdown-item">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={newActivity.placeIds.includes(place.id)}
                                onChange={() => handlePlaceCheckboxChange(place.id)}
                                className="checkbox-input"
                              />
                              <span className="checkbox-custom"></span>
                              {place.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {newActivity.placeIds.length > 0 && (
                  <div className="selected-items">
                    <strong>Seleccionados:</strong> {newActivity.placeIds.length}
                  </div>
                )}
                {places.length === 0 && (
                  <div className="no-items">No hay lugares disponibles</div>
                )}
              </div>

              {/* Fechas - MODIFICADO: Solo fechas futuras */}
              <div className="form-group">
                <label className="form-label">Fechas *</label>
                {newActivity.dates.map((date, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="date"
                      className="form-input"
                      value={date}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      min={getTodayDate()} 
                    />
                    {newActivity.dates.length > 1 && (
                      <button
                        type="button"
                        className="remove-array-item"
                        onClick={() => handleRemoveDate(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-array-item"
                  onClick={handleAddDate}
                >
                  + Agregar Fecha
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    loading ||
                    newActivity.responsibleIds.length === 0 ||
                    newActivity.placeIds.length === 0 ||
                    newActivity.dates.every(date => date.trim() === "")
                  }
                >
                  {loading ? "Creando..." : "Crear Actividad"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewActivity({
                      classification: ActivityClassification.EVENTO_PROMOCIONAL,
                      type: ActivityType.INDIVIDUAL,
                      responsibleIds: [],
                      placeIds: [],
                      dates: [""],
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

      {showIncomeModal && newlyCreatedActivityId && (
        <CreateIncomeModal
          show={showIncomeModal}
          onClose={handleIncomeModalClose}
          activityId={newlyCreatedActivityId}
          // Opcional: puedes pasar más información si la necesitas
          // Por ejemplo, la fecha de la actividad para prellenar la fecha del income
          activityDates={newActivity.dates.filter(date => date.trim() !== "")}
        />
      )}

      {showIncomesModal && selectedActivityForIncomes && (
        <ViewActivityIncomesModal
          show={showIncomesModal}
          onClose={handleCloseIncomesModal}
          activityId={selectedActivityForIncomes.id}
          activityName={`${getClassificationText(selectedActivityForIncomes.classification)} - ${getTypeText(selectedActivityForIncomes.type)}`}
        />
      )}

      {/* Modal de edición */}
      {editingActivity && (
        <div className="modal-overlay activity-modal">
          <div className="modal-content">
            <h3>Editar Actividad</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Clasificación *</label>
                <select
                  className="form-select"
                  value={editActivity.classification}
                  onChange={(e) =>
                    setEditActivity({
                      ...editActivity,
                      classification: e.target.value as ActivityClassification,
                    })
                  }
                >
                  <option value={ActivityClassification.CLASE_BAILE}>Clase de baile</option>
                  <option value={ActivityClassification.CLASE_RAP}>Clase de rap</option>
                  <option value={ActivityClassification.CLASE_VOCAL}>Clase vocal</option>
                  <option value={ActivityClassification.CONCIERTO_PRÁCTICA}>Practica de concierto</option>
                  <option value={ActivityClassification.ENSAYO_COREOGRAFÍA}>Ensayo de coreografia</option>
                  <option value={ActivityClassification.ENTRENAMIENTO_FÍSICO}>Entrenamiento fisico</option>
                  <option value={ActivityClassification.ENTREVISTA}>Entrevista</option>
                  <option value={ActivityClassification.EVENTO_PROMOCIONAL}>Evento promocional</option>
                  <option value={ActivityClassification.GRABACIÓN_AUDIO}>Grabacion de audio</option>
                  <option value={ActivityClassification.GRABACIÓN_VÍDEO}>Grabacion de video</option>
                  <option value={ActivityClassification.REUNIÓN_FAN}>Reunion con fan</option>
                  <option value={ActivityClassification.SESIÓN_FOTOGRÁFICA}>Sesion de fotos</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo *</label>
                <select
                  className="form-select"
                  value={editActivity.type}
                  onChange={(e) =>
                    setEditActivity({
                      ...editActivity,
                      type: e.target.value as ActivityType,
                    })
                  }
                >
                  <option value={ActivityType.GRUPAL}>Grupal</option>
                  <option value={ActivityType.INDIVIDUAL}>Individual</option>
                </select>
              </div>
            </div>

            {/* Responsables - NUEVO: Checkboxes */}
            <div className="form-group">
              <label className="form-label">Responsables *</label>
              <div className="dropdown-container" ref={editResponsibleDropdownRef}>
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={() => setShowEditResponsibleDropdown(!showEditResponsibleDropdown)}
                >
                  <span>
                    {editActivity.responsibleIds.length === 0
                      ? "Seleccionar responsables"
                      : `${editActivity.responsibleIds.length} responsable(s) seleccionado(s)`}
                  </span>
                  <Icon name={showEditResponsibleDropdown ? "up" : "down"} size={16} />
                </button>
                
                {showEditResponsibleDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <label className="select-all-checkbox">
                        <input
                          type="checkbox"
                          checked={editActivity.responsibleIds.length === responsibles.length && responsibles.length > 0}
                          onChange={handleEditSelectAllResponsibles}
                        />
                        <span>Seleccionar todos</span>
                      </label>
                    </div>
                    <div className="dropdown-list">
                      {responsibles.map((responsible) => (
                        <div key={responsible.id} className="dropdown-item">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={editActivity.responsibleIds.includes(responsible.id)}
                              onChange={() => handleEditResponsibleCheckboxChange(responsible.id)}
                              className="checkbox-input"
                            />
                            <span className="checkbox-custom"></span>
                            {responsible.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {editActivity.responsibleIds.length > 0 && (
                <div className="selected-items">
                  <strong>Seleccionados:</strong> {editActivity.responsibleIds.length}
                </div>
              )}
              {responsibles.length === 0 && (
                <div className="no-items">No hay responsables disponibles</div>
              )}
            </div>

            {/* Lugares - NUEVO: Checkboxes */}
            <div className="form-group">
              <label className="form-label">Lugares *</label>
              <div className="dropdown-container" ref={editPlaceDropdownRef}>
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={() => setShowEditPlaceDropdown(!showEditPlaceDropdown)}
                >
                  <span>
                    {editActivity.placeIds.length === 0
                      ? "Seleccionar lugares"
                      : `${editActivity.placeIds.length} lugar(es) seleccionado(s)`}
                  </span>
                  <Icon name={showEditPlaceDropdown ? "up" : "down"} size={16} />
                </button>
                
                {showEditPlaceDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <label className="select-all-checkbox">
                        <input
                          type="checkbox"
                          checked={editActivity.placeIds.length === places.length && places.length > 0}
                          onChange={handleEditSelectAllPlaces}
                        />
                        <span>Seleccionar todos</span>
                      </label>
                    </div>
                    <div className="dropdown-list">
                      {places.map((place) => (
                        <div key={place.id} className="dropdown-item">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={editActivity.placeIds.includes(place.id)}
                              onChange={() => handleEditPlaceCheckboxChange(place.id)}
                              className="checkbox-input"
                            />
                            <span className="checkbox-custom"></span>
                            {place.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {editActivity.placeIds.length > 0 && (
                <div className="selected-items">
                  <strong>Seleccionados:</strong> {editActivity.placeIds.length}
                </div>
              )}
              {places.length === 0 && (
                <div className="no-items">No hay lugares disponibles</div>
              )}
            </div>

            {/* Fechas - MODIFICADO: Solo fechas futuras */}
            <div className="form-group">
              <label className="form-label">Fechas *</label>
              {editActivity.dates.map((date, index) => (
                <div key={index} className="array-input-group">
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => {
                      const updated = [...editActivity.dates];
                      updated[index] = e.target.value;
                      setEditActivity({ ...editActivity, dates: updated });
                    }}
                    min={getTodayDate()}
                  />
                  {editActivity.dates.length > 1 && (
                    <button
                      type="button"
                      className="remove-array-item"
                      onClick={() => {
                        const updated = editActivity.dates.filter((_, i) => i !== index);
                        setEditActivity({ ...editActivity, dates: updated });
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-array-item"
                onClick={() => {
                  setEditActivity({
                    ...editActivity,
                    dates: [...editActivity.dates, ""]
                  });
                }}
              >
                + Agregar Fecha
              </button>
            </div>

            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={handleUpdate}
                disabled={
                  loading ||
                  editActivity.responsibleIds.length === 0 ||
                  editActivity.placeIds.length === 0 ||
                  editActivity.dates.every(date => date.trim() === "")
                }
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setEditingActivity(null);
                  setEditActivity({
                    classification: ActivityClassification.EVENTO_PROMOCIONAL,
                    type: ActivityType.INDIVIDUAL,
                    responsibleIds: [],
                    placeIds: [],
                    dates: [""],
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
      {deletingActivity && (
        <div className="modal-overlay activity-modal">
          <div className="modal-content">
            <h3>¿Eliminar Actividad?</h3>
            <div className="delete-confirmation">
              <p>¿Está seguro de que desea eliminar esta actividad?</p>
              <div className="activity-details">
                <div className="detail-item">
                  <strong>Clasificación:</strong> {getClassificationText(deletingActivity.classification)}
                </div>
                <div className="detail-item">
                  <strong>Tipo:</strong> {getTypeText(deletingActivity.type)}
                </div>
                <div className="detail-item">
                  <strong>Responsables:</strong> {deletingActivity.responsibles.length}
                </div>
                <div className="detail-item">
                  <strong>Lugares:</strong> {deletingActivity.places.length}
                </div>
                <div className="detail-item">
                  <strong>Fechas:</strong> {deletingActivity.dates.length}
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
                onClick={() => setDeletingActivity(null)}
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

export default ActivityManagement;