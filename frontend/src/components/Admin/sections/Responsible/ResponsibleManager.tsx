import React, { useState, useEffect } from "react";
import { useResponsible } from "../../../../context/ResponsibleContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reusable/CreateModal";
import EditModal from "../../../ui/reusable/EditModal";
import DeleteModal from "../../../ui/reusable/DeleteModal";
import "./ResponsibleStyle.css";

export interface ResponsibleResponseDto {
  id: string;
  name: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

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

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingResponsible, setEditingResponsible] =
    useState<ResponsibleResponseDto | null>(null);
  const [deletingResponsible, setDeletingResponsible] =
    useState<ResponsibleResponseDto | null>(null);

  // Cargar responsables al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchResponsibles();
      } catch (err) {
        console.error("Error loading responsibles:", err);
      }
    };

    loadData();
  }, []);

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
      "¡Responsable Creado!",
      "El responsable ha sido creado exitosamente."
    );
  };

  const showCreateError = (errorMessage?: string) => {
    showError(
      "Error al Crear",
      errorMessage || "No se pudo crear el responsable."
    );
  };

  const showUpdateSuccess = () => {
    showSuccess(
      "¡Responsable Actualizado!",
      "El responsable ha sido actualizado exitosamente."
    );
  };

  const showUpdateError = (errorMessage?: string) => {
    showError(
      "Error al Actualizar",
      errorMessage || "No se pudo actualizar el responsable."
    );
  };

  const showDeleteSuccess = () => {
    showSuccess(
      "¡Responsable Eliminado!",
      "El responsable ha sido eliminado exitosamente."
    );
  };

  const showDeleteError = (errorMessage?: string) => {
    showError(
      "Error al Eliminar",
      errorMessage || "No se pudo eliminar el responsable."
    );
  };

  // Definir campos del formulario para responsable
  const responsibleFields: FormField[] = [
    {
      name: "name",
      label: "Nombre del responsable",
      type: "text",
      placeholder: "Ej: Juan Pérez García, María Rodríguez López",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (!value.trim()) return "El nombre del responsable es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";
        if (value.length > 100) return "No puede exceder 100 caracteres";

        // Validar que el nombre tenga al menos un espacio (nombre y apellido)
        const words = value.trim().split(/\s+/);
        if (words.length < 2)
          return "Debe incluir al menos un nombre y un apellido";

        return null;
      },
    },
  ];

  const responsibleEditFields: FormField[] = [
    {
      name: "name",
      label: "Nombre del responsable",
      type: "text",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (!value.trim()) return "El nombre del responsable es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";

        const words = value.trim().split(/\s+/);
        if (words.length < 2)
          return "Debe incluir al menos un nombre y un apellido";

        return null;
      },
    },
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    name: "",
  };

  // Manejar creación de responsable
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createResponsible({
        name: data.name.trim(),
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchResponsibles();
    } catch (err: any) {
      showCreateError(err.message);
    }
  };

  // Manejar actualización de responsable
  const handleUpdate = async (
    id: string | number,
    data: Record<string, any>
  ) => {
    try {
      await updateResponsible(id as string, {
        name: data.name.trim(),
      });

      showUpdateSuccess();
      setEditingResponsible(null);
      await fetchResponsibles();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación de responsable
  const handleDelete = async (id: string | number) => {
    if (!deletingResponsible) return;

    try {
      await deleteResponsible(id as string);
      showDeleteSuccess();
      setDeletingResponsible(null);
      await fetchResponsibles();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Funciones auxiliares
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleDateString("es-ES");
  };

  const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleString("es-ES");
  };

  const getInitials = (name: string) => {
    const words = name.split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getDaysSinceCreation = (createdAt: Date | string | undefined) => {
    if (!createdAt) return "N/A";
    const created =
      typeof createdAt === "string" ? new Date(createdAt) : createdAt;
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} días`;
  };

  // Definir columnas para la tabla
  const columns: Column<ResponsibleResponseDto>[] = [
    {
      key: "name",
      title: "Nombre del Responsable",
      sortable: true,
      width: "70%",
      align: "center",
      render: (item) => (
        <div className="responsible-name-cell">
          <div className="responsible-name">{item.name}</div>
        </div>
      ),
    },
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderResponsibleDetails = (responsible: ResponsibleResponseDto) => {
    return (
      <div className="responsible-details">
        <div className="detail-item">
          <div className="detail-label">ID:</div>
          <div className="detail-value">{responsible.id}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Nombre Completo:</div>
          <div className="detail-value">{responsible.name}</div>
        </div>
      </div>
    );
  };

  return (
    <section id="responsible_management" className="content-section active">
      <GenericTable<ResponsibleResponseDto>
        title="Gestión de Responsables"
        description="Administre todos los responsables del sistema"
        data={responsibles}
        columns={columns}
        loading={loading}
        onReload={() => fetchResponsibles()}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingResponsible}
        onEditingChange={setEditingResponsible}
        deletingItem={deletingResponsible}
        onDeletingChange={setDeletingResponsible}
        itemsPerPage={30}
        className="responsible-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Responsable"
          fields={responsibleFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Responsable"
          cancelText="Cancelar"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingResponsible && (
        <EditModal
          title="Editar Responsable"
          fields={responsibleEditFields}
          initialData={{
            name: editingResponsible.name,
          }}
          itemId={editingResponsible.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingResponsible(null)}
          loading={loading}
          submitText="Actualizar Responsable"
          cancelText="Cancelar"
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingResponsible && (
        <DeleteModal<ResponsibleResponseDto>
          title="¿Eliminar Responsable?"
          item={deletingResponsible}
          itemName="Responsable"
          itemId={deletingResponsible.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingResponsible(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer. Verifique que el responsable no esté asignado a ningún proyecto o tarea antes de proceder."
          renderDetails={renderResponsibleDetails}
        />
      )}
    </section>
  );
};

export default ResponsibleManagement;
