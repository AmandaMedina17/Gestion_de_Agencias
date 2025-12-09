import React, { useState, useEffect } from "react";
import { useAward } from "../../../../context/AwardContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reutilizables/CreateModal";
import EditModal from "../../../ui/reutilizables/EditModal";
import DeleteModal from "../../../ui/reutilizables/DeleteModal";
// import './AwardManagement.css'
import { ResponseAwardDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/AwardDto/response.award.dto";

const AwardManagement: React.FC = () => {
  const {
    awards,
    fetchAwards,
    createAward,
    updateAward,
    deleteAward,
    loading,
    error,
    clearError,
  } = useAward();
  
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAward, setEditingAward] = useState<ResponseAwardDto | null>(null);
  const [deletingAward, setDeletingAward] = useState<ResponseAwardDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAwards();
      } catch (err) {
        console.error("Error loading awards:", err);
      }
    };
    loadData();
  }, []);

  // Definir campos del formulario de premio
  const awardFields: FormField[] = [
    {
      name: "name",
      label: "Nombre del Premio",
      type: "text",
      placeholder: "Ej: Grammy, MTV Music Awards, Billboard",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (value.length < 2) return "El nombre del premio debe tener al menos 2 caracteres";
        return null;
      }
    },
    {
      name: "date",
      label: "Fecha del Premio",
      type: "date",
      required: true,
      validate: (value) => {
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        return null;
      }
    },
    
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    name: "",
    date: new Date().toISOString().split('T')[0],
    albumId: ""
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
    showSuccess("¡Premio Creado!", "El premio ha sido creado exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear Premio", errorMessage || "No se pudo crear el premio.");
  };

  const showUpdateSuccess = () => {
    showSuccess("¡Premio Actualizado!", "El premio ha sido actualizado exitosamente.");
  };

  const showUpdateError = (errorMessage?: string) => {
    showError("Error al Actualizar Premio", errorMessage || "No se pudo actualizar el premio.");
  };

  const showDeleteSuccess = () => {
    showSuccess("¡Premio Eliminado!", "El premio ha sido eliminado exitosamente.");
  };

  const showDeleteError = (errorMessage?: string) => {
    showError("Error al Eliminar Premio", errorMessage || "No se pudo eliminar el premio.");
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      console.log("Datos para crear premio:", data);
      
      await createAward({
        name: data.name,
        date: new Date(data.date),
        albumId: data.albumId || undefined
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchAwards();

    } catch (err: any) {
      console.error("Error al crear premio:", err);
      showCreateError(err.message);
    }
  };

  // Manejar actualización
  const handleUpdate = async (id: string | number, data: Record<string, any>) => {
    try {
      await updateAward(id as string, {
        name: data.name,
        date: new Date(data.date),
        albumId: data.albumId || undefined
      });

      showUpdateSuccess();
      setEditingAward(null);
      await fetchAwards();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingAward) return;

    try {
      await deleteAward(id as string);
      showDeleteSuccess();
      setDeletingAward(null);
      await fetchAwards();
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

  const formatYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  // Definir columnas para la tabla - USANDO NOTACIÓN DE PUNTO COMO EN CONTRATO
  const columns: Column<ResponseAwardDto>[] = [
    {
      key: "name",
      title: "Nombre del Premio",
      sortable: true,
      width: "40%",
      align: "center"
    },
   
    {
      key: "date",
      title: "Fecha",
      sortable: true,
      width: "20%",
      render: (item) => formatDate(item.date.toString()),
      align: "center"
    },
    {
      key: "albumId",
      title: "ID del Álbum",
      sortable: true,
      width: "25%",
      align: "center",
      render: (item) => {
        if (item.albumId) {
          return (
            <span className="album-id">
              {item.albumId.length > 20 
                ? `${item.albumId.substring(0, 20)}...` 
                : item.albumId}
            </span>
          );
        }
        return <span className="no-album">No asociado</span>;
      }
    }
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderAwardDetails = (award: ResponseAwardDto) => (
    <div className="award-details">
      <div className="detail-item">
        <strong>Nombre:</strong> <span>{award.name}</span>
      </div>
      <div className="detail-item">
        <strong>Fecha:</strong> <span>{formatDate(award.date.toString())}</span>
      </div>
      <div className="detail-item">
        <strong>Año:</strong> <span>{formatYear(award.date.toString())}</span>
      </div>
      <div className="detail-item">
        <strong>ID del Álbum:</strong> 
        <span className={award.albumId ? "album-id-detail" : "no-album-detail"}>
          {award.albumId || "No asociado a ningún álbum"}
        </span>
      </div>
      <div className="detail-item">
        <strong>ID del Premio:</strong> <span className="award-id">{award.id}</span>
      </div>
    </div>
  );

  return (
    <section id="award_manager" className="content-section active">
      <GenericTable<ResponseAwardDto>
        title="Gestión de Premios"
        description="Administre todos los premios del sistema"
        data={awards}
        columns={columns}
        loading={loading}
        onReload={() => fetchAwards()}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingAward}
        onEditingChange={setEditingAward}
        deletingItem={deletingAward}
        onDeletingChange={setDeletingAward}
        itemsPerPage={20}
        className="award-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Premio"
          fields={awardFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Premio"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingAward && (
        <EditModal
          title="Editar Premio"
          fields={awardFields}
          initialData={{
            name: editingAward.name,
            date: editingAward.date.toString().split("T")[0],
            albumId: editingAward.albumId || ""
          }}
          itemId={editingAward.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingAward(null)}
          loading={loading}
          submitText="Actualizar Premio"
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingAward && (
        <DeleteModal<ResponseAwardDto>
          title="¿Eliminar Premio?"
          item={deletingAward}
          itemName="Premio"
          itemId={deletingAward.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingAward(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderAwardDetails}
        />
      )}
    </section>
  );
};

export default AwardManagement;