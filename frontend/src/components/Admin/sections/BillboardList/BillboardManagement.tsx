import React, { useState, useEffect } from "react";
import { useBillboardList } from "../../../../context/BillboardListContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reutilizables/CreateModal";
import EditModal from "../../../ui/reutilizables/EditModal";
import DeleteModal from "../../../ui/reutilizables/DeleteModal";
import './BillboardListStyle.css';

import { ResponseBillboardListDto as BillboardListResponseDto} from "../../../../../../backend/src/ApplicationLayer/DTOs/billboardDto/response.billboard.dto";

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';

export enum BillboardListScope {
  INTERNACIONAL = "INTERNACIONAL",
  NACIONAL = "NACIONAL",
}

const BillboardListManagement: React.FC = () => {
  const {
    billboardLists,
    fetchBillboardLists,
    createBillboardList,
    updateBillboardList,
    deleteBillboardList,
    loading,
    error,
    clearError,
  } = useBillboardList();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingList, setEditingList] = useState<BillboardListResponseDto | null>(null);
  const [deletingList, setDeletingList] = useState<BillboardListResponseDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchBillboardLists();
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  // Definir campos del formulario de lista Billboard
  const billboardListFields: FormField[] = [
    {
      name: "nameList",
      label: "Nombre de la lista",
      type: "text",
      placeholder: "Ej: Top 100 Semanal",
      required: true,
      min: 2,
      max: 100,
      validate: (value) => {
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
        return null;
      }
    },
    {
      name: "publicDate",
      label: "Fecha de publicación",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha de publicación es requerida";
        return null;
      }
    },
    {
      name: "scope",
      label: "Alcance",
      type: "autocomplete",
      required: true,
      options: [
        { value: BillboardListScope.INTERNACIONAL, label: "Internacional" },
        { value: BillboardListScope.NACIONAL, label: "Nacional" }
      ]
    },
    {
      name: "endList",
      label: "Cantidad de puestos",
      type: "text",
      required: true,
      min: 1,
      max: 1000,
      validate: (value) => {
        const numValue = parseInt(value);
        if (numValue <= 0) return "El número de puestos de la lista debe ser mayor a 0";
        if (numValue > 1000) return "El número de puestos de la lista no puede ser mayor a 1000";
        return null;
      }
    }
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    nameList: "",
    publicDate: "",
    scope: BillboardListScope.NACIONAL,
    endList: "100"
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
    showSuccess("¡Lista Billboard Creada!", "La lista Billboard ha sido creada exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear la lista Billboard.");
  };

  const showUpdateSuccess = () => {
    showSuccess("¡Lista Billboard Actualizada!", "La lista Billboard ha sido actualizada exitosamente.");
  };

  const showUpdateError = (errorMessage?: string) => {
    showError("Error al Actualizar", errorMessage || "No se pudo actualizar la lista Billboard.");
  };

  const showDeleteSuccess = () => {
    showSuccess("¡Lista Billboard Eliminada!", "La lista Billboard ha sido eliminada exitosamente.");
  };

  const showDeleteError = (errorMessage?: string) => {
    showError("Error al Eliminar", errorMessage || "No se pudo eliminar la lista Billboard.");
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createBillboardList({
        nameList: data.nameList,
        publicDate: new Date(data.publicDate),
        scope: data.scope,
        endList: parseInt(data.endList)
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchBillboardLists();

    } catch (err: any) {
      showCreateError(err.message);
    }
  };

  // Manejar actualización
  const handleUpdate = async (id: string | number, data: Record<string, any>) => {
    try {
      await updateBillboardList(id as string, {
        nameList: data.nameList,
        publicDate: new Date(data.publicDate),
        scope: data.scope,
        endList: parseInt(data.endList)
      });

      showUpdateSuccess();
      setEditingList(null);
      await fetchBillboardLists();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingList) return;

    try {
      await deleteBillboardList(id as string);
      showDeleteSuccess();
      setDeletingList(null);
      await fetchBillboardLists();
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

  const getScopeText = (scope: BillboardListScope) => {
    const scopeMap = {
      [BillboardListScope.INTERNACIONAL]: "Internacional",
      [BillboardListScope.NACIONAL]: "Nacional",
    };
    return scopeMap[scope] || scope;
  };

  // Definir columnas para la tabla
  const columns: Column<BillboardListResponseDto>[] = [
    {
      key: "nameList",
      title: "Nombre",
      sortable: true,
      width: "30%",
      align: "center"
    },
    {
      key: "publicDate",
      title: "Fecha",
      sortable: true,
      width: "20%",
      align: "center",
      render: (item) => formatDate(item.publicDate)
    },
    {
      key: "scope",
      title: "Alcance",
      sortable: true,
      width: "20%",
      align: "center",
      render: (item) => (
        <span className={`scope-badge scope-${item.scope.toLowerCase()}`}>
          {getScopeText(item.scope)}
        </span>
      )
    },
    {
      key: "endList",
      title: "Puestos",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => item.endList.toString()
    }
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderBillboardListDetails = (list: BillboardListResponseDto) => (
    <div className="billboard-list-details">
      <div className="detail-item">
        <strong>Nombre:</strong> <span>{list.nameList}</span>
      </div>
      <div className="detail-item">
        <strong>Fecha:</strong> <span>{formatDate(list.publicDate)}</span>
      </div>
      <div className="detail-item">
        <strong>Alcance:</strong> <span>{getScopeText(list.scope)}</span>
      </div>
      <div className="detail-item">
        <strong>Fin de lista:</strong> <span>{list.endList}</span>
      </div>
    </div>
  );

  return (
    <section id="billboard_list_manager" className="content-section active">
      <GenericTable<BillboardListResponseDto>
        title="Gestión de Listas Billboard"
        description="Administre todas las listas Billboard del sistema"
        data={billboardLists}
        columns={columns}
        loading={loading}
        onReload={() => fetchBillboardLists()}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingList}
        onEditingChange={setEditingList}
        deletingItem={deletingList}
        onDeletingChange={setDeletingList}
        itemsPerPage={30}
        className="billboard-list-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación usando componente genérico */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nueva Lista Billboard"
          fields={billboardListFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Lista"
        />
      )}

      {/* Modal de edición usando componente genérico */}
      {editingList && (
        <EditModal
          title="Editar Lista Billboard"
          fields={billboardListFields}
          initialData={{
            nameList: editingList.nameList,
            publicDate: editingList.publicDate ? 
              (new Date(editingList.publicDate).toISOString().split("T")[0]) 
              : "",
            scope: editingList.scope,
            endList: editingList.endList.toString()
          }}
          itemId={editingList.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingList(null)}
          loading={loading}
          submitText="Actualizar Lista"
         
        />
      )}

      {/* Modal de eliminación usando componente genérico */}
      {deletingList && (
        <DeleteModal<BillboardListResponseDto>
          title="¿Eliminar Lista Billboard?"
          item={deletingList}
          itemName="Lista Billboard"
          itemId={deletingList.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingList(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderBillboardListDetails}
        />
      )}
    </section>
  );
};

export default BillboardListManagement;