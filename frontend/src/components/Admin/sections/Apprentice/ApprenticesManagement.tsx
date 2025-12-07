import React, { useState, useEffect } from "react";
import { useApprentice } from "../../../../context/ApprenticeContext";
import { useAgency } from "../../../../context/AgencyContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reutilizables/CreateModal";
import EditModal from "../../../ui/reutilizables/EditModal";
import DeleteModal from "../../../ui/reutilizables/DeleteModal";
import './ApprenticeStyle.css'
import { ApprenticeResponseDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto";


export enum ApprenticeTrainingLevel {
  PRINCIPIANTE = "PRINCIPIANTE",
  INTERMEDIO = "INTERMEDIO",
  AVANZADO = "AVANZADO",
}

export enum ApprenticeStatus {
  EN_ENTRENAMIENTO = "EN_ENTRENAMIENTO",
  PROCESO_DE_SELECCION = "PROCESO_DE_SELECCION",
  TRANSFERIDO = "TRANSFERIDO",
}

const ApprenticeManagement: React.FC = () => {
  const {
    apprentices,
    fetchApprentices,
    createApprentice,
    updateApprentice,
    deleteApprentice,
    loading,
    error,
    clearError,
  } = useApprentice();

  const { agencies, fetchAgencies } = useAgency();
  
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingApprentice, setEditingApprentice] = useState<ApprenticeResponseDto | null>(null);
  const [deletingApprentice, setDeletingApprentice] = useState<ApprenticeResponseDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchApprentices(),
          fetchAgencies()
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  // FUNCIÓN PARA OBTENER NOMBRE DE LA AGENCIA
  const getAgencyName = (apprentice: ApprenticeResponseDto) => {
    if (apprentice.agency && typeof apprentice.agency === 'object') {
      return `${apprentice.agency} `;
    }
    const agency = agencies.find(a => a.id === apprentice.agency);
    return agency ? `${agency.nameAgency} - ${agency.place}` : "No asignado";
  };

  // Definir campos del formulario de aprendiz
  const apprenticeFields: FormField[] = [
    {
      name: "fullName",
      label: "Nombre completo",
      type: "text",
      placeholder: "Ej: Juan Pérez García",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
        return null;
      }
    },
    {
      name: "age",
      label: "Edad",
      type: "text",
      placeholder: "Ej: 25",
      required: true,
      min: 16,
      max: 100,
      validate: (value) => {
        if (value < 16) return "La edad mínima es 16 años";
        if (value > 100) return "La edad máxima es 100 años";
        return null;
      }
    },
    {
      name: "entryDate",
      label: "Fecha de ingreso",
      type: "date",
      required: true,
      validate: (value) => {
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      }
    },
    {
      name: "status",
      label: "Estado",
      type: "autocomplete",
      required: true,
      options: [
        { value: ApprenticeStatus.EN_ENTRENAMIENTO, label: "En entrenamiento" },
        { value: ApprenticeStatus.PROCESO_DE_SELECCION, label: "Proceso de selección" },
        { value: ApprenticeStatus.TRANSFERIDO, label: "Transferido" }
      ]
    },
    {
      name: "trainingLevel",
      label: "Nivel de entrenamiento",
      type: "autocomplete",
      required: true,
      options: [
        { value: ApprenticeTrainingLevel.PRINCIPIANTE, label: "Principiante" },
        { value: ApprenticeTrainingLevel.INTERMEDIO, label: "Intermedio" },
        { value: ApprenticeTrainingLevel.AVANZADO, label: "Avanzado" }
      ]
    },
    {
      name: "agencyId",
      label: "Agencia",
      type: "autocomplete",
      required: true,
      options: agencies.map(agency => ({
        value: agency.id,
        label: `${agency.nameAgency} - ${agency.place}`
      }))
    }
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    fullName: "",
    age: "",
    entryDate: "",
    status: ApprenticeStatus.EN_ENTRENAMIENTO,
    trainingLevel: ApprenticeTrainingLevel.PRINCIPIANTE,
    agencyId: ""
  };

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
    showSuccess("¡Aprendiz Creado!", "El aprendiz ha sido creado exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear el aprendiz.");
  };

  const showUpdateSuccess = () => {
    showSuccess("¡Aprendiz Actualizado!", "El aprendiz ha sido actualizado exitosamente.");
  };

  const showUpdateError = (errorMessage?: string) => {
    showError("Error al Actualizar", errorMessage || "No se pudo actualizar el aprendiz.");
  };

  const showDeleteSuccess = () => {
    showSuccess("¡Aprendiz Eliminado!", "El aprendiz ha sido eliminado exitosamente.");
  };

  const showDeleteError = (errorMessage?: string) => {
    showError("Error al Eliminar", errorMessage || "No se pudo eliminar el aprendiz.");
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      console.log("Datos para crear aprendiz:", data);
      console.log(new Date(data.entryDate));
      
      await createApprentice({
        fullName: data.fullName,
        age: parseInt(data.age),
        entryDate: new Date(data.entryDate),
        status: data.status,
        trainingLevel: data.trainingLevel,
        agency: data.agencyId
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchApprentices();

    } catch (err: any) {
      console.error("Error al crear aprendiz:", err);
      showCreateError(err.message);
    }
  };

  // Manejar actualización
  const handleUpdate = async (id: string | number, data: Record<string, any>) => {
    try {
      await updateApprentice(id as string, {
        fullName: data.fullName,
        age: parseInt(data.age),
        entryDate: new Date(data.entryDate),
        status: data.status,
        trainingLevel: data.trainingLevel,
        agency: data.agencyId
      });

      showUpdateSuccess();
      setEditingApprentice(null);
      await fetchApprentices();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingApprentice) return;

    try {
      await deleteApprentice(id as string);
      showDeleteSuccess();
      setDeletingApprentice(null);
      await fetchApprentices();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Funciones auxiliares
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("es-ES");
  };

  const getStatusText = (status: ApprenticeStatus) => {
    const statusMap = {
      [ApprenticeStatus.EN_ENTRENAMIENTO]: "En Entrenamiento",
      [ApprenticeStatus.PROCESO_DE_SELECCION]: "Proceso de selección",
      [ApprenticeStatus.TRANSFERIDO]: "Transferido",
    };
    return statusMap[status] || status;
  };

  const getTrainingLevelText = (level: ApprenticeTrainingLevel) => {
    const levelMap = {
      [ApprenticeTrainingLevel.PRINCIPIANTE]: "Principiante",
      [ApprenticeTrainingLevel.INTERMEDIO]: "Intermedio",
      [ApprenticeTrainingLevel.AVANZADO]: "Avanzado",
    };
    return levelMap[level] || level;
  };

  // Definir columnas para la tabla - USANDO NOTACIÓN DE PUNTO COMO EN CONTRATO
  const columns: Column<ApprenticeResponseDto>[] = [
    {
      key: "fullName",
      title: "Nombre",
      sortable: true,
      width: "25%",
      align: "center"
    },
    {
      key: "age",
      title: "Edad",
      sortable: true,
      width: "10%",
      align: "center",
      render: (item) => `${item.age} años`
    },
    {
      key: "entryDate",
      title: "Fecha Ingreso",
      sortable: true,
      width: "15%",
      render: (item) => formatDate(item.entryDate.toString()),
      align: "center"
    },
    {
      key: "status",
      title: "Estado",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => (
        <span className={`status-badge status-${item.status.toLowerCase()}`}>
          {getStatusText(item.status)}
        </span>
      )
    },
    {
      key: "trainingLevel",
      title: "Nivel",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => (
        <span className={`trainingLevel-badge trainingLevel-${item.trainingLevel.toLowerCase()}`}>
          {getTrainingLevelText(item.trainingLevel)}
        </span>
      )
    },
    {
      key: "agency.nameAgency", // Usando notación de punto como en contrato
      title: "Agencia",
      sortable: true, // Ahora es ordenable
      width: "20%",
      align: "center",
      render: (item) => {
        if (item.agency && typeof item.agency === 'object') {
          return `${item.agency}`;
        }
        return getAgencyName(item);
      }
    }
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderApprenticeDetails = (apprentice: ApprenticeResponseDto) => (
    <div className="apprentice-details">
      <div className="detail-item">
        <strong>Nombre:</strong> <span>{apprentice.fullName}</span>
      </div>
      <div className="detail-item">
        <strong>Edad:</strong> <span>{apprentice.age} años</span>
      </div>
      <div className="detail-item">
        <strong>Fecha ingreso:</strong> <span>{formatDate(apprentice.entryDate.toString())}</span>
      </div>
      <div className="detail-item">
        <strong>Estado:</strong> <span>{getStatusText(apprentice.status)}</span>
      </div>
      <div className="detail-item">
        <strong>Nivel:</strong> <span>{getTrainingLevelText(apprentice.trainingLevel)}</span>
      </div>
      <div className="detail-item">
        <strong>Agencia:</strong> <span>{getAgencyName(apprentice)}</span>
      </div>
    </div>
  );

  return (
    <section id="apprentice_manager" className="content-section active">
      <GenericTable<ApprenticeResponseDto>
        title="Gestión de Aprendices"
        description="Administre todos los aprendices del sistema"
        data={apprentices}
        columns={columns}
        loading={loading}
        onReload={() => fetchApprentices()}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingApprentice}
        onEditingChange={setEditingApprentice}
        deletingItem={deletingApprentice}
        onDeletingChange={setDeletingApprentice}
        itemsPerPage={20}
        className="apprentice-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Aprendiz"
          fields={apprenticeFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Aprendiz"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingApprentice && (
        <EditModal
          title="Editar Aprendiz"
          fields={apprenticeFields}
          initialData={{
            fullName: editingApprentice.fullName,
            age: editingApprentice.age.toString(),
            entryDate: editingApprentice.entryDate.toString().split("T")[0],
            status: editingApprentice.status,
            trainingLevel: editingApprentice.trainingLevel,
            agencyId: editingApprentice.agency || ""
          }}
          itemId={editingApprentice.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingApprentice(null)}
          loading={loading}
          submitText="Actualizar Aprendiz"
          
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingApprentice && (
        <DeleteModal<ApprenticeResponseDto>
          title="¿Eliminar Aprendiz?"
          item={deletingApprentice}
          itemName="Aprendiz"
          itemId={deletingApprentice.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingApprentice(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderApprenticeDetails}
        />
      )}
    </section>
  );
};

export default ApprenticeManagement;