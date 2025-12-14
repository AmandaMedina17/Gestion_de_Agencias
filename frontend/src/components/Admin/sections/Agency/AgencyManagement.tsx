import React, { useState, useEffect } from "react";
import { useAgency } from "../../../../context/AgencyContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reusable/CreateModal";
import EditModal from "../../../ui/reusable/EditModal";
import DeleteModal from "../../../ui/reusable/DeleteModal";
import "./AgencyStyle.css";
import { AgencyResponseDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";

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

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<AgencyResponseDto | null>(
    null
  );
  const [deletingAgency, setDeletingAgency] =
    useState<AgencyResponseDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAgencies();
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  // Definir campos del formulario de agencia
  const agencyFields: FormField[] = [
    {
      name: "nameAgency",
      label: "Nombre de la agencia",
      type: "text",
      placeholder: "Ej: Agencia Central",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (value.length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        return null;
      },
    },
    {
      name: "place",
      label: "Lugar",
      type: "text",
      placeholder: "Ej: Ciudad, País",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (value.length < 2)
          return "El lugar debe tener al menos 2 caracteres";
        return null;
      },
    },
    {
      name: "dateFundation",
      label: "Fecha de fundación",
      type: "date",
      required: true,
      validate: (value) => {
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      },
    },
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    nameAgency: "",
    place: "",
    dateFundation: "",
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
    showSuccess("¡Agencia Creada!", "La agencia ha sido creada exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear la agencia.");
  };

  const showUpdateSuccess = () => {
    showSuccess(
      "¡Agencia Actualizada!",
      "La agencia ha sido actualizada exitosamente."
    );
  };

  const showUpdateError = (errorMessage?: string) => {
    showError(
      "Error al Actualizar",
      errorMessage || "No se pudo actualizar la agencia."
    );
  };

  const showDeleteSuccess = () => {
    showSuccess(
      "¡Agencia Eliminada!",
      "La agencia ha sido eliminada exitosamente."
    );
  };

  const showDeleteError = (errorMessage?: string) => {
    showError(
      "Error al Eliminar",
      errorMessage || "No se pudo eliminar la agencia."
    );
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createAgency({
        nameAgency: data.nameAgency,
        placeId: data.place,
        dateFundation: new Date(data.dateFundation),
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchAgencies();
    } catch (err: any) {
      showCreateError(err.message);
    }
  };

  // Manejar actualización
  const handleUpdate = async (
    id: string | number,
    data: Record<string, any>
  ) => {
    try {
      await updateAgency(id as string, {
        nameAgency: data.nameAgency,
        placeId: data.place,
        dateFundation: new Date(data.dateFundation),
      });

      showUpdateSuccess();
      setEditingAgency(null);
      await fetchAgencies();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingAgency) return;

    try {
      await deleteAgency(id as string);
      showDeleteSuccess();
      setDeletingAgency(null);
      await fetchAgencies();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Funciones auxiliares
  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleDateString("es-ES");
  };

  const calculateAntiquity = (date: Date | string) => {
    if (!date) return 0;
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    const diffTime = today.getTime() - dateObj.getTime();
    return Math.floor(diffTime / (1000 * 3600 * 24 * 365.25));
  };

  // Definir columnas para la tabla
  const columns: Column<AgencyResponseDto>[] = [
    {
      key: "nameAgency",
      title: "Nombre",
      sortable: true,
      width: "25%",
      align: "center",
    },
    {
      key: "place",
      title: "Lugar",
      sortable: true,
      width: "25%",
      align: "center",
    },
    {
      key: "dateFundation",
      title: "Fecha Fundación",
      sortable: true,
      width: "20%",
      align: "center",
      render: (item) => formatDate(item.dateFundation),
    },
    {
      key: "antiquity",
      title: "Antigüedad",
      sortable: false,
      width: "15%",
      align: "center",
      render: (item) => `${calculateAntiquity(item.dateFundation)} años`,
    },
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderAgencyDetails = (agency: AgencyResponseDto) => (
    <div className="agency-details">
      <div className="detail-item">
        <strong>Nombre:</strong> <span>{agency.nameAgency}</span>
      </div>
      <div className="detail-item">
        <strong>Lugar:</strong> <span>{agency.place.name}</span>
      </div>
      <div className="detail-item">
        <strong>Fecha de fundación:</strong>{" "}
        <span>{formatDate(agency.dateFundation)}</span>
      </div>
      <div className="detail-item">
        <strong>Antigüedad:</strong>{" "}
        <span>{calculateAntiquity(agency.dateFundation)} años</span>
      </div>
    </div>
  );

  return (
    <section id="agency_manager" className="content-section active">
      <GenericTable<AgencyResponseDto>
        title="Gestión de Agencias"
        description="Administre todas las agencias del sistema"
        data={agencies}
        columns={columns}
        loading={loading}
        onReload={() => fetchAgencies()}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingAgency}
        onEditingChange={setEditingAgency}
        deletingItem={deletingAgency}
        onDeletingChange={setDeletingAgency}
        itemsPerPage={30}
        className="agency-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nueva Agencia"
          fields={agencyFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Agencia"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingAgency && (
        <EditModal
          title="Editar Agencia"
          fields={agencyFields}
          initialData={{
            nameAgency: editingAgency.nameAgency,
            place: editingAgency.place,
            dateFundation: editingAgency.dateFundation
              ? new Date(editingAgency.dateFundation)
                  .toISOString()
                  .split("T")[0]
              : "",
          }}
          itemId={editingAgency.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingAgency(null)}
          loading={loading}
          submitText="Actualizar Agencia"
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingAgency && (
        <DeleteModal<AgencyResponseDto>
          title="¿Eliminar Agencia?"
          item={deletingAgency}
          itemName="Agencia"
          itemId={deletingAgency.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingAgency(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderAgencyDetails}
        />
      )}
    </section>
  );
};

export default AgencyManagement;
