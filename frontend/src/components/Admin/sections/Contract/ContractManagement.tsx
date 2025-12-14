import React, { useState, useEffect } from "react";
import { useContract } from "../../../../context/ContractContext";
import { useAgency } from "../../../../context/AgencyContext";
import { useArtist } from "../../../../context/ArtistContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reusable/CreateModal";
import EditModal from "../../../ui/reusable/EditModal";
import DeleteModal from "../../../ui/reusable/DeleteModal";
import "./ContractStyle.css";
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

  const { agencies, fetchAgencies } = useAgency();
  const { artists, fetchArtists } = useArtist();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContract, setEditingContract] =
    useState<ContractResponseDto | null>(null);
  const [deletingContract, setDeletingContract] =
    useState<ContractResponseDto | null>(null);

  // Add loading states for agencies and artists
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [loadingArtists, setLoadingArtists] = useState(false);

  useEffect(() => {
    console.log('=== STRUCTURE DEBUG ===');
    console.log('Primer artista:', artists[0]);
    console.log('Primera agencia:', agencies[0]);
    console.log('Primer contrato:', contracts[0]);
  }, [artists, agencies, contracts]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingAgencies(true);
        setLoadingArtists(true);
        await Promise.all([fetchContracts(), fetchAgencies(), fetchArtists()]);
      } catch (err) {
        console.error("Error loading data:", err);
        showNotification('error', 'Error', 'Error al cargar los datos');
      } finally {
        setLoadingAgencies(false);
        setLoadingArtists(false);
      }
    };
    loadData();
  }, []);

  // Get unique artists and agencies to avoid duplicate keys
  const getUniqueArtists = () => {
    const uniqueMap = new Map();
    artists.forEach(artist => {
      if (!uniqueMap.has(artist.stageName)) {
        uniqueMap.set(artist.stageName, artist);
      }
    });
    return Array.from(uniqueMap.values());
  };

  const getUniqueAgencies = () => {
    const uniqueMap = new Map();
    agencies.forEach(agency => {
      if (!uniqueMap.has(agency.nameAgency)) {
        uniqueMap.set(agency.nameAgency, agency);
      }
    });
    return Array.from(uniqueMap.values());
  };

  const getArtistName = (contract: ContractResponseDto) => {
    if (contract.artist && typeof contract.artist === "object") {
      return contract.artist.stageName;
    }
    const artist = artists.find(
      (a) => a.apprenticeId === contract.artist.apprenticeId
    );
    return artist ? artist.stageName : "No asignado";
  };

  const getAgencyName = (contract: ContractResponseDto) => {
    if (contract.agency && typeof contract.agency === "object") {
      return contract.agency.nameAgency;
    }
    const agency = agencies.find(
      (a) => a.nameAgency === contract.agency.nameAgency
    );
    return agency ? agency.nameAgency : "No asignada";
  };

  // Definir campos del formulario de contrato - FIXED DUPLICATE KEYS
  const contractFields: FormField[] = [
    {
      name: "artistId",
      label: "Artista",
      type: "autocomplete",
      required: true,
      options: getUniqueArtists().map((artist) => ({
        value: artist.id,
        label: artist.stageName,
      })),
    },
    {
      name: "agencyId",
      label: "Agencia",
      type: "autocomplete",
      required: true,
      options: getUniqueAgencies().map((agency) => ({
        value: agency.id,
        label: `${agency.nameAgency}`,
      })),
    },
    {
      name: "startDate",
      label: "Fecha de inicio",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de inicio es requerida";
        return null;
      },
    },
    {
      name: "contractType",
      label: "Tipo de Contrato",
      type: "select",
      required: true,
      options: [
        { value: "indefinite", label: "Tiempo Indefinido" },
        { value: "fixed", label: "Plazo Fijo" },
      ],
      validate: (value) => {
        if (!value) return "El tipo de contrato es requerido";
        return null;
      },
    },
    {
      name: "endDate",
      label: "Fecha de fin",
      type: "date",
      required: false,
      validate: (value, formData) => {
        if (formData?.contractType === "fixed") {
          if (!value)
            return "La fecha de fin es requerida para contratos a plazo fijo";
          if (
            formData &&
            formData.startDate &&
            new Date(value) <= new Date(formData.startDate)
          ) {
            return "La fecha de fin debe ser posterior a la fecha de inicio";
          }
        }
        return null;
      },
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
      },
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
        { value: ContractStatus.FINALIZADO, label: "Finalizado" },
      ],
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
      },
    },
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
      },
    },
    {
      name: "contractType",
      label: "Tipo de Contrato",
      type: "select",
      required: true,
      options: [
        { value: "indefinite", label: "Tiempo Indefinido" },
        { value: "fixed", label: "Plazo Fijo" },
      ],
      validate: (value) => {
        if (!value) return "El tipo de contrato es requerido";
        return null;
      },
    },
    {
      name: "endDate",
      label: "Fecha de fin",
      type: "date",
      required: false,
      validate: (value, formData) => {
        if (formData?.contractType === "fixed") {
          if (!value)
            return "La fecha de fin es requerida para contratos a plazo fijo";
          if (
            formData &&
            formData.startDate &&
            new Date(value) <= new Date(formData.startDate)
          ) {
            return "La fecha de fin debe ser posterior a la fecha de inicio";
          }
        }
        return null;
      },
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
      },
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
        { value: ContractStatus.FINALIZADO, label: "Finalizado" },
      ],
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
      },
    },
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    artistId: "",
    agencyId: "",
    startDate: "",
    contractType: "indefinite",
    endDate: "",
    distributionPercentage: "20",
    status: ContractStatus.ACTIVO,
    conditions: "",
  };

  // Funciones auxiliares para mostrar notificaciones
  const showNotification = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string
  ) => {
    setNotification({ type, title, message });
    // Auto-clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const showSuccess = (title: string, message: string) => {
    showNotification("success", title, message);
  };

  const showError = (title: string, message: string) => {
    showNotification("error", title, message);
  };

  const showCreateSuccess = () => {
    showSuccess(
      "¡Contrato Creado!",
      "El contrato ha sido creado exitosamente."
    );
  };

  const showCreateError = (errorMessage?: string) => {
    showError(
      "Error al Crear",
      errorMessage || "No se pudo crear el contrato."
    );
  };

  const showUpdateSuccess = () => {
    showSuccess(
      "¡Contrato Actualizado!",
      "El contrato ha sido actualizado exitosamente."
    );
  };

  const showUpdateError = (errorMessage?: string) => {
    showError(
      "Error al Actualizar",
      errorMessage || "No se pudo actualizar el contrato."
    );
  };

  const showDeleteSuccess = () => {
    showSuccess(
      "¡Contrato Eliminado!",
      "El contrato ha sido eliminado exitosamente."
    );
  };

  const showDeleteError = (errorMessage?: string) => {
    showError(
      "Error al Eliminar",
      errorMessage || "No se pudo eliminar el contrato."
    );
  };

  // Validate if agency and artist exist before creating contract
  const validateContractData = async (data: any) => {
    const errors: string[] = [];

    // Check if agency exists in the loaded list
    const agencyExists = agencies.some(a => a.id === data.agencyId);
    if (!agencyExists) {
      errors.push(`La agencia con ID ${data.agencyId} no se encontró en la lista cargada`);
    }

    // Check if artist exists in the loaded list
    const artistExists = artists.some(a => a.id === data.artistId);
    if (!artistExists) {
      errors.push(`El artista con ID ${data.artistId} no se encontró en la lista cargada`);
    }

    if (errors.length > 0) {
      throw new Error(errors.join('. '));
    }
  };

  // Manejar creación - IMPROVED WITH BETTER VALIDATION
  const handleCreate = async (data: Record<string, any>) => {
    try {
      console.log('=== DEBUG: Datos del formulario ===');
      console.log('Form data completo:', data);
      console.log('ArtistId seleccionado:', data.artistId);
      console.log('AgencyId seleccionado:', data.agencyId);
      
      // First, validate the data
      await validateContractData(data);

      const isIndefinite = data.contractType === "indefinite";

      const contractData: any = {
        startDate: new Date(data.startDate).toISOString(),
        agencyId: data.agencyId,
        artistId: data.artistId,
        distributionPercentage: parseFloat(data.distributionPercentage),
        status: data.status,
        conditions: data.conditions.trim(),
      };

      // Only add endDate for fixed-term contracts
      if (!isIndefinite && data.endDate) {
        contractData.endDate = new Date(data.endDate).toISOString();
      }

      console.log('=== DEBUG: Datos a enviar al backend ===');
      console.log('Contrato a crear:', contractData);

      await createContract(contractData);

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchContracts();
    } catch (err: any) {
      console.error('Error completo al crear contrato:', err);
      
      // Extract meaningful error message
      let errorMessage = 'Error interno del servidor al crear el contrato';
      
      if (err.message.includes('no se encontró')) {
        errorMessage = err.message;
      } else if (err.message.includes('Internal server error')) {
        errorMessage = 'Error en el servidor. Verifique que la agencia y el artista existan en la base de datos.';
      } else if (err.response) {
        // Try to get error from response
        errorMessage = err.response.data?.message || err.message;
      }
      
      showCreateError(errorMessage);
    }
  };

  // Manejar actualización
  const handleUpdate = async (
    id: string | number,
    data: Record<string, any>
  ) => {
    try {
      const isIndefinite = data.contractType === "indefinite";

      const updateData: any = {
        startDate: new Date(data.startDate),
        agencyId: data.agencyId,
        artistId: data.artistId,
        distributionPercentage: parseFloat(data.distributionPercentage),
        status: data.status,
        conditions: data.conditions.trim(),
      };

      // Manejar endDate según el tipo de contrato
      if (isIndefinite) {
        updateData.endDate = null;
      } else if (data.endDate) {
        updateData.endDate = new Date(data.endDate);
      }

      await updateContract(id as string, updateData);

      showUpdateSuccess();
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
      await fetchContracts();
    } catch (err: any) {
      showDeleteError(err.message);
    }
  };

  // Funciones auxiliares
  const formatDate = (date: Date | string | null) => {
    if (!date) return "Tiempo indefinido";
    const dateObj = typeof date === "string" ? new Date(date) : date;
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

  // Definir columnas para la tabla - FIXED DUPLICATE KEYS
  const columns: Column<ContractResponseDto>[] = [
    {
      key: "artist",
      title: "Artista",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => getArtistName(item),
    },
    {
      key: "agency",
      title: "Agencia",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => getAgencyName(item),
    },
    {
      key: "startDate",
      title: "Fecha Inicio",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => formatDate(item.startDate),
    },
    {
      key: "endDate",
      title: "Fecha Fin",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => (item.endDate ? formatDate(item.endDate) : "-"),
    },
    {
      key: "distributionPercentage",
      title: "Distribución",
      sortable: true,
      width: "10%",
      align: "center",
      render: (item) => `${item.distributionPercentage}%`,
    },
    {
      key: "status",
      title: "Estado",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => (
        <span className={`status-contract-badge status-contract-${item.status.toLowerCase()}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderContractDetails = (contract: ContractResponseDto) => {
    const artistName = getArtistName(contract);
    const agencyName = getAgencyName(contract);

    return (
      <div className="contract-details">
        <div className="detail-item">
          <strong>Artista:</strong> <span>{artistName}</span>
        </div>
        <div className="detail-item">
          <strong>Agencia:</strong> <span>{agencyName}</span>
        </div>
        <div className="detail-item">
          <strong>Fecha de inicio:</strong>{" "}
          <span>{formatDate(contract.startDate)}</span>
        </div>
        <div className="detail-item">
          <strong>Tipo de contrato:</strong>{" "}
          <span>{contract.endDate ? "Plazo Fijo" : "Tiempo Indefinido"}</span>
        </div>
        {contract.endDate && (
          <div className="detail-item">
            <strong>Fecha de fin:</strong>{" "}
            <span>{formatDate(contract.endDate)}</span>
          </div>
        )}
        <div className="detail-item">
          <strong>Distribución:</strong>{" "}
          <span>{contract.distributionPercentage}%</span>
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

  // Obtener datos iniciales para edición
  const getEditInitialData = (contract: ContractResponseDto) => {
    const isIndefinite = !contract.endDate;

    // Extract IDs safely
    const artistId = contract.artist?.id || 
                    (typeof contract.artist === 'object' && 'apprenticeId' in contract.artist 
                      ? contract.artist.apprenticeId 
                      : '');
    
    const agencyId = contract.agency?.id || 
                    (typeof contract.agency === 'object' && 'nameAgency' in contract.agency 
                      ? contract.agency.nameAgency 
                      : '');

    return {
      artistId,
      agencyId,
      startDate: contract.startDate
        ? new Date(contract.startDate).toISOString().split("T")[0]
        : "",
      contractType: isIndefinite ? "indefinite" : "fixed",
      endDate: contract.endDate
        ? new Date(contract.endDate).toISOString().split("T")[0]
        : "",
      distributionPercentage: contract.distributionPercentage.toString(),
      status: contract.status,
      conditions: contract.conditions,
    };
  };

  return (
    <section id="contract_manager" className="content-section active">
      <GenericTable<ContractResponseDto>
        title="Gestión de Contratos"
        description="Administre todos los contratos del sistema"
        data={contracts}
        columns={columns}
        loading={loading || loadingAgencies || loadingArtists}
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

      {/* Modal de creación */}
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

      {/* Modal de edición */}
      {editingContract && (
        <EditModal
          title="Editar Contrato"
          fields={contractEditFields}
          initialData={getEditInitialData(editingContract)}
          itemId={editingContract.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingContract(null)}
          loading={loading}
          submitText="Actualizar Contrato"
          contractInfo={{
            artist: getArtistName(editingContract),
            agency: getAgencyName(editingContract),
          }}
        />
      )}

      {/* Modal de eliminación */}
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
