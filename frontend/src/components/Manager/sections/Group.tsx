import React, { useState, useEffect } from "react";
import { useGroup } from "../../../context/GroupContext";
import { useAgency } from "../../../context/AgencyContext";
import { useAuth } from "../../../context/AuthContext";
import { useApprentice } from "../../../context/ApprenticeContext";
import { useArtist } from "../../../context/ArtistContext";
import GenericTable, { Column } from "../../ui/datatable";
import CreateModal, { FormField } from "../../ui/reusable/CreateModal";
import EditModal from "../../ui/reusable/EditModal";
import DeleteModal from "../../ui/reusable/DeleteModal";
import ViewMembersModal from "./ViewMemberModal";
import AddMemberModal from "./AddMemberModal";
import "./Group.css";
import Icon from "../../icons/Icon";
import { GroupResponseDto } from "../../../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto";
import { ApprenticeResponseDto } from "../../../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto";

export enum GroupStatus {
  ACTIVO = "ACTIVO",
  EN_PAUSA = "EN_PAUSA",
  DISUELTO = "DISUELTO",
}

// Interfaz para trainee en el modal
interface TraineeForModal {
  id: string;
  name: string;
  lastName: string;
  fullName: string;
  artistId?: string;
}

const GroupManagement: React.FC = () => {
  const {
    groups,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    loading: groupLoading,
    error: groupError,
    addMemberToGroup,
    getGroupMembers,
    removeMemberFromGroup,
  } = useGroup();

  const { agencies, fetchAgencies } = useAgency();
  const { user } = useAuth();
  const {
    apprentices,
    fetchApprentices,
    loading: apprenticeLoading,
    error: apprenticeError,
  } = useApprentice();

  const {
    artists,
    createArtist,
    fetchArtists,
    loading: artistLoading,
    error: artistError,
  } = useArtist();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponseDto | null>(
    null
  );
  const [deletingGroup, setDeletingGroup] = useState<GroupResponseDto | null>(
    null
  );
  const [viewingGroup, setViewingGroup] = useState<GroupResponseDto | null>(
    null
  );
  const [addingMemberGroup, setAddingMemberGroup] =
    useState<GroupResponseDto | null>(null);

  // Estados para creación de artista
  const [showCreateArtistModal, setShowCreateArtistModal] = useState(false);
  const [selectedTraineeForArtist, setSelectedTraineeForArtist] = useState<{
    trainee: TraineeForModal;
    groupId: string;
    role: string;
    endDate?: Date;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchGroups(),
          fetchAgencies(),
          fetchApprentices(),
          fetchArtists(),
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
        showError("Error", "No se pudieron cargar los datos iniciales");
      }
    };
    loadData();
  }, []);

  // Obtener la agencia del usuario autenticado
  const getUserAgency = () => {
    if (!user?.agency) return null;
    const userAgency = agencies.find((a) => a.id === user.agency);
    return userAgency || null;
  };

  const userAgency = getUserAgency();

  // Obtener nombre de la agencia
  const getAgencyName = (group: GroupResponseDto) => {
    if (!group.agencyID) return "No asignada";
    const agency = agencies.find((a) => a.id === group.agencyID);
    return agency
      ? `${agency.nameAgency} - ${agency.place}`
      : "Agencia no encontrada";
  };

  // Funciones para mostrar notificaciones
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

  // Funciones para manejar miembros
  const handleViewMembers = async (group: GroupResponseDto) => {
    try {
      await getGroupMembers(group.id);
      setViewingGroup(group);
    } catch (err: any) {
      showError("Error", "No se pudieron cargar los miembros del grupo");
    }
  };

  const handleAddMember = (group: GroupResponseDto) => {
    setAddingMemberGroup(group);
  };

  // Definir campos del formulario de grupo
  const groupFields: FormField[] = [
    {
      name: "name",
      label: "Nombre del Grupo",
      type: "text",
      placeholder: "Ej: Blackpink, BTS, etc.",
      required: true,
      min: 2,
      max: 200,
      validate: (value) => {
        if (!value.trim()) return "El nombre del grupo es requerido";
        if (value.length < 2) return "Debe tener al menos 2 caracteres";
        if (value.length > 200) return "No puede exceder 200 caracteres";
        return null;
      },
    },
    {
      name: "concept",
      label: "Concepto del Grupo",
      type: "textarea",
      placeholder: "Describe el concepto artístico del grupo",
      required: true,
      min: 1,
      max: 500,
      validate: (value) => {
        if (!value.trim()) return "El concepto es requerido";
        if (value.length < 1) return "Debe tener al menos 1 carácter";
        if (value.length > 500) return "No puede exceder 500 caracteres";
        return null;
      },
    },
    {
      name: "status",
      label: "Estado",
      type: "autocomplete",
      required: true,
      options: [
        { value: GroupStatus.ACTIVO, label: "Activo" },
        { value: GroupStatus.DISUELTO, label: "Disuelto" },
        { value: GroupStatus.EN_PAUSA, label: "En pausa" },
      ],
    },
    {
      name: "debut_date",
      label: "Fecha de Debut",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de debut es requerida";
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      },
    },
    {
      name: "is_created",
      label: "¿Grupo Creado?",
      type: "radio",
      required: true,
      options: [
        { value: "true", label: "Sí" },
        { value: "false", label: "No" },
      ],
      validate: (value) => {
        if (value === undefined || value === null)
          return "Debe seleccionar una opción";
        return null;
      },
    },
  ];

  const groupEditFields = [...groupFields];

  // Datos iniciales para creación
  const initialCreateData = {
    name: "",
    concept: "",
    status: GroupStatus.ACTIVO,
    debut_date: "",
    is_created: "false",
  };

  // Manejar creación de grupo
  const handleCreate = async (data: Record<string, any>) => {
    try {
      if (!userAgency) {
        showError(
          "Error",
          "El usuario no tiene una agencia asignada. No puede crear grupos."
        );
        return;
      }

      await createGroup({
        name: data.name.trim(),
        concept: data.concept.trim(),
        status: data.status,
        debut_date: new Date(data.debut_date),
        is_created: data.is_created === "true",
        agencyId: userAgency.id,
      });

      showSuccess("¡Grupo Creado!", "El grupo ha sido creado exitosamente.");
      setShowCreateModal(false);
      await fetchGroups();
    } catch (err: any) {
      showError("Error al Crear", err.message || "No se pudo crear el grupo.");
    }
  };

  // Manejar actualización de grupo
  const handleUpdate = async (
    id: string | number,
    data: Record<string, any>
  ) => {
    try {
      if (!userAgency) {
        showError(
          "Error",
          "El usuario no tiene una agencia asignada. No puede actualizar grupos."
        );
        return;
      }

      await updateGroup(id as string, {
        name: data.name.trim(),
        concept: data.concept.trim(),
        status: data.status,
        debut_date: new Date(data.debut_date),
        is_created: data.is_created === "true",
        agencyId: userAgency.id,
      });

      showSuccess(
        "¡Grupo Actualizado!",
        "El grupo ha sido actualizado exitosamente."
      );
      setEditingGroup(null);
      await fetchGroups();
    } catch (err: any) {
      showError(
        "Error al Actualizar",
        err.message || "No se pudo actualizar el grupo."
      );
    }
  };

  // Manejar eliminación de grupo
  const handleDelete = async (id: string | number) => {
    if (!deletingGroup) return;

    try {
      await deleteGroup(id as string);
      showSuccess(
        "¡Grupo Eliminado!",
        "El grupo ha sido eliminado exitosamente."
      );
      setDeletingGroup(null);
      await fetchGroups();
    } catch (err: any) {
      showError(
        "Error al Eliminar",
        err.message || "No se pudo eliminar el grupo."
      );
    }
  };

  // Funciones auxiliares
  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("es-ES");
  };

  const getStatusText = (status: GroupStatus) => {
    const statusMap = {
      [GroupStatus.ACTIVO]: "Activo",
      [GroupStatus.DISUELTO]: "Disuelto",
      [GroupStatus.EN_PAUSA]: "En pausa",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: GroupStatus) => {
    const statusClassMap = {
      [GroupStatus.ACTIVO]: "active",
      [GroupStatus.DISUELTO]: "dissolved",
      [GroupStatus.EN_PAUSA]: "En pausa",
    };
    return statusClassMap[status] || "";
  };

  // Calcular años desde debut
  const calculateYearsSinceDebut = (debutDate: Date | string) => {
    if (!debutDate) return "N/A";
    const debut =
      typeof debutDate === "string" ? new Date(debutDate) : debutDate;
    const today = new Date();
    let years = today.getFullYear() - debut.getFullYear();
    const monthDiff = today.getMonth() - debut.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < debut.getDate())
    ) {
      years--;
    }
    return years > 0 ? `${years} años` : "Menos de 1 año";
  };

  // Convertir aprendices al formato que espera AddMemberModal
  const mapTraineesForModal = (): TraineeForModal[] => {
    return apprentices.map((apprentice: ApprenticeResponseDto) => {
      // Encontrar si este aprendiz ya tiene un artista
      const artist = artists.find((a) => a.apprenticeId === apprentice.id);

      return {
        id: apprentice.id,
        name: apprentice.fullName.split(" ")[0] || apprentice.fullName,
        lastName:
          apprentice.fullName.split(" ").slice(1).join(" ") ||
          apprentice.fullName,
        fullName: apprentice.fullName,
        artistId: artist?.id,
      };
    });
  };

  // Manejar adición de miembro con lógica de creación de artista
  const handleAddMemberToGroup = async (
    traineeId: string,
    role: string,
    endDate?: Date
  ) => {
    if (!addingMemberGroup) return;

    try {
      // Buscar el aprendiz
      const trainee = apprentices.find((t) => t.id === traineeId);
      if (!trainee) {
        showError("Error", "No se encontró el aprendiz seleccionado");
        return;
      }

      // Buscar si el aprendiz ya tiene un artista
      const existingArtist = artists.find((a) => a.apprenticeId === traineeId);

      if (existingArtist) {
        // Si ya tiene artista, agregar al grupo
        await addMemberToGroup(addingMemberGroup.id, {
          artistId: existingArtist.id,
          role,
          endDate,
        });
        showSuccess(
          "Miembro agregado",
          "El miembro ha sido agregado al grupo exitosamente."
        );
        setAddingMemberGroup(null);
        await fetchGroups(); // Refrescar datos
      } else {
        // Si no tiene artista, guardar datos y mostrar modal para crear artista
        setSelectedTraineeForArtist({
          trainee: {
            id: trainee.id,
            name: trainee.fullName.split(" ")[0] || trainee.fullName,
            lastName:
              trainee.fullName.split(" ").slice(1).join(" ") ||
              trainee.fullName,
            fullName: trainee.fullName,
          },
          groupId: addingMemberGroup.id,
          role,
          endDate,
        });
        setAddingMemberGroup(null);
        setShowCreateArtistModal(true);
      }
    } catch (err: any) {
      showError(
        "Error",
        err.message || "No se pudo agregar el miembro al grupo."
      );
    }
  };

  const handleCreateArtistAndAddToGroup = async (
    artistData: Record<string, any>
  ) => {
    if (!selectedTraineeForArtist) return;

    try {
      const newArtist = await createArtist({
        stageName: artistData.stageName.trim(),
        birthday: new Date(artistData.birthday),
        transitionDate: new Date(artistData.transitionDate),
        status: artistData.status,
        apprenticeId: selectedTraineeForArtist.trainee.id,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchArtists();

      // Agregar el artista al grupo
      await addMemberToGroup(selectedTraineeForArtist.groupId, {
        artistId: selectedTraineeForArtist.trainee.id,
        role: selectedTraineeForArtist.role,
        endDate: selectedTraineeForArtist.endDate,
      });

      showSuccess(
        "Artista creado y agregado",
        "El artista ha sido creado y agregado al grupo exitosamente."
      );
      setShowCreateArtistModal(false);
      setSelectedTraineeForArtist(null);
      await Promise.all([fetchGroups(), fetchArtists()]); // Refrescar datos
    } catch (err: any) {
      showError(
        "Error",
        err.message || "No se pudo crear el artista y agregarlo al grupo."
      );
    }
  };

  const artistFields: FormField[] = [
    {
      name: "stageName",
      label: "Nombre artístico",
      type: "text",
      required: true,
      placeholder: "Ej: Bad Bunny",
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
        { value: "ACTIVO", label: "Activo" },
        { value: "EN_PAUSA", label: "En Pausa" },
        { value: "INACTIVO", label: "Inactivo" },
      ],
    },
  ];

  const getInitialArtistData = () => {
    if (!selectedTraineeForArtist) return {};

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    return {
      stageName: selectedTraineeForArtist.trainee.fullName,
      birthday: "",
      transitionDate: todayStr, // Fecha actual como valor por defecto
      status: "ACTIVO", // Estado por defecto
      groupId: "",
    };
  };

  // Definir columnas para la tabla
  const columns: Column<GroupResponseDto>[] = [
    {
      key: "name",
      title: "Nombre del Grupo",
      sortable: true,
      width: "18%",
      align: "center",
      render: (item) => (
        <div className="group-name-cell">
          <strong>{item.name}</strong>
          <div className="group-concept">
            {item.concept.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Estado",
      sortable: true,
      width: "14%",
      align: "center",
      render: (item) => (
        <span className={`status-badge status-${getStatusClass(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
    {
      key: "debut_date",
      title: "Fecha de Debut",
      sortable: true,
      width: "13%",
      align: "center",
      render: (item) => formatDate(item.debut_date),
    },
    {
      key: "years_active",
      title: "Años Activos",
      sortable: false,
      width: "13%",
      align: "center",
      render: (item) => calculateYearsSinceDebut(item.debut_date),
    },
    {
      key: "members_num",
      title: "N° Miembros",
      sortable: true,
      width: "13%",
      align: "center",
      render: (item) => (
        <span
          className={`members-count ${
            item.members_num > 0 ? "has-members" : "no-members"
          }`}
        >
          {item.members_num}
        </span>
      ),
    },
    {
      key: "is_created",
      title: "Creado",
      sortable: true,
      width: "8%",
      align: "center",
      render: (item) => (
        <span
          className={`created-badge ${
            item.is_created ? "created" : "not-created"
          }`}
        >
          {item.is_created ? "Sí" : "No"}
        </span>
      ),
    },
    {
      key: "agency",
      title: "Agencia",
      width: "20%",
      align: "center",
      render: (item) => getAgencyName(item),
    },
    {
      key: "members",
      title: "Miembros",
      sortable: false,
      width: "16%",
      align: "center",
      render: (item) => (
        <div className="members-actions">
          <button
            className="action-btnn view-members-btn"
            onClick={() => handleViewMembers(item)}
            title="Ver miembros"
            disabled={groupLoading}
            style={{ marginRight: "8px" }}
          >
            <Icon name="user" size={16} />
          </button>
          <button
            className="action-btnn add-member-btn"
            onClick={() => handleAddMember(item)}
            title="Añadir miembro"
            disabled={groupLoading}
          >
            <Icon name="user" size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Función para renderizar acciones personalizadas
  const renderCustomActions = (item: GroupResponseDto) => {
    return (
      <div className="group-actions">
        <button
          className="action-btn edit-btn-comp"
          onClick={() => setEditingGroup(item)}
          title="Editar grupo"
          disabled={groupLoading}
        >
          <Icon name="edit" size={18} />
        </button>
        <button
          className="action-btn delete-btn-comp"
          onClick={() => setDeletingGroup(item)}
          title="Eliminar grupo"
          disabled={groupLoading}
        >
          <Icon name="trash" size={18} />
        </button>
      </div>
    );
  };

  // Función para renderizar detalles en modal de eliminación
  const renderGroupDetails = (group: GroupResponseDto) => {
    return (
      <div className="group-details">
        <div className="detail-item">
          <strong>Nombre del Grupo:</strong> <span>{group.name}</span>
        </div>
        <div className="detail-item">
          <strong>Concepto:</strong> <span>{group.concept}</span>
        </div>
        <div className="detail-item">
          <strong>Estado:</strong> <span>{getStatusText(group.status)}</span>
        </div>
        <div className="detail-item">
          <strong>Fecha de Debut:</strong>{" "}
          <span>{formatDate(group.debut_date)}</span>
        </div>
        <div className="detail-item">
          <strong>Años Activos:</strong>{" "}
          <span>{calculateYearsSinceDebut(group.debut_date)}</span>
        </div>
        <div className="detail-item">
          <strong>Número de Miembros:</strong> <span>{group.members_num}</span>
        </div>
        <div className="detail-item">
          <strong>Grupo Creado:</strong>{" "}
          <span>{group.is_created ? "Sí" : "No"}</span>
        </div>
        <div className="detail-item">
          <strong>Agencia:</strong> <span>{getAgencyName(group)}</span>
        </div>
      </div>
    );
  };

  return (
    <section id="group_management" className="content-section active">
      {/* Mostrar información de la agencia del usuario */}
      {userAgency && (
        <div className="agency-info-banner">
          <p>
            <strong>Agencia Actual:</strong> {userAgency.nameAgency} -{" "}
            {userAgency.place}
            <br />
            <small>
              Todos los grupos creados o editados se asociarán automáticamente a
              esta agencia.
            </small>
          </p>
        </div>
      )}

      <GenericTable<GroupResponseDto>
        title="Gestión de Grupos"
        description="Administre todos los grupos del sistema"
        data={groups}
        columns={columns}
        loading={groupLoading}
        onReload={() => {
          fetchGroups();
          fetchAgencies();
          fetchApprentices();
          fetchArtists();
        }}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingGroup}
        onEditingChange={setEditingGroup}
        deletingItem={deletingGroup}
        onDeletingChange={setDeletingGroup}
        itemsPerPage={30}
        className="group-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
        showActionsColumn={true}
        showCreateButton={true}
        showSearch={true}
        showReloadButton={true}
        renderCustomActions={renderCustomActions}
      />

      {/* Modal de creación de grupo */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Grupo"
          fields={groupFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={groupLoading}
          submitText="Crear Grupo"
        />
      )}

      {/* Modal de edición de grupo */}
      {editingGroup && (
        <EditModal
          title="Editar Grupo"
          fields={groupEditFields}
          initialData={{
            name: editingGroup.name,
            concept: editingGroup.concept,
            status: editingGroup.status,
            debut_date: editingGroup.debut_date
              ? new Date(editingGroup.debut_date).toISOString().split("T")[0]
              : "",
            is_created: editingGroup.is_created ? "true" : "false",
          }}
          itemId={editingGroup.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingGroup(null)}
          loading={groupLoading}
          submitText="Actualizar Grupo"
        />
      )}

      {/* Modal de eliminación de grupo */}
      {deletingGroup && (
        <DeleteModal<GroupResponseDto>
          title="¿Eliminar Grupo?"
          item={deletingGroup}
          itemName="Grupo"
          itemId={deletingGroup.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingGroup(null)}
          loading={groupLoading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al grupo y sus relaciones."
          renderDetails={renderGroupDetails}
        />
      )}

      {/* Modal para ver miembros del grupo */}
      {viewingGroup && (
        <ViewMembersModal
          group={viewingGroup}
          onClose={() => setViewingGroup(null)}
          onRemoveMember={async (artistId) => {
            try {
              await removeMemberFromGroup(viewingGroup.id, artistId);
              showSuccess(
                "Miembro removido",
                "El miembro ha sido removido del grupo exitosamente."
              );
              setViewingGroup(null);
            } catch (err: any) {
              showError(
                "Error",
                err.message || "No se pudo remover el miembro del grupo."
              );
            }
          }}
        />
      )}

      {/* Modal para añadir miembro al grupo */}
      {addingMemberGroup && (
        <AddMemberModal
          group={addingMemberGroup}
          trainees={mapTraineesForModal()}
          onClose={() => setAddingMemberGroup(null)}
          onAddMember={handleAddMemberToGroup}
          //loading={apprenticeLoading || artistLoading}
        />
      )}

      {/* Modal para crear artista cuando el aprendiz no tiene uno */}
      {showCreateArtistModal && selectedTraineeForArtist && (
        <CreateModal
          title={`Crear Artista para ${selectedTraineeForArtist.trainee.fullName}`}
          fields={artistFields}
          initialData={getInitialArtistData()}
          onSubmit={handleCreateArtistAndAddToGroup}
          onClose={() => {
            setShowCreateArtistModal(false);
            setSelectedTraineeForArtist(null);
          }}
          loading={artistLoading}
          submitText="Crear Artista y Agregar al Grupo"
        />
      )}
    </section>
  );
};

export default GroupManagement;
