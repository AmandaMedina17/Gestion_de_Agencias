import React, { useState, useEffect } from "react";
import { usePlace } from "../../../../context/PlaceContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reusable/CreateModal";
import EditModal from "../../../ui/reusable/EditModal";
import DeleteModal from "../../../ui/reusable/DeleteModal";
import "./PlaceStyle.css";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";

export interface PlaceResponseDto {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

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

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PlaceResponseDto | null>(
    null
  );
  const [deletingPlace, setDeletingPlace] = useState<PlaceResponseDto | null>(
    null
  );

  // Cargar lugares al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchPlaces();
      } catch (err) {
        console.error("Error loading places:", err);
        setNotification({
          type: "error",
          title: "Error",
          message: "Error al cargar los lugares",
        });
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
    showSuccess("¡Lugar Creado!", "El lugar ha sido creado exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear el lugar.");
  };

  const showUpdateSuccess = () => {
    showSuccess(
      "¡Lugar Actualizado!",
      "El lugar ha sido actualizado exitosamente."
    );
  };

  const showUpdateError = (errorMessage?: string) => {
    showError(
      "Error al Actualizar",
      errorMessage || "No se pudo actualizar el lugar."
    );
  };

  const showDeleteSuccess = () => {
    showSuccess(
      "¡Lugar Eliminado!",
      "El lugar ha sido eliminado exitosamente."
    );
  };

  const showDeleteError = (errorMessage?: string) => {
    showError(
      "Error al Eliminar",
      errorMessage || "No se pudo eliminar el lugar."
    );
  };

  // Definir campos del formulario para lugar
  const placeFields: FormField[] = [
    {
      name: "name",
      label: "Nombre del lugar",
      type: "text",
      placeholder: "Ej: Auditorio Principal, Sala de Ensayos, etc.",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (value.length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        if (value.length > 100)
          return "El nombre no puede exceder 100 caracteres";
        return null;
      },
    },
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    name: "",
  };

  // Manejar creación de lugar
  const handleCreate = async (data: Record<string, any>) => {
    clearError();
    setNotification(null);

    try {
      await createPlace({ name: data.name.trim() });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchPlaces();
    } catch (err: any) {
      showCreateError(err.message);
    }
  };

  // Manejar actualización de lugar
  const handleUpdate = async (
    id: string | number,
    data: Record<string, any>
  ) => {
    clearError();
    setNotification(null);

    try {
      await updatePlace(id as string, { name: data.name.trim() });

      showUpdateSuccess();
      setEditingPlace(null);
      await fetchPlaces();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación de lugar
  const handleDelete = async (id: string | number) => {
    if (!deletingPlace) return;

    try {
      await deletePlace(id as string);

      showDeleteSuccess();
      setDeletingPlace(null);
      await fetchPlaces();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Definir columnas para la tabla
  const columns: Column<PlaceResponseDto>[] = [
    {
      key: "name",
      title: "Nombre del Lugar",
      sortable: true,
      width: "70%",
      align: "center",
    },
  ];

  // Función para formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      date.setDate(date.getDate() + 1);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Función para renderizar detalles en modal de eliminación
  const renderPlaceDetails = (place: PlaceResponseDto) => (
    <div className="place-details">
      <div className="detail-item">
        <strong>ID:</strong> <span>{place.id}</span>
      </div>
      <div className="detail-item">
        <strong>Nombre:</strong> <span>{place.name}</span>
      </div>
    </div>
  );

  return (
    <section id="place_management" className="content-section active">
      <GenericTable<PlaceResponseDto>
        title="Gestión de Lugares"
        description="Administre todos los lugares del sistema en una sola vista"
        data={places}
        columns={columns}
        loading={loading}
        onReload={() => fetchPlaces()}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingPlace}
        onEditingChange={setEditingPlace}
        deletingItem={deletingPlace}
        onDeletingChange={setDeletingPlace}
        itemsPerPage={20}
        className="place-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Lugar"
          fields={placeFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Lugar"
          cancelText="Cancelar"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingPlace && (
        <EditModal
          title="Editar Lugar"
          fields={placeFields}
          initialData={{
            name: editingPlace.name,
          }}
          itemId={editingPlace.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingPlace(null)}
          loading={loading}
          submitText="Actualizar Lugar"
          cancelText="Cancelar"
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingPlace && (
        <DeleteModal<PlaceResponseDto>
          title="¿Eliminar Lugar?"
          item={deletingPlace}
          itemName="Lugar"
          itemId={deletingPlace.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingPlace(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderPlaceDetails}
        />
      )}
    </section>
  );
};

export default PlaceManagement;
