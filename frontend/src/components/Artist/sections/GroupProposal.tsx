import React, { useState, useEffect } from "react";
import { useGroup } from "../../../context/GroupContext";
import { useAgency } from "../../../context/AgencyContext";
import { useAuth } from "../../../context/AuthContext";
import GenericTable, { Column } from "../../ui/datatable";
import CreateModal, { FormField } from "../../ui/reusable/CreateModal";
import "../../Manager/sections/Group.css";
import { GroupResponseDto } from "../../../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto";

export enum GroupStatus {
  ACTIVO = "ACTIVO",
  EN_PAUSA = "EN_PAUSA",
  DISUELTO = "DISUELTO",
}

const GroupProposal: React.FC = () => {
  const {
    notCreatedGroups, // Usar notCreatedGroups en lugar de groups
    fetchNotCreatedGroups, // Usar esta función específica
    createGroup,
    loading: groupLoading,
    error: groupError,
  } = useGroup();

  const { agencies, fetchAgencies } = useAgency();
  const { user } = useAuth();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchNotCreatedGroups(), // Cambiado a fetchNotCreatedGroups
          fetchAgencies(),
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

  // Definir campos del formulario de grupo (sin is_created)
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
  ];

  // Datos iniciales para creación (sin is_created, siempre será false)
  const initialCreateData = {
    name: "",
    concept: "",
    status: GroupStatus.ACTIVO,
    debut_date: "",
  };

  // Manejar creación de grupo (siempre is_created = false)
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
        is_created: false, // Siempre false
        agencyId: userAgency.id,
      });

      showSuccess("¡Grupo Creado!", "El grupo ha sido creado exitosamente.");
      setShowCreateModal(false);
      await fetchNotCreatedGroups(); // Cambiado a fetchNotCreatedGroups
    } catch (err: any) {
      showError("Error al Crear", err.message || "No se pudo crear el grupo.");
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
      [GroupStatus.EN_PAUSA]: "en-pausa",
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

  // Definir columnas para la tabla (sin acciones de miembros ni editar/eliminar)
  const columns: Column<GroupResponseDto>[] = [
    {
      key: "name",
      title: "Nombre del Grupo",
      sortable: true,
      width: "20%",
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
      width: "15%",
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
      width: "15%",
      align: "center",
      render: (item) => formatDate(item.debut_date),
    },
    {
      key: "years_active",
      title: "Años Activos",
      sortable: false,
      width: "15%",
      align: "center",
      render: (item) => calculateYearsSinceDebut(item.debut_date),
    },
    {
      key: "members_num",
      title: "N° Miembros",
      sortable: true,
      width: "15%",
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
      key: "agency",
      title: "Agencia",
      width: "20%",
      align: "center",
      render: (item) => getAgencyName(item),
    },
  ];

  // Función para renderizar acciones personalizadas - Vacía porque no hay acciones
  const renderCustomActions = (item: GroupResponseDto) => {
    return null; // Sin acciones
  };

  return (
    <section id="group_view" className="content-section active">
      {/* Mostrar información de la agencia del usuario */}
      {userAgency && (
        <div className="agency-info-banner">
          <p>
            <strong>Agencia Actual:</strong> {userAgency.nameAgency} -{" "}
            {userAgency.place}
            <br />
            <small>
              Todos los grupos creados se asociarán automáticamente a esta agencia.
            </small>
          </p>
        </div>
      )}

      <GenericTable<GroupResponseDto>
        title="Propuestas de Grupos"
        description="Lista de grupos propuestos (no creados aún)"
        data={notCreatedGroups} // Usar notCreatedGroups en lugar de groups
        columns={columns}
        loading={groupLoading}
        onReload={() => {
          fetchNotCreatedGroups(); // Cambiado a fetchNotCreatedGroups
          fetchAgencies();
        }}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        itemsPerPage={30}
        className="group-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
        showActionsColumn={false} // Sin columna de acciones
        showCreateButton={true} // Solo botón de crear
        showSearch={true}
        showReloadButton={true}
        renderCustomActions={renderCustomActions}
      />

      {/* Modal de creación de grupo */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nueva Propuesta de Grupo"
          fields={groupFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={groupLoading}
          submitText="Crear Propuesta"
        />
      )}
    </section>
  );
};

export default GroupProposal;