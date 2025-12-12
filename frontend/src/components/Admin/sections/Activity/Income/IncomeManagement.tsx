// IncomeManagement.tsx
import React, { useState, useEffect } from "react";
import { useIncome } from "@/context/IncomeContext";
import { useActivity } from "@/context/ActivityContext";
import { useResponsible } from "@/context/ResponsibleContext";
import GenericTable, { Column } from "../../../../ui/datatable";
import CreateModal, { FormField } from "../../../../ui/reusable/CreateModal";
import EditModal from "../../../../ui/reusable/EditModal";
import DeleteModal from "../../../../ui/reusable/DeleteModal";
import "./IncomeStyle.css";

export enum IncomeType {
  EFECTIVO = "EFECTIVO",
  TRANSFERENCIA_BANCARIA = "TRANSFERENCIA_BANCARIA",
  TARJETA_CREDITO = "TARJETA_CREDITO",
  TARJETA_DEBITO = "TARJETA_DEBITO",
  CHEQUE = "CHEQUE",
  DEPOSITO = "DEPOSITO",
  MONEDA_DIGITAL = "MONEDA_DIGITAL",
  PAYPAL = "PAYPAL",
  TRANSFERENCIA_ELECTRONICA = "TRANSFERENCIA_ELECTRONICA",
  OTRO = "OTRO",
}

interface IncomeResponseDto {
  id: string;
  incomeType: IncomeType;
  mount: number;
  date: Date | string;
  responsible: string;
  activityId: string;
  activity?: { id: string; classification: string; type: string };
  responsibleObj?: { id: string; name: string };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const IncomeManagement: React.FC = () => {
  const {
    incomes,
    fetchIncomes,
    createIncome,
    updateIncome,
    deleteIncome,
    loading,
    error,
    clearError,
  } = useIncome();

  const { activities, fetchActivities } = useActivity();
  const { responsibles, fetchResponsibles } = useResponsible();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeResponseDto | null>(
    null
  );
  const [deletingIncome, setDeletingIncome] =
    useState<IncomeResponseDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchIncomes(),
          fetchActivities(),
          fetchResponsibles(),
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  // Funciones auxiliares para notificaciones
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
    showSuccess("¡Ingreso Creado!", "El ingreso ha sido creado exitosamente.");
  };

  const showCreateError = (errorMessage?: string) => {
    showError("Error al Crear", errorMessage || "No se pudo crear el ingreso.");
  };

  const showUpdateSuccess = () => {
    showSuccess(
      "¡Ingreso Actualizado!",
      "El ingreso ha sido actualizado exitosamente."
    );
  };

  const showUpdateError = (errorMessage?: string) => {
    showError(
      "Error al Actualizar",
      errorMessage || "No se pudo actualizar el ingreso."
    );
  };

  const showDeleteSuccess = () => {
    showSuccess(
      "¡Ingreso Eliminado!",
      "El ingreso ha sido eliminado exitosamente."
    );
  };

  const showDeleteError = (errorMessage?: string) => {
    showError(
      "Error al Eliminar",
      errorMessage || "No se pudo eliminar el ingreso."
    );
  };

  // Funciones auxiliares para mostrar nombres
  const getActivityName = (income: IncomeResponseDto) => {
    if (income.activity && typeof income.activity === "object") {
      return `Actividad ${income.activity.id}`;
    }
    const activity = activities.find((a) => a.id === income.activityId);
    return activity ? `Actividad ${activity.id}` : "No asignada";
  };

  const getResponsibleName = (income: IncomeResponseDto) => {
    if (income.responsibleObj && typeof income.responsibleObj === "object") {
      return income.responsibleObj.name;
    }
    const responsible = responsibles.find((r) => r.id === income.responsible);
    return responsible ? responsible.name : income.responsible;
  };

  const getIncomeTypeText = (type: IncomeType) => {
    const typeMap = {
      [IncomeType.EFECTIVO]: "Efectivo",
      [IncomeType.TRANSFERENCIA_BANCARIA]: "Transferencia Bancaria",
      [IncomeType.TARJETA_CREDITO]: "Tarjeta de Crédito",
      [IncomeType.TARJETA_DEBITO]: "Tarjeta de Débito",
      [IncomeType.CHEQUE]: "Cheque",
      [IncomeType.DEPOSITO]: "Depósito",
      [IncomeType.MONEDA_DIGITAL]: "Moneda Digital",
      [IncomeType.PAYPAL]: "PayPal",
      [IncomeType.TRANSFERENCIA_ELECTRONICA]: "Transferencia Electrónica",
      [IncomeType.OTRO]: "Otro",
    };
    return typeMap[type] || type;
  };

  // Campos del formulario
  const incomeFields: FormField[] = [
    {
      name: "incomeType",
      label: "Tipo de ingreso",
      type: "autocomplete",
      required: true,
      options: Object.values(IncomeType).map((type) => ({
        value: type,
        label: getIncomeTypeText(type),
      })),
    },
    {
      name: "mount",
      label: "Monto",
      type: "number",
      required: true,
      min: 0,
      validate: (value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return "Debe ser un número válido";
        if (numValue <= 0) return "El monto debe ser mayor a 0";
        if (numValue > 1000000000) return "El monto es demasiado grande";
        return null;
      },
    },
    {
      name: "date",
      label: "Fecha",
      type: "date",
      required: true,
      validate: (value) => {
        if (!value) return "La fecha es requerida";
        return null;
      },
    },
    {
      name: "responsible",
      label: "Responsable",
      type: "autocomplete",
      required: true,
      options: responsibles.map((responsible) => ({
        value: responsible.id,
        label: responsible.name,
      })),
    },
    {
      name: "activityId",
      label: "Actividad",
      type: "autocomplete",
      required: true,
      options: activities.map((activity) => ({
        value: activity.id,
        label: `Actividad ${activity.id}`,
      })),
    },
  ];

  // Datos iniciales para creación
  const initialCreateData = {
    incomeType: IncomeType.EFECTIVO,
    mount: "",
    date: new Date().toISOString().split("T")[0],
    responsible: "",
    activityId: "",
  };

  // Manejar creación
  const handleCreate = async (data: Record<string, any>) => {
    try {
      await createIncome({
        type: data.incomeType,
        mount: parseFloat(data.mount),
        date: new Date(data.date),
        responsible: data.responsible,
        activityId: data.activityId,
      });

      showCreateSuccess();
      setShowCreateModal(false);
      await fetchIncomes();
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
      await updateIncome(id as string, {
        type: data.incomeType,
        mount: parseFloat(data.mount),
        date: new Date(data.date),
        responsible: data.responsible,
        activityId: data.activityId,
      });

      showUpdateSuccess();
      setEditingIncome(null);
      await fetchIncomes();
    } catch (err: any) {
      showUpdateError(err.message);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string | number) => {
    if (!deletingIncome) return;

    try {
      await deleteIncome(id as string);
      showDeleteSuccess();
      setDeletingIncome(null);
      await fetchIncomes();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Columnas para la tabla
  const columns: Column<IncomeResponseDto>[] = [
    {
      key: "incomeType",
      title: "Tipo",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => (
        <span className={`income-type type-${item.incomeType.toLowerCase()}`}>
          {getIncomeTypeText(item.incomeType)}
        </span>
      ),
    },
    {
      key: "mount",
      title: "Monto",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => formatCurrency(item.mount),
    },
    {
      key: "date",
      title: "Fecha",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => formatDate(item.date),
    },
    {
      key: "responsible",
      title: "Responsable",
      sortable: false,
      width: "20%",
      align: "center",
      render: (item) => getResponsibleName(item),
    },
    {
      key: "activityId",
      title: "Actividad",
      sortable: false,
      width: "20%",
      align: "center",
      render: (item) => getActivityName(item),
    },
  ];

  // Función para renderizar detalles en modal de eliminación
  const renderIncomeDetails = (income: IncomeResponseDto) => {
    return (
      <div className="income-details">
        <div className="detail-item">
          <strong>Tipo:</strong>{" "}
          <span>{getIncomeTypeText(income.incomeType)}</span>
        </div>
        <div className="detail-item">
          <strong>Monto:</strong> <span>{formatCurrency(income.mount)}</span>
        </div>
        <div className="detail-item">
          <strong>Fecha:</strong> <span>{formatDate(income.date)}</span>
        </div>
        <div className="detail-item">
          <strong>Responsable:</strong>{" "}
          <span>{getResponsibleName(income)}</span>
        </div>
        <div className="detail-item">
          <strong>Actividad:</strong> <span>{getActivityName(income)}</span>
        </div>
      </div>
    );
  };

  return (
    <section id="income_management" className="content-section active">
      <GenericTable<IncomeResponseDto>
        title="Gestión de Ingresos"
        description="Administre todos los ingresos del sistema"
        data={incomes}
        columns={columns}
        loading={loading}
        onReload={() => {
          fetchIncomes();
          fetchActivities();
          fetchResponsibles();
        }}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        editingItem={editingIncome}
        onEditingChange={setEditingIncome}
        deletingItem={deletingIncome}
        onDeletingChange={setDeletingIncome}
        itemsPerPage={30}
        className="income-table"
        notification={notification || undefined}
        onNotificationClose={() => setNotification(null)}
      />

      {/* Modal de creación */}
      {showCreateModal && (
        <CreateModal
          title="Crear Nuevo Ingreso"
          fields={incomeFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          loading={loading}
          submitText="Crear Ingreso"
        />
      )}

      {/* Modal de edición */}
      {editingIncome && (
        <EditModal
          title="Editar Ingreso"
          fields={incomeFields}
          initialData={{
            incomeType: editingIncome.incomeType,
            mount: editingIncome.mount.toString(),
            date: editingIncome.date
              ? new Date(editingIncome.date).toISOString().split("T")[0]
              : "",
            responsible: editingIncome.responsible,
            activityId: editingIncome.activityId,
          }}
          itemId={editingIncome.id}
          onSubmit={handleUpdate}
          onClose={() => setEditingIncome(null)}
          loading={loading}
          submitText="Actualizar Ingreso"
        />
      )}

      {/* Modal de eliminación */}
      {deletingIncome && (
        <DeleteModal<IncomeResponseDto>
          title="¿Eliminar Ingreso?"
          item={deletingIncome}
          itemName="Ingreso"
          itemId={deletingIncome.id}
          onConfirm={handleDelete}
          onClose={() => setDeletingIncome(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderIncomeDetails}
        />
      )}
    </section>
  );
};

export default IncomeManagement;
