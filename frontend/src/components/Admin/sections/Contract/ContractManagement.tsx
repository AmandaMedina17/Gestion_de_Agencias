import React, { useState, useEffect } from "react";
import { useContract } from "../../../../context/ContractContext";
import { useAgency } from "../../../../context/AgencyContext";
import { useArtist } from "../../../../context/ArtistContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reutilizables/CreateModal";
import EditModal from "../../../ui/reutilizables/EditModal";
import DeleteModal from "../../../ui/reutilizables/DeleteModal";
import './ContractStyle.css';
import { ContractResponseDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/contractDto/response-contract.dto";


export enum ContractStatus {
  ACTIVO = "ACTIVO",
  FINALIZADO = "FINALIZADO",
  EN_RENOVACION = "EN_RENOVACION",
  RESCINDIDO = "RESCINDIDO",
}




const ContractManagement: React.FC = () => {
  const {
    contracts,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    loading,
    error,
    clearError,
  } = useContract();

  // Obtener agencias y artistas del contexto
  const { agencies, fetchAgencies } = useAgency();
  const { artists, fetchArtists } = useArtist();

 

   const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);


  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractResponseDto | null>(null);
  const [deletingContract, setDeletingContract] = useState<ContractResponseDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchContracts(),
          fetchAgencies(),
          fetchArtists()
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  

   const getArtistName = (contract: ContractResponseDto) => {
    if (contract.artist && typeof contract.artist === 'object') {
      return contract.artist.stageName;
    }
    const artist = artists.find(a => a.apprenticeId === contract.artist.apprenticeId);
    return artist ? artist.stageName : "No asignado";
  };

  // FUNCIÓN PARA OBTENER NOMBRE DE LA AGENCIA
  const getAgencyName = (contract: ContractResponseDto) => {
    if (contract.agency && typeof contract.agency === 'object') {
      return contract.agency.nameAgency;
    }
    const agency = agencies.find(a => a.nameAgency === contract.agency.nameAgency);
    return agency ? agency.nameAgency : "No asignada";
  };

  // Definir campos del formulario de contrato
  const contractFields: FormField[] = [
    {
      name: "artistId",
      label: "Artista",
      type: "autocomplete",
      required: true,
      options: artists.map(artist => ({
        value: artist.id,
        label: artist.stageName
      }))
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
    },
    {
      name: "startDate",
      label: "Fecha de inicio",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de inicio es requerida";
        return null;
      }
    },
    {
      name: "endDate",
      label: "Fecha de fin",
      type: "date",
      required: true,
      validate: (value, formData) => {
        if (!value) return "La fecha de fin es requerida";
        if (formData && formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          return "La fecha de fin debe ser posterior a la fecha de inicio";
        }
        return null;
      }
    },
    {
      name: "distributionPercentage",
      label: "Porcentaje de distribución",
      type: "number",
      required: true,
      min: 0,
      max: 100,
      validate: (value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return "Debe ser un número válido";
        if (numValue < 0 || numValue > 100) return "Debe estar entre 0 y 100";
        return null;
      }
    },
    {
      name: "status",
      label: "Estado",
      type: "autocomplete",
      required: true,
      options: [
        { value: ContractStatus.ACTIVO, label: "Activo" },
        { value: ContractStatus.EN_RENOVACION, label: "En renovación" },
        { value: ContractStatus.RESCINDIDO, label: "Rescindido" },
        { value: ContractStatus.FINALIZADO, label: "Finalizado" }
      ]
    },
    {
      name: "conditions",
      label: "Condiciones",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder: "Describe las condiciones del contrato...",
      validate: (value) => {
        if (!value.trim()) return "Las condiciones son requeridas";
        return null;
      }
    }
  ];

  const contractEditFields: FormField[] = [
    {
      name: "startDate",
      label: "Fecha de inicio",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de inicio es requerida";
        return null;
      }
    },
    {
      name: "endDate",
      label: "Fecha de fin",
      type: "date",
      required: true,
      validate: (value, formData) => {
        if (!value) return "La fecha de fin es requerida";
        if (formData && formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          return "La fecha de fin debe ser posterior a la fecha de inicio";
        }
        return null;
      }
    },
    {
      name: "distributionPercentage",
      label: "Porcentaje de distribución",
      type: "number",
      required: true,
      min: 0,
      max: 100,
      validate: (value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return "Debe ser un número válido";
        if (numValue < 0 || numValue > 100) return "Debe estar entre 0 y 100";
        return null;
      }
    },
    {
      name: "status",
      label: "Estado",
      type: "autocomplete",
      required: true,
      options: [
        { value: ContractStatus.ACTIVO, label: "Activo" },
        { value: ContractStatus.EN_RENOVACION, label: "En renovación" },
        { value: ContractStatus.RESCINDIDO, label: "Rescindido" },
        { value: ContractStatus.FINALIZADO, label: "Finalizado" }
      ]
    },
    {
      name: "conditions",
      label: "Condiciones",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder: "Describe las condiciones del contrato...",
      validate: (value) => {
        if (!value.trim()) return "Las condiciones son requeridas";
        return null;
      }
    }
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    artistId: "",
    agencyId: "",
    startDate: "",
    endDate: "",
    distributionPercentage: "",
    status: ContractStatus.ACTIVO,
    conditions: ""
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
    showSuccess("¡Contrato Creado!", "El contrato ha sido creado exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear el contrato.");
  };

  const showUpdateSuccess = () => {
    showSuccess("¡Contrato Actualizado!", "El contrato ha sido actualizado exitosamente.");
  };

  const showUpdateError = (errorMessage?: string) => {
    showError("Error al Actualizar", errorMessage || "No se pudo actualizar el contrato.");
  };

  const showDeleteSuccess = () => {
    showSuccess("¡Contrato Eliminado!", "El contrato ha sido eliminado exitosamente.");
  };

  const showDeleteError = (errorMessage?: string) => {
    showError("Error al Eliminar", errorMessage || "No se pudo eliminar el contrato.");
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      console.log(data.agencyId);
      console.log(data.artistId);

      await createContract({
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        agencyId: data.agencyId,
        artistId: data.artistId,
        distributionPercentage: parseFloat(data.distributionPercentage),
        status: data.status,
        conditions: data.conditions.trim()
      });

      showCreateSuccess();
      setShowCreateModal(false);
      setShowCreateModal(false);
      await fetchContracts();


    } catch (err: any) {
      showCreateError(err.message);
    }
  };

  // Manejar actualización
  const handleUpdate = async (id: string | number, data: Record<string, any>) => {
    try {
      await updateContract(id as string, {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        agencyId: data.agencyId,
        artistId: data.artistId,
        distributionPercentage: parseFloat(data.distributionPercentage),
        status: data.status,
        conditions: data.conditions.trim()
      });

       showUpdateSuccess();
      setEditingContract(null);
      setEditingContract(null);
      await fetchContracts();
    } catch (err: any) {
       showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingContract) return;

    try {
      await deleteContract(id as string);
      showDeleteSuccess();
      setDeletingContract(null);
      setDeletingContract(null);
      await fetchContracts();
    } catch (err: any) {
      showDeleteError(err.message);

    }
  };

  // Funciones auxiliares
  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleDateString("es-ES");
  };

  const getStatusText = (status: ContractStatus) => {
    const statusMap = {
      [ContractStatus.ACTIVO]: "Activo",
      [ContractStatus.EN_RENOVACION]: "En renovación",
      [ContractStatus.RESCINDIDO]: "Rescindido",
      [ContractStatus.FINALIZADO]: "Finalizado",
    };
    return statusMap[status] || status;
  };

  const getDaysRemaining = (endDate: Date | string) => {
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  // Definir columnas para la tabla
  const columns: Column<ContractResponseDto>[] = [
    {
      key: "artist.stageName",
      title: "Artista",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => {
        if (item.artist && typeof item.artist === 'object') {
          return item.artist.stageName;
        }
        // Si no está poblado, buscar en el contexto
        const artist = artists.find(a => a.apprenticeId === item.artist.apprenticeId);
        return artist ? artist.stageName : "No asignado";
      }
    },
    {
      key: "agency.nameAgency",
      title: "Agencia",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => {
        if (item.agency && typeof item.agency === 'object') {
          return item.agency.nameAgency;
        }
        // Si no está poblado, buscar en el contexto
        const agency = agencies.find(a => a.nameAgency === item.agency.nameAgency);
        return agency ? agency.nameAgency : "No asignada";
      }
    },
    {
      key: "startDate",
      title: "Fecha Inicio",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => formatDate(item.startDate)
    },
    {
      key: "endDate",
      title: "Fecha Fin",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => formatDate(item.endDate)
    },
    {
      key: "daysRemaining",
      title: "Días Restantes",
      sortable: false,
      width: "12%",
      align: "center",
      render: (item) => {
        const days = getDaysRemaining(item.endDate);
        return (
          <span className={`days-remaining ${
            days < 30 ? "warning" : days < 0 ? "expired" : ""
          }`}>
            {days >= 0 ? `${days} días` : "Expirado"}
          </span>
        );
      }
    },
    {
      key: "distributionPercentage",
      title: "Distribución",
      sortable: true,
      width: "10%",
      align: "center",
      render: (item) => `${item.distributionPercentage}%`
    },
    {
      key: "status",
      title: "Estado",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => (
        <span className={`status-badge status-${item.status.toLowerCase()}`}>
          {getStatusText(item.status)}
        </span>
      )
    }
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderContractDetails = (contract: ContractResponseDto) => {
    const artistName = contract.artist && typeof contract.artist === 'object' 
      ? contract.artist.stageName
      : artists.find(a => a.apprenticeId === contract.artist.apprenticeId)?.stageName || "No asignado";
    
    const agencyName = contract.agency && typeof contract.agency === 'object' 
      ? contract.agency.nameAgency
      : agencies.find(a => a.nameAgency === contract.agency.nameAgency)?.nameAgency || "No asignada";
    
    return (
      <div className="contract-details">
        <div className="detail-item">
          <strong>Artista:</strong> <span>{artistName}</span>
        </div>
        <div className="detail-item">
          <strong>Agencia:</strong> <span>{agencyName}</span>
        </div>
        <div className="detail-item">
          <strong>Fecha de inicio:</strong> <span>{formatDate(contract.startDate)}</span>
        </div>
        <div className="detail-item">
          <strong>Fecha de fin:</strong> <span>{formatDate(contract.endDate)}</span>
        </div>
        <div className="detail-item">
          <strong>Distribución:</strong> <span>{contract.distributionPercentage}%</span>
        </div>
        <div className="detail-item">
          <strong>Estado:</strong> <span>{getStatusText(contract.status)}</span>
        </div>
        <div className="detail-item">
          <strong>Condiciones:</strong> <span>{contract.conditions}</span>
        </div>
      </div>
    );
  };

 
  return (
    <section id="contract_manager" className="content-section active">

  <GenericTable<ContractResponseDto>
    title="Gestión de Contratos"
    description="Administre todos los contratos del sistema"
    data={contracts}
    columns={columns}
    loading={loading}
    onReload={() => {
      fetchContracts();
      fetchAgencies();
      fetchArtists();
    }}
    showCreateForm={showCreateModal}
    onShowCreateChange={setShowCreateModal}
    editingItem={editingContract}
    onEditingChange={setEditingContract}
    deletingItem={deletingContract}
    onDeletingChange={setDeletingContract}
    itemsPerPage={30}
    className="contract-table"
     notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
        
  />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Contrato"
          fields={contractFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Contrato"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingContract && (
        <EditModal
          title="Editar Contrato"
          fields={contractEditFields}
          initialData={{
            artistId: editingContract.artist.apprenticeId,
            agencyId: editingContract.agency.nameAgency || editingContract.agency,
            startDate: editingContract.startDate ? 
              (new Date(editingContract.startDate).toISOString().split("T")[0]) 
              : "",
            endDate: editingContract.endDate ? 
              (new Date(editingContract.endDate).toISOString().split("T")[0]) 
              : "",
            distributionPercentage: editingContract.distributionPercentage.toString(),
            status: editingContract.status,
            conditions: editingContract.conditions
          }}
          itemId={editingContract.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingContract(null)}
          loading={loading}
          submitText="Actualizar Contrato"
           contractInfo={{
            artist: getArtistName(editingContract),
            agency: getAgencyName(editingContract)
          }}
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingContract && (
        <DeleteModal<ContractResponseDto>
          title="¿Eliminar Contrato?"
          item={deletingContract}
          itemName="Contrato"
          itemId={deletingContract.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingContract(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderContractDetails}
        />
      )}
    </section>
  );
};

export default ContractManagement;