// EvaluationManagement.tsx
import React, { useState, useEffect } from "react";
import { useApprentice } from "../../../../context/ApprenticeContext";
import { useApprenticeEvaluation } from "../../../../context/EvaluationContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reusable/CreateModal";
import EditModal from "../../../ui/reusable/EditModal";
import DeleteModal from "../../../ui/reusable/DeleteModal";
import { EvaluationResponseDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/evaluationDto/response-evaluation.dto";
import "./EvaluationStyle.css";

// Enum para los valores de evaluación
export enum EvaluationValue {
  EXCELENTE = "EXCELENTE",
  BIEN = "BIEN",
  REGULAR = "REGULAR",
  MAL = "MAL",
  INSUFICIENTE = "INSUFICIENTE",
}

// Extender el tipo para incluir id y apprenticeName
interface EvaluationTableItem extends Omit<EvaluationResponseDto, 'id'> {
  id: string; // ID compuesto: apprenticeId-date
  apprenticeName: string;
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
    loading: evaluationLoading,
    error: evaluationError,
    clearError: clearEvaluationError,
  } = useApprenticeEvaluation();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<EvaluationTableItem | null>(null);
  const [deletingEvaluation, setDeletingEvaluation] = useState<EvaluationTableItem | null>(null);

  // Enriquecer evaluaciones con id compuesto y nombres de aprendices
  const enrichedEvaluations: EvaluationTableItem[] = React.useMemo(() => {
    if (!evaluations.length || !apprentices.length) return [];

    return evaluations.map(evaluation => {
      const apprentice = apprentices.find(a => a.id === evaluation.apprentice);
      // Crear ID compuesto usando apprenticeId y date
      const dateObj = new Date(evaluation.date);
      const dateString = dateObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const id = `${evaluation.apprentice}_${dateString}`;
      
      return {
        ...evaluation,
        id,
        apprenticeName: apprentice ? apprentice.fullName : "No encontrado"
      };
    });
  }, [evaluations, apprentices]);

  useEffect(() => {
    const loadData = async () => {
      try {
        clearApprenticeError();
        clearEvaluationError();
        await Promise.all([fetchApprentices(), fetchEvaluations()]);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

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

  // Definir campos del formulario de evaluación
  const evaluationFields: FormField[] = [
    {
      name: "apprentice",
      label: "Aprendiz",
      type: "autocomplete",
      required: true,
      options: apprentices.map((apprentice) => ({
        value: apprentice.id,
        label: apprentice.fullName,
      })),
      validate: (value) => {
        if (!value) return "Seleccione un aprendiz";
        return null;
      },
    },
    {
      name: "date",
      label: "Fecha de Evaluación",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha es requerida";
        if (isFutureDate(value)) return "La fecha no puede ser futura";
        return null;
      },
    },
    {
      name: "evaluation",
      label: "Evaluación",
      type: "autocomplete",
      required: true,
      options: [
        { value: EvaluationValue.EXCELENTE, label: "Excelente" },
        { value: EvaluationValue.BIEN, label: "Bueno" },
        { value: EvaluationValue.REGULAR, label: "Regular" },
        { value: EvaluationValue.INSUFICIENTE, label: "Insuficiente" },
        { value: EvaluationValue.MAL, label: "Mal" },
      ],
    },
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    apprentice: "",
    date: "",
    evaluation: EvaluationValue.BIEN,
  };

  // Funciones auxiliares para mostrar notificaciones
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
      "¡Evaluación Creada!",
      "La evaluación ha sido creada exitosamente."
    );
  };

  const showCreateError = (errorMessage?: string) => {
    showError(
      "Error al Crear",
      errorMessage || "No se pudo crear la evaluación."
    );
  };

  const showUpdateSuccess = () => {
    showSuccess(
      "¡Evaluación Actualizada!",
      "La evaluación ha sido actualizada exitosamente."
    );
  };

  const showUpdateError = (errorMessage?: string) => {
    showError(
      "Error al Actualizar",
      errorMessage || "No se pudo actualizar la evaluación."
    );
  };

  const showDeleteSuccess = () => {
    showSuccess(
      "¡Evaluación Eliminada!",
      "La evaluación ha sido eliminada exitosamente."
    );
  };

  const showDeleteError = (errorMessage?: string) => {
    showError(
      "Error al Eliminar",
      errorMessage || "No se pudo eliminar la evaluación."
    );
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      console.log("Datos para crear evaluación:", data);

      const dateForBackend = new Date(data.date);

      await createEvaluation({
        apprentice: data.apprentice,
        date: dateForBackend,
        evaluation: data.evaluation,
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchEvaluations();
    } catch (err: any) {
      console.error("Error al crear evaluación:", err);
      showCreateError(err.message);
    }
  };

  // Manejar actualización - AHORA ACEPTA string | number
  const handleUpdate = async (
    id: string | number,
    data: Record<string, any>
  ) => {
    if (!editingEvaluation) return;

    try {
      // Convertir id a string si es necesario
      const idStr = id.toString();
      const [apprenticeId, dateString] = idStr.split('_');
      
      await updateEvaluation(
        apprenticeId,
        new Date(dateString),
        { evaluation: data.evaluation }
      );

      showUpdateSuccess();
      setEditingEvaluation(null);
      await fetchEvaluations();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación - AHORA ACEPTA string | number
  const handleDelete = async (id: string | number) => {
    if (!deletingEvaluation) return;

    try {
      // Convertir id a string si es necesario
      const idStr = id.toString();
      const [apprenticeId, dateString] = idStr.split('_');
      
      await deleteEvaluation(
        apprenticeId,
        new Date(dateString)
      );
      showDeleteSuccess();
      setDeletingEvaluation(null);
      await fetchEvaluations();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Definir columnas para la tabla
  const columns: Column<EvaluationTableItem>[] = [
    {
      key: "apprenticeName",
      title: "Aprendiz",
      sortable: true,
      width: "30%",
      align: "center",
    },
    {
      key: "date",
      title: "Fecha",
      sortable: true,
      width: "20%",
      align: "center",
      render: (item) => formatDate(item.date),
    },
    {
      key: "evaluation",
      title: "Evaluación",
      sortable: true,
      width: "30%",
      align: "center",
      render: (item) => (
        <span className={`evaluation-badge ${getEvaluationClass(item.evaluation)}`}>
          {getEvaluationText(item.evaluation)}
        </span>
      ),
    },
    
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderEvaluationDetails = (evaluation: EvaluationTableItem) => (
    <div className="evaluation-details">
      <div className="detail-item">
        <strong>Aprendiz:</strong>{" "}
        <span>{getApprenticeName(evaluation.apprentice)}</span>
      </div>
      <div className="detail-item">
        <strong>Fecha:</strong>{" "}
        <span>{formatDate(evaluation.date)}</span>
      </div>
      <div className="detail-item">
        <strong>Evaluación:</strong>{" "}
        <span className={`evaluation-badge ${getEvaluationClass(evaluation.evaluation)}`}>
          {getEvaluationText(evaluation.evaluation)}
        </span>
      </div>
    </div>
  );

  // Manejar notificación combinada
  useEffect(() => {
    if (apprenticeError) {
      setNotification({
        type: "error",
        title: "Error de Aprendices",
        message: apprenticeError,
      });
    }
    if (evaluationError) {
      setNotification({
        type: "error",
        title: "Error de Evaluaciones",
        message: evaluationError,
      });
    }
  }, [apprenticeError, evaluationError]);

  return (
    <section id="evaluation_manager" className="content-section active">
      <GenericTable<EvaluationTableItem>
        title="Gestión de Evaluaciones"
        description="Agregue y administre evaluaciones para los aprendices"
        data={enrichedEvaluations}
        columns={columns}
        loading={apprenticeLoading || evaluationLoading}
        onReload={() => {
          clearApprenticeError();
          clearEvaluationError();
          fetchApprentices();
          fetchEvaluations();
        }}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingEvaluation}
        onEditingChange={setEditingEvaluation}
        deletingItem={deletingEvaluation}
        onDeletingChange={setDeletingEvaluation}
        itemsPerPage={30}
        className="evaluation-table"
        notification={notification || undefined}
        onNotificationClose={() => {
          setNotification(null);
          clearApprenticeError();
          clearEvaluationError();
        }}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nueva Evaluación"
          fields={evaluationFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={evaluationLoading}
          submitText="Crear Evaluación"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingEvaluation && (
        <EditModal
          title="Editar Evaluación"
          fields={evaluationFields.filter(field => field.name === "evaluation")} // Solo permitir cambiar evaluación
          initialData={{
            evaluation: editingEvaluation.evaluation,
            // Mostrar campos de solo lectura
            apprentice: editingEvaluation.apprentice,
            date: new Date(editingEvaluation.date).toISOString().split('T')[0],
          }}
          itemId={editingEvaluation.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingEvaluation(null)}
          loading={evaluationLoading}
          submitText="Actualizar Evaluación"
          // readOnlyFields={["apprentice", "date"]} // Campos de solo lectura
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingEvaluation && (
        <DeleteModal<EvaluationTableItem>
          title="¿Eliminar Evaluación?"
          item={deletingEvaluation}
          itemName="Evaluación"
          itemId={deletingEvaluation.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingEvaluation(null)}
          loading={evaluationLoading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderEvaluationDetails}
        />
      )}
    </section>
  );
};

export default EvaluationManagement;