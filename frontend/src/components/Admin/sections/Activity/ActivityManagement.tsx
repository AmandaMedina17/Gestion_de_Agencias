// ActivityManagement.tsx
import React, { useState, useEffect } from "react";
import { useActivity } from "../../../../context/ActivityContext";
import { useResponsible } from "../../../../context/ResponsibleContext";
import { usePlace } from "../../../../context/PlaceContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reusable/CreateModal";
import EditModal from "../../../ui/reusable/EditModal";
import DeleteModal from "../../../ui/reusable/DeleteModal";
import MultiSelect from "../../../ui/select";
import CreateIncomeModal from "./Income/CreationIncome";
import ViewActivityIncomesModal from "./Income/ViewActivityIncome";
import "./ActivityStyle.css";
import { ActivityResponseDto as BackendActivityResponseDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/activityDto/response-activity.dto";
import { Icon } from "../../../icons";

export enum ActivityClassification {
  CLASE_VOCAL = "CLASE_VOCAL",
  CLASE_BAILE = "CLASE_BAILE",
  CLASE_RAP = "CLASE_RAP",
  ENTRENAMIENTO_FÍSICO = "ENTRENAMIENTO_FÍSICO",
  CONCIERTO_PRÁCTICA = "CONCIERTO_PRÁCTICA",
  GRABACIÓN_VÍDEO = "GRABACIÓN_VÍDEO",
  GRABACIÓN_AUDIO = "GRABACIÓN_AUDIO",
  SESIÓN_FOTOGRÁFICA = "SESIÓN_FOTOGRÁFICA",
  ENSAYO_COREOGRAFÍA = "ENSAYO_COREOGRAFÍA",
  ENTREVISTA = "ENTREVISTA",
  REUNIÓN_FAN = "REUNIÓN_FAN",
  EVENTO_PROMOCIONAL = "EVENTO_PROMOCIONAL",
}

export enum ActivityType {
  INDIVIDUAL = "INDIVIDUAL",
  GRUPAL = "GRUPAL",
}

type ActivityResponseDto = BackendActivityResponseDto & {
  responsibleIds?: string[];
  placeIds?: string[];
};

const getClassificationText = (classification: ActivityClassification) => {
  const classificationMap = {
    [ActivityClassification.CLASE_BAILE]: "Clase de baile",
    [ActivityClassification.CLASE_RAP]: "Clase de rap",
    [ActivityClassification.CLASE_VOCAL]: "Clase vocal",
    [ActivityClassification.CONCIERTO_PRÁCTICA]: "Práctica de concierto",
    [ActivityClassification.ENSAYO_COREOGRAFÍA]: "Ensayo de coreografía",
    [ActivityClassification.ENTRENAMIENTO_FÍSICO]: "Entrenamiento físico",
    [ActivityClassification.ENTREVISTA]: "Entrevista",
    [ActivityClassification.EVENTO_PROMOCIONAL]: "Evento promocional",
    [ActivityClassification.GRABACIÓN_AUDIO]: "Grabación de audio",
    [ActivityClassification.GRABACIÓN_VÍDEO]: "Grabación de video",
    [ActivityClassification.REUNIÓN_FAN]: "Reunión con fan",
    [ActivityClassification.SESIÓN_FOTOGRÁFICA]: "Sesión de fotos",
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

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingActivity, setEditingActivity] =
    useState<ActivityResponseDto | null>(null);
  const [deletingActivity, setDeletingActivity] =
    useState<ActivityResponseDto | null>(null);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [newlyCreatedActivityId, setNewlyCreatedActivityId] = useState<
    string | null
  >(null);
  const [showIncomesModal, setShowIncomesModal] = useState(false);
  const [selectedActivityForIncomes, setSelectedActivityForIncomes] =
    useState<ActivityResponseDto | null>(null);
  const [dateFields, setDateFields] = useState([""]);
  const [selectedResponsibleIds, setSelectedResponsibleIds] = useState<
    string[]
  >([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchActivities(),
          fetchResponsibles(),
          fetchPlaces(),
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  // Funciones auxiliares para notificaciones
  const showNotification = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string
  ) => {
    setNotification({ type, title, message });
  };

  const showSuccess = (title: string, message: string) => {
    showNotification("success", title, message);
  };

  const showError = (title: string, message: string) => {
    showNotification("error", title, message);
  };

  const showCreateSuccess = () => {
    showSuccess(
      "¡Actividad Creada!",
      "La actividad ha sido creada exitosamente."
    );
  };

  const showCreateError = (errorMessage?: string) => {
    showError(
      "Error al Crear",
      errorMessage || "No se pudo crear la actividad."
    );
  };

  const showUpdateSuccess = () => {
    showSuccess(
      "¡Actividad Actualizada!",
      "La actividad ha sido actualizada exitosamente."
    );
  };

  const showUpdateError = (errorMessage?: string) => {
    showError(
      "Error al Actualizar",
      errorMessage || "No se pudo actualizar la actividad."
    );
  };

  const showDeleteSuccess = () => {
    showSuccess(
      "¡Actividad Eliminada!",
      "La actividad ha sido eliminada exitosamente."
    );
  };

  const showDeleteError = (errorMessage?: string) => {
    showError(
      "Error al Eliminar",
      errorMessage || "No se pudo eliminar la actividad."
    );
  };

  // Funciones auxiliares para mostrar nombres
  const getResponsibleNames = (activity: ActivityResponseDto) => {
    if (activity.responsibles && activity.responsibles.length > 0) {
      return activity.responsibles.map((r) => r.name).join(", ");
    }
    return "No asignado";
  };

  const getPlaceNames = (activity: ActivityResponseDto) => {
    if (activity.places && activity.places.length > 0) {
      return activity.places.map((p) => p.name).join(", ");
    }
    return "No asignado";
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleDateString("es-ES");
  };

  // Campos del formulario para creación - ESTILO APPRENTICE
  const activityFields: FormField[] = [
    {
      name: "classification",
      label: "Clasificación",
      type: "autocomplete",
      placeholder: "Seleccione la clasificación de la actividad",
      required: true,
      options: Object.values(ActivityClassification).map((value) => ({
        value,
        label: getClassificationText(value),
      })),
    },
    {
      name: "type",
      label: "Tipo",
      type: "autocomplete",
      placeholder: "Seleccione el tipo de actividad",
      required: true,
      options: [
        { value: ActivityType.INDIVIDUAL, label: "Individual" },
        { value: ActivityType.GRUPAL, label: "Grupal" },
      ],
    },
    {
      name: "responsibleIds",
      label: "Responsables",
      type: "autocomplete",
      placeholder: "Seleccione los responsables",
      required: true,
      multiple: true,
      options: responsibles.map((responsible) => ({
        value: responsible.id,
        label: responsible.name,
      })),
      validate: (value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return "Debe seleccionar al menos un responsable";
        }
        return null;
      },
    },
    {
      name: "placeIds",
      label: "Lugares",
      type: "autocomplete",
      placeholder: "Seleccione los lugares",
      required: true,
      multiple: true,
      options: places.map((place) => ({
        value: place.id,
        label: place.name,
      })),
      validate: (value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return "Debe seleccionar al menos un lugar";
        }
        return null;
      },
    },
  ];

  // Campos del formulario para edición (sin responsables y lugares ya que se manejan diferente)
  const activityEditFields: FormField[] = [
    {
      name: "classification",
      label: "Clasificación",
      type: "autocomplete",
      required: true,
      options: Object.values(ActivityClassification).map((value) => ({
        value,
        label: getClassificationText(value),
      })),
    },
    {
      name: "type",
      label: "Tipo",
      type: "autocomplete",
      required: true,
      options: [
        { value: ActivityType.INDIVIDUAL, label: "Individual" },
        { value: ActivityType.GRUPAL, label: "Grupal" },
      ],
    },
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    classification: ActivityClassification.EVENTO_PROMOCIONAL,
    type: ActivityType.INDIVIDUAL,
    responsibleIds: [],
    placeIds: [],
  };

  // Manejar creación de actividad
  const handleCreate = async (data: Record<string, any>) => {
    try {
      // Filtrar fechas válidas
      const validDates = dateFields.filter((date) => date.trim() !== "");

      if (validDates.length === 0) {
        showError("Error", "Debe ingresar al menos una fecha válida");
        return;
      }

      // Verificar que las fechas sean futuras
      const hasPastDate = validDates.some((date) => {
        const dateObj = new Date(date);
        // Comparar solo la fecha (sin hora)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj < today;
      });

      if (hasPastDate) {
        showError("Error", "Las fechas deben ser futuras o del día actual");
        return;
      }

      const createdActivity = await createActivity({
        classification: data.classification,
        type: data.type,
        responsibleIds: selectedResponsibleIds,
        placeIds: selectedPlaceIds,
        dates: validDates.map((date) => new Date(date)),
      });

      showCreateSuccess();
      setShowCreateModal(false);
      setNewlyCreatedActivityId(createdActivity.id);

      // Abrir modal de ingreso después de 500ms
      setTimeout(() => {
        setShowIncomeModal(true);
      }, 500);

      // Resetear formulario
      setDateFields([""]);
      setSelectedResponsibleIds([]);
      setSelectedPlaceIds([]);

      await fetchActivities();
    } catch (err: any) {
      showCreateError(err.message);
    }
  };

  // Manejar actualización
  const handleUpdate = async (
    id: string | number,
    data: Record<string, any>
  ) => {
    if (!editingActivity) return;

    try {
      // Usar los IDs seleccionados
      await updateActivity(id as string, {
        classification: data.classification,
        type: data.type,
        responsibleIds: selectedResponsibleIds,
        placeIds: selectedPlaceIds,
        dates: dateFields
          .filter((date) => date.trim() !== "")
          .map((date) => new Date(date)),
      });

      showUpdateSuccess();
      setEditingActivity(null);
      // Resetear formulario
      setDateFields([""]);
      setSelectedResponsibleIds([]);
      setSelectedPlaceIds([]);
      await fetchActivities();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingActivity) return;

    try {
      await deleteActivity(id as string);
      showDeleteSuccess();
      setDeletingActivity(null);
      await fetchActivities();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Abrir modal de creación
  const handleOpenCreateModal = () => {
    setDateFields([""]);
    setSelectedResponsibleIds([]);
    setSelectedPlaceIds([]);
    setShowCreateModal(true);
  };

  // Abrir modal de edición
  const handleOpenEditModal = (activity: ActivityResponseDto) => {
    setEditingActivity(activity);
    // Obtener IDs de responsables y lugares
    const responsibleIds = activity.responsibles?.map((r) => r.name) || [];
    const placeIds = activity.places?.map((p) => p.name) || [];

    setSelectedResponsibleIds(responsibleIds);
    setSelectedPlaceIds(placeIds);

    // Formatear fechas para el input
    const formattedDates = activity.dates.map((date: Date | string) => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toISOString().split("T")[0];
    });
    setDateFields(formattedDates);
  };

  // Columnas para la tabla
  const columns: Column<ActivityResponseDto>[] = [
    {
      key: "classification",
      title: "Clasificación",
      sortable: true,
      width: "20%",
      align: "center",
      render: (item) => getClassificationText(item.classification),
    },
    {
      key: "type",
      title: "Tipo",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => (
        <div className={`type-income ${item.type.toLowerCase()}`}>
           {getTypeText(item.type)}
        </div>
       
      ),
    },
    {
      key: "responsibles",
      title: "Responsables",
      sortable: false,
      width: "20%",
      align: "center",
      render: (item) => {
        const responsibleNames = getResponsibleNames(item);
        if (responsibleNames === "No asignado") {
          return <span className="no-data">No asignado</span>;
        }
        
        // Si es una cadena, separarla por comas
        const names = typeof responsibleNames === 'string' 
          ? responsibleNames.split(', ') 
          : responsibleNames;
        
        return (
          <div className="vertical-list">
            {Array.isArray(names) ? (
              names.map((name, index) => (
                <div key={index} className="list-item">
                  {name.trim()}
                </div>
              ))
            ) : (
              <div className="list-item">{responsibleNames}</div>
            )}
          </div>
        );
      },
      },
    {
      key: "places",
      title: "Lugares",
      sortable: false,
      width: "20%",
      align: "center",
      render: (item) => {
        const placeNames = getPlaceNames(item);
        if (placeNames === "No asignado") {
          return <span className="no-data">No asignado</span>;
        }
        
        // Si es una cadena, separarla por comas
        const names = typeof placeNames === 'string' 
          ? placeNames.split(', ') 
          : placeNames;
        
        return (
          <div className="vertical-list">
            {Array.isArray(names) ? (
              names.map((name, index) => (
                <div key={index} className="list-item">
                  {name.trim()}
                </div>
              ))
            ) : (
              <div className="list-item">{placeNames}</div>
            )}
          </div>
        );
      },
      },
    {
      key: "dates",
      title: "Fechas",
      sortable: false,
      width: "15%",
      align: "center",
      render: (item) => (
        <div className="vertical-list">
          {item.dates.slice(0, 5).map((date, index) => (
            <div key={index} className="list-item date-item">
              {formatDate(date)}
            </div>
          ))}
          {item.dates.length > 5 && (
            <div className="list-item more-dates">
              +{item.dates.length - 5} más
            </div>
          )}
        </div>
      ),
    },
    {
      key: "incomeActions",
      title: "Ingresos",
      sortable: false,
      width: "10%",
      align: "center",
      render: (item) => (
        <div className="income-action-container">
          <button
            className="action-btn income-btn-comp compact"
            onClick={() => {
              setSelectedActivityForIncomes(item);
              setShowIncomesModal(true);
            }}
            title="Ver ingresos de la actividad"
          >
            <span className="btn-icon">
              <Icon name="eye" size={18} />
            </span>
          </button>
        </div>
      ),
    },
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderActivityDetails = (activity: ActivityResponseDto) => {
    return (
      <div className="activity-details">
        <div className="detail-item">
          <strong>Clasificación:</strong>{" "}
          <span>{getClassificationText(activity.classification)}</span>
        </div>
        <div className="detail-item">
          <strong>Tipo:</strong> <span>{getTypeText(activity.type)}</span>
        </div>
        <div className="detail-item">
          <strong>Responsables:</strong>{" "}
          <span>{getResponsibleNames(activity)}</span>
        </div>
        <div className="detail-item">
          <strong>Lugares:</strong> <span>{getPlaceNames(activity)}</span>
        </div>
        <div className="detail-item">
          <strong>Fechas:</strong>
          <div className="dates-list-vertical">
            {activity.dates.map((date, index) => (
              <div key={index} className="date-item">
                {formatDate(date)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="activity_management" className="content-section active">
      <GenericTable<ActivityResponseDto>
        title="Gestión de Actividades"
        description="Administre todas las actividades del sistema"
        data={activities}
        columns={columns}
        loading={loading}
        onReload={() => {
          fetchActivities();
          fetchResponsibles();
          fetchPlaces();
        }}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingActivity}
        onEditingChange={setEditingActivity}
        deletingItem={deletingActivity}
        onDeletingChange={setDeletingActivity}
        itemsPerPage={30}
        className="activity-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal personalizado para creación */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Crear Nueva Actividad</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = {
                  classification: formData.get(
                    "classification"
                  ) as ActivityClassification,
                  type: formData.get("type") as ActivityType,
                  responsibleIds: selectedResponsibleIds,
                  placeIds: selectedPlaceIds,
                };
                handleCreate(data);
              }}
            >
              {/* Campos básicos usando FormField */}
              <div className="form-row">
                <div className="form-group">
                  <label>Clasificación *</label>
                  <select
                    name="classification"
                    className="form-select"
                    required
                    defaultValue={initialCreateData.classification}
                  >
                    {activityFields[0].options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    name="type"
                    className="form-select"
                    required
                    defaultValue={initialCreateData.type}
                  >
                    {activityFields[1].options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Responsables (MultiSelect) */}
              <div className="form-group">
                <label>Responsables *</label>
                <MultiSelect
                  label="Seleccione responsables"
                  options={responsibles.map((r) => ({
                    value: r.id,
                    label: r.name,
                  }))}
                  selectedValues={selectedResponsibleIds}
                  onChange={setSelectedResponsibleIds}
                  required
                />
              </div>

              {/* Lugares (MultiSelect) */}
              <div className="form-group">
                <label>Lugares *</label>
                <MultiSelect
                  label="Seleccione lugares"
                  options={places.map((p) => ({ value: p.id, label: p.name }))}
                  selectedValues={selectedPlaceIds}
                  onChange={setSelectedPlaceIds}
                  required
                />
              </div>

              {/* Fechas múltiples */}
              <div className="form-group">
                <label>Fechas *</label>
                {dateFields.map((date, index) => (
                  <div key={index} className="date-input-row">
                    <input
                      type="date"
                      className="form-input"
                      value={date}
                      onChange={(e) => {
                        const newDates = [...dateFields];
                        newDates[index] = e.target.value;
                        setDateFields(newDates);
                      }}
                      required
                    />
                    {dateFields.length > 1 && (
                      <button
                        type="button"
                        className="remove-date"
                        onClick={() => {
                          setDateFields(
                            dateFields.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-date"
                  onClick={() => setDateFields([...dateFields, ""])}
                >
                  + Agregar Fecha
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Actividad"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowCreateModal(false)}
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
      {editingActivity && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Actividad</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = {
                  classification: formData.get(
                    "classification"
                  ) as ActivityClassification,
                  type: formData.get("type") as ActivityType,
                  responsibleIds: selectedResponsibleIds,
                  placeIds: selectedPlaceIds,
                };
                handleUpdate(editingActivity.id, data);
              }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label>Clasificación *</label>
                  <select
                    name="classification"
                    className="form-select"
                    required
                    defaultValue={editingActivity.classification}
                  >
                    {activityEditFields[0].options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    name="type"
                    className="form-select"
                    required
                    defaultValue={editingActivity.type}
                  >
                    {activityEditFields[1].options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Responsables (MultiSelect) */}
              <div className="form-group">
                <label>Responsables *</label>
                <MultiSelect
                  label="Seleccione responsables"
                  options={responsibles.map((r) => ({
                    value: r.id,
                    label: r.name,
                  }))}
                  selectedValues={selectedResponsibleIds}
                  onChange={setSelectedResponsibleIds}
                  required
                />
              </div>

              {/* Lugares (MultiSelect) */}
              <div className="form-group">
                <label>Lugares *</label>
                <MultiSelect
                  label="Seleccione lugares"
                  options={places.map((p) => ({ value: p.id, label: p.name }))}
                  selectedValues={selectedPlaceIds}
                  onChange={setSelectedPlaceIds}
                  required
                />
              </div>

              {/* Fechas múltiples */}
              <div className="form-group">
                <label>Fechas *</label>
                {dateFields.map((date, index) => (
                  <div key={index} className="date-input-row">
                    <input
                      type="date"
                      className="form-input"
                      value={date}
                      onChange={(e) => {
                        const newDates = [...dateFields];
                        newDates[index] = e.target.value;
                        setDateFields(newDates);
                      }}
                      required
                    />
                    {dateFields.length > 1 && (
                      <button
                        type="button"
                        className="remove-date"
                        onClick={() => {
                          setDateFields(
                            dateFields.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-date"
                  onClick={() => setDateFields([...dateFields, ""])}
                >
                  + Agregar Fecha
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Actualizando..." : "Actualizar Actividad"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setEditingActivity(null);
                    setDateFields([""]);
                    setSelectedResponsibleIds([]);
                    setSelectedPlaceIds([]);
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

      {/* Modal de eliminación usando componente genérico */}
      {deletingActivity && (
        <DeleteModal<ActivityResponseDto>
          title="¿Eliminar Actividad?"
          item={deletingActivity}
          itemName="Actividad"
          itemId={deletingActivity.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingActivity(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderActivityDetails}
        />
      )}

      {/* Modal de ingresos */}
      {showIncomeModal && newlyCreatedActivityId && (
        <CreateIncomeModal
          show={showIncomeModal}
          onClose={() => setShowIncomeModal(false)}
          activityId={newlyCreatedActivityId}
        />
      )}

      {/* Modal para ver ingresos */}
      {showIncomesModal && selectedActivityForIncomes && (
        <ViewActivityIncomesModal
          show={showIncomesModal}
          onClose={() => {
            setShowIncomesModal(false);
            setSelectedActivityForIncomes(null);
          }}
          activityId={selectedActivityForIncomes.id}
          activityName={`${getClassificationText(
            selectedActivityForIncomes.classification
          )} - ${getTypeText(selectedActivityForIncomes.type)}`}
        />
      )}
    </section>
  );
};

export default ActivityManagement;
