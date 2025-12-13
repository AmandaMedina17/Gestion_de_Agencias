import React, { useState, useEffect } from "react";
import { useArtist } from "../../../../context/ArtistContext";
import { useApprentice } from "../../../../context/ApprenticeContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reusable/CreateModal";
import EditModal from "../../../ui/reusable/EditModal";
import DeleteModal from "../../../ui/reusable/DeleteModal";
import "./ArtistStyle.css";
import { ArtistResponseDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto";

export enum ArtistStatus {
  ACTIVO = "ACTIVO",
  EN_PAUSA = "EN_PAUSA",
  INACTIVO = "INACTIVO",
}

const ArtistManagement: React.FC = () => {
  const {
    artists,
    fetchArtists,
    createArtist,
    updateArtist,
    deleteArtist,
    loading,
    error,
    clearError,
  } = useArtist();

  const { apprentices, fetchApprentices } = useApprentice();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState<ArtistResponseDto | null>(
    null
  );
  const [deletingArtist, setDeletingArtist] =
    useState<ArtistResponseDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchArtists(), fetchApprentices()]);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  // Obtener nombre del aprendiz
  const getApprenticeName = (artist: ArtistResponseDto) => {
    if (artist.apprenticeId && typeof artist.apprenticeId === "object") {
      return artist.stageName;
    }
    const apprentice = apprentices.find((a) => a.id === artist.apprenticeId);
    return apprentice ? apprentice.fullName : "No asignado";
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
    showSuccess("¡Artista Creado!", "El artista ha sido creado exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear el artista.");
  };

  const showUpdateSuccess = () => {
    showSuccess(
      "¡Artista Actualizado!",
      "El artista ha sido actualizado exitosamente."
    );
  };

  const showUpdateError = (errorMessage?: string) => {
    showError(
      "Error al Actualizar",
      errorMessage || "No se pudo actualizar el artista."
    );
  };

  const showDeleteSuccess = () => {
    showSuccess(
      "¡Artista Eliminado!",
      "El artista ha sido eliminado exitosamente."
    );
  };

  const showDeleteError = (errorMessage?: string) => {
    showError(
      "Error al Eliminar",
      errorMessage || "No se pudo eliminar el artista."
    );
  };

  // Definir campos del formulario de artista
  const artistFields: FormField[] = [
    {
      name: "stageName",
      label: "Nombre artístico",
      type: "text",
      placeholder: "Ej: Bad Bunny",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (!value.trim()) return "El nombre artístico es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";
        if (value.length > 100) return "No puede exceder 100 caracteres";
        return null;
      },
    },
    {
      name: "birthday",
      label: "Fecha de nacimiento",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de nacimiento es requerida";
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      },
    },
    {
      name: "transitionDate",
      label: "Fecha de transición",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de transición es requerida";
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      },
    },
    {
      name: "status",
      label: "Estado",
      type: "autocomplete",
      required: true,
      options: [
        { value: ArtistStatus.ACTIVO, label: "Activo" },
        { value: ArtistStatus.EN_PAUSA, label: "En Pausa" },
        { value: ArtistStatus.INACTIVO, label: "Inactivo" },
      ],
    },
    {
      name: "groupId",
      label: "ID de Grupo (opcional)",
      type: "text",
      placeholder: "Ej: GRP-001",
      required: false,
      validate: (value) => {
        if (value && value.length > 50) return "No puede exceder 50 caracteres";
        return null;
      },
    },
    {
      name: "apprenticeId",
      label: "Aprendiz Asociado",
      type: "autocomplete",
      required: true,
      options: apprentices.map((apprentice) => ({
        value: apprentice.id,
        label: `${apprentice.fullName}`,
      })),
    },
  ];

  const artistEditFields: FormField[] = [
    {
      name: "stageName",
      label: "Nombre artístico",
      type: "text",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (!value.trim()) return "El nombre artístico es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";
        return null;
      },
    },
    {
      name: "birthday",
      label: "Fecha de nacimiento",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de nacimiento es requerida";
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      },
    },
    {
      name: "transitionDate",
      label: "Fecha de transición",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de transición es requerida";
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      },
    },
    {
      name: "status",
      label: "Estado",
      type: "autocomplete",
      required: true,
      options: [
        { value: ArtistStatus.ACTIVO, label: "Activo" },
        { value: ArtistStatus.EN_PAUSA, label: "En Pausa" },
        { value: ArtistStatus.INACTIVO, label: "Inactivo" },
      ],
    },
    {
      name: "groupId",
      label: "ID de Grupo (opcional)",
      type: "text",
      required: false,
    },
    {
    name: "apprenticeId",
    label: "Aprendiz Asociado",
    type: "autocomplete",
    required: true,
    options: apprentices.map((apprentice) => ({
      value: apprentice.id,
      label: `${apprentice.fullName}`,
    })),
  },
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    stageName: "",
    birthday: "",
    transitionDate: "",
    status: ArtistStatus.ACTIVO,
    groupId: "",
    apprenticeId: "",
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createArtist({
        stageName: data.stageName.trim(),
        birthday: new Date(data.birthday),
        transitionDate: new Date(data.transitionDate),
        status: data.status,
        apprenticeId: data.apprenticeId,
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchArtists();
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
      await updateArtist(id as string, {
        stageName: data.stageName.trim(),
        birthday: new Date(data.birthday),
        transitionDate: new Date(data.transitionDate),
        status: data.status,
        groupId: data.goupId? data.groupId.trim() : undefined,
        apprenticeId: data.apprenticeId,
      });

      showUpdateSuccess();
      setEditingArtist(null);
      await fetchArtists();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingArtist) return;

    try {
      await deleteArtist(id as string);
      showDeleteSuccess();
      setDeletingArtist(null);
      await fetchArtists();
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

  const getStatusText = (status: ArtistStatus) => {
    const statusMap = {
      [ArtistStatus.ACTIVO]: "Activo",
      [ArtistStatus.EN_PAUSA]: "En Pausa",
      [ArtistStatus.INACTIVO]: "Inactivo",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: ArtistStatus) => {
    const statusClassMap = {
      [ArtistStatus.ACTIVO]: "active",
      [ArtistStatus.EN_PAUSA]: "paused",
      [ArtistStatus.INACTIVO]: "inactive",
    };
    return statusClassMap[status] || "";
  };

  // Calcular edad
  const calculateAge = (birthday: Date | string) => {
    if (!birthday) return "N/A";
    const birthDate =
      typeof birthday === "string" ? new Date(birthday) : birthday;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Definir columnas para la tabla
  const columns: Column<ArtistResponseDto>[] = [
    {
      key: "stageName",
      title: "Nombre Artístico",
      sortable: true,
      width: "18%",
      align: "center",
    },
    {
      key: "birthday",
      title: "Fecha Nacimiento",
      sortable: true,
      width: "14%",
      align: "center",
      render: (item) => formatDate(item.birthday),
    },
    {
      key: "age",
      title: "Edad",
      sortable: false,
      width: "8%",
      align: "center",
      render: (item) => calculateAge(item.birthday),
    },
    {
      key: "transitionDate",
      title: "Fecha Transición",
      sortable: true,
      width: "14%",
      align: "center",
      render: (item) => formatDate(item.transitionDate),
    },
    {
      key: "status",
      title: "Estado",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => (
        <span className={`status-artist-badge status-artist-${getStatusClass(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },

    {
      key: "apprentice.fullName",
      title: "Aprendiz Asociado",
      width: "24%",
      align: "center",
      render: (item) => getApprenticeName(item),
    },
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderArtistDetails = (artist: ArtistResponseDto) => {
    return (
      <div className="artist-details">
        <div className="detail-item">
          <strong>Nombre Artístico:</strong> <span>{artist.stageName}</span>
        </div>
        <div className="detail-item">
          <strong>Fecha Nacimiento:</strong>{" "}
          <span>{formatDate(artist.birthday)}</span>
        </div>
        <div className="detail-item">
          <strong>Edad:</strong>{" "}
          <span>{calculateAge(artist.birthday)} años</span>
        </div>
        <div className="detail-item">
          <strong>Fecha Transición:</strong>{" "}
          <span>{formatDate(artist.transitionDate)}</span>
        </div>
        <div className="detail-item">
          <strong>Estado:</strong> <span>{getStatusText(artist.status)}</span>
        </div>

        <div className="detail-item">
          <strong>Aprendiz Asociado:</strong>{" "}
          <span>{getApprenticeName(artist)}</span>
        </div>
      </div>
    );
  };

  return (
    <section id="artist_management" className="content-section active">
      <GenericTable<ArtistResponseDto>
        title="Gestión de Artistas"
        description="Administre todos los artistas del sistema"
        data={artists}
        columns={columns}
        loading={loading}
        onReload={() => {
          fetchArtists();
          fetchApprentices();
        }}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingArtist}
        onEditingChange={setEditingArtist}
        deletingItem={deletingArtist}
        onDeletingChange={setDeletingArtist}
        itemsPerPage={30}
        className="artist-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Artista"
          fields={artistFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Artista"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingArtist && (
        <EditModal
          title="Editar Artista"
          fields={artistEditFields}
          initialData={{
            stageName: editingArtist.stageName,
            birthday: editingArtist.birthday
              ? new Date(editingArtist.birthday).toISOString().split("T")[0]
              : "",
            transitionDate: editingArtist.transitionDate
              ? new Date(editingArtist.transitionDate)
                  .toISOString()
                  .split("T")[0]
              : "",
            status: editingArtist.status,
             apprenticeId: editingArtist.apprenticeId,
          }}
          itemId={editingArtist.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingArtist(null)}
          loading={loading}
          submitText="Actualizar Artista"
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingArtist && (
        <DeleteModal<ArtistResponseDto>
          title="¿Eliminar Artista?"
          item={deletingArtist}
          itemName="Artista"
          itemId={deletingArtist.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingArtist(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al artista."
          renderDetails={renderArtistDetails}
        />
      )}
    </section>
  );
};

export default ArtistManagement;
