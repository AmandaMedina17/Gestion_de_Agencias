// src/views/SuccessManagement/BillboardTab.tsx
import React, { useState, useEffect } from "react";
import { useSongBillboard } from "../../../../context/SongBillboardContext";
import { useSong } from "../../../../context/SongContext";
import { useBillboardList } from "../../../../context/BillboardListContext";
import GenericTable, { Column } from "../../../ui/datatable";
import CreateModal, { FormField } from "../../../ui/reusable/CreateModal";
import DeleteModal from "../../../ui/reusable/DeleteModal";
import { Box, Button, Chip, Alert, IconButton } from "@mui/material";
import { Add, MusicNote, TrendingUp, Delete } from "@mui/icons-material";

interface BillboardTabProps {
  onNotification?: (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string
  ) => void;
}

const BillboardTab: React.FC<BillboardTabProps> = ({ onNotification }) => {
  const {
    records,
    fetchRecords,
    addSongToBillboard,
    removeSongFromBillboard,
    loading,
    error,
    clearError,
  } = useSongBillboard();

  const { songs, fetchSongs } = useSong();
  const { billboardLists, fetchBillboardLists } = useBillboardList();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchRecords(),
          fetchSongs(),
          fetchBillboardLists(),
        ]);
        setDataLoaded(true);
      } catch (err) {
        console.error("Error loading data:", err);
        if (onNotification) {
          onNotification("error", "Error", "No se pudieron cargar los datos");
        }
      }
    };
    loadData();
  }, []);

  const showNotification = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string
  ) => {
    if (onNotification) {
      onNotification(type, title, message);
    }
  };

  const validatePosition = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      return "La posición debe ser un número";
    }
    if (numValue < 1) {
      return "La posición debe ser al menos 1";
    }
    if (numValue > 200) {
      return "La posición no puede ser mayor a 200";
    }
    return null;
  };

  const billboardFields: FormField[] = [
    {
      name: "songId",
      label: "Canción",
      type: "autocomplete",
      required: true,
      options: songs.map((song) => ({
        value: song.id,
        label: song.name || song.name || "Canción sin nombre",
      })),
      validate: (value) => {
        if (!value) return "Debe seleccionar una canción";
        return null;
      },
    },
    {
      name: "billboardId",
      label: "Lista Billboard",
      type: "autocomplete",
      required: true,
      options: billboardLists.map((list) => ({
        value: list.id,
        label: list.nameList || "Lista sin nombre",
      })),
      validate: (value) => {
        if (!value) return "Debe seleccionar una lista Billboard";
        return null;
      },
    },
    {
      name: "place",
      label: "Posición",
      type: "number",
      placeholder: "Ej: 1",
      required: true,
      min: 1,
      max: 200,
      validate: validatePosition,
    },
    {
      name: "date",
      label: "Fecha de Entrada",
      type: "date",
      required: true,
      validate: (value) => {
        const date = new Date(value);
        if (date > new Date()) return "La fecha no puede ser futura";
        if (isNaN(date.getTime())) return "Fecha inválida";
        return null;
      },
    },
  ];

  const initialCreateData = {
    songId: "",
    billboardId: "",
    place: "",
    date: new Date().toISOString().split("T")[0],
  };

  const handleCreate = async (data: Record<string, any>) => {
    setFormError(null);

    try {
      console.log("Datos para agregar a Billboard:", data);

      if (!data.songId || !data.billboardId || !data.place || !data.date) {
        setFormError("Todos los campos son obligatorios");
        return;
      }

      const placeValue = parseInt(data.place);
      if (isNaN(placeValue) || placeValue < 1 || placeValue > 200) {
        setFormError("La posición debe ser un número entre 1 y 200");
        return;
      }

      const dateValue = new Date(data.date);
      if (isNaN(dateValue.getTime())) {
        setFormError("Fecha inválida");
        return;
      }

      const addDto = {
        songId: data.songId,
        billboardId: data.billboardId,
        place: placeValue,
        date: dateValue,
      };

      console.log("Enviando datos:", addDto);

      await addSongToBillboard(addDto);

      showNotification(
        "success",
        "Registro Creado",
        "La canción ha sido agregada al Billboard exitosamente."
      );
      setShowCreateModal(false);
      await fetchRecords();
    } catch (err: any) {
      console.error("Error al agregar a Billboard:", err);
      const errorMessage =
        err.message || "No se pudo agregar la canción al Billboard";
      setFormError(errorMessage);
      showNotification("error", "Error al Agregar", errorMessage);
    }
  };

  // CORREGIDO: handleDelete ahora usa billBoardId (con B mayúscula)
  const handleDelete = async () => {
    if (!deletingRecord) return;

    console.log("Eliminando registro:", deletingRecord);
    console.log("songId:", deletingRecord.songId);
    console.log("billBoardId:", deletingRecord.billBoardId);

    try {
      // IMPORTANTE: Usar billBoardId (con B mayúscula) según ResponseSongBillboardDto
      await removeSongFromBillboard(
        deletingRecord.songId,
        deletingRecord.billBoardId
      );

      showNotification(
        "success",
        "Registro Eliminado",
        "El registro ha sido eliminado del Billboard exitosamente."
      );
      setDeletingRecord(null);
      await fetchRecords();
    } catch (err: any) {
      console.error("Error al eliminar registro:", err);
      showNotification(
        "error",
        "Error al Eliminar",
        err.message || "No se pudo eliminar el registro del Billboard."
      );
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return "Fecha inválida";
      return dateObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return "#FFD700";
    if (position <= 3) return "#C0C0C0";
    if (position <= 10) return "#CD7F32";
    return "#666";
  };

  const getSongName = (songId: string) => {
    if (!dataLoaded) return "Cargando...";
    const song = songs.find((s) => s.id === songId);
    return song
      ? song.name || song.name || "Canción sin nombre"
      : "Canción desconocida";
  };

  const getBillboardName = (billboardId: string) => {
    if (!dataLoaded) return "Cargando...";
    const billboard = billboardLists.find((b) => b.id === billboardId);
    return billboard
      ? billboard.nameList || "Lista sin nombre"
      : "Lista desconocida";
  };

  const getRecordPosition = (record: any) => {
    return record.place || 0;
  };

  const getRecordDate = (record: any) => {
    return record.date || new Date();
  };

  const generateCompositeId = (record: any) => {
    return `${record.songId}_${record.billBoardId}`;
  };

  const combinedRecords = dataLoaded
    ? records.map((record) => ({
        ...record,
        id: generateCompositeId(record),
        songName: getSongName(record.songId),
        billboardName: getBillboardName(record.billBoardId),
        billboardId: record.billBoardId,
        position: getRecordPosition(record),
        entryDate: getRecordDate(record),
      }))
    : [];

  const columns: Column<any>[] = [
    {
      key: "songName",
      title: "Canción",
      sortable: true,
      width: "25%",
      align: "center",
      render: (item) => (
        <Box display="flex" alignItems="center" gap={2}>
          <MusicNote sx={{ color: "#4CAF50" }} />
          <Box>
            <div style={{ fontWeight: 600, fontSize: "16px" }}>
              {item.songName}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}></div>
          </Box>
        </Box>
      ),
    },
    {
      key: "billboardName",
      title: "Billboard",
      sortable: true,
      width: "25%",
      align: "center",
      render: (item) => (
        <Box>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>
            {item.billboardName}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}></div>
        </Box>
      ),
    },
    {
      key: "position",
      title: "Posición",
      sortable: true,
      width: "15%",
      align: "center",
      render: (item) => {
        const position = getRecordPosition(item);
        return (
          <Chip
            label={`#${position}`}
            sx={{
              backgroundColor: getPositionColor(position),
              color: position <= 10 ? "white" : "inherit",
              fontWeight: "bold",
              minWidth: "60px",
              fontSize: "14px",
            }}
          />
        );
      },
    },
    {
      key: "entryDate",
      title: "Fecha",
      sortable: true,
      width: "15%",
      render: (item) => formatDate(item.entryDate),
      align: "center",
    },
  ];

  const renderRecordDetails = (record: any) => (
    <div className="billboard-record-details">
      <div className="detail-item">
        <strong>Canción:</strong>
        <div>
          <div>{record.songName}</div>
        </div>
      </div>
      <div className="detail-item">
        <strong>Billboard:</strong>
        <div>
          <div>{record.billboardName}</div>
        </div>
      </div>
      <div className="detail-item">
        <strong>Posición:</strong>
        <span
          style={{
            color: getPositionColor(getRecordPosition(record)),
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          #{getRecordPosition(record)}
        </span>
      </div>
      <div className="detail-item">
        <strong>Fecha:</strong> <span>{formatDate(record.entryDate)}</span>
      </div>
    </div>
  );

  return (
    <div className="billboard-tab">
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <GenericTable<any>
        title="Canciones en Billboard"
        description=" Gestiona las posiciones de canciones en listas Billboard"
        data={combinedRecords}
        columns={columns}
        loading={loading || !dataLoaded}
        onReload={fetchRecords}
        showCreateForm={showCreateModal}
        onShowCreateChange={setShowCreateModal}
        deletingItem={deletingRecord}
        onDeletingChange={setDeletingRecord}
        itemsPerPage={10}
        className="billboard-table"
        notification={undefined}
        onNotificationClose={() => {}}
        emptyState={
          <Box sx={{ textAlign: "center", py: 6 }}>
            <TrendingUp sx={{ fontSize: 60, color: "#ddd", mb: 2 }} />
            <h3 style={{ color: "#666", marginBottom: "10px" }}>
              {dataLoaded
                ? "No hay canciones en Billboard"
                : "Cargando datos..."}
            </h3>
            <p style={{ color: "#999", marginBottom: "20px" }}>
              {dataLoaded
                ? "Agrega canciones a listas Billboard para comenzar"
                : "Por favor espere..."}
            </p>
            {dataLoaded && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowCreateModal(true)}
                sx={{ mt: 1 }}
              >
                Agregar primera canción
              </Button>
            )}
          </Box>
        }
      />

      {showCreateModal && (
        <CreateModal
          title="Agregar Canción a Billboard"
          fields={billboardFields}
          initialData={initialCreateData}
          onSubmit={handleCreate}
          onClose={() => {
            setShowCreateModal(false);
            setFormError(null);
          }}
          loading={loading}
          submitText="Agregar a Billboard"
        />
      )}

      {deletingRecord && (
        <DeleteModal<any>
          title="¿Eliminar del Billboard?"
          item={deletingRecord}
          itemName="Registro de Billboard"
          itemId={generateCompositeId(deletingRecord)}
          onConfirm={handleDelete}
          onClose={() => setDeletingRecord(null)}
          loading={loading}
          confirmText="Sí, Eliminar"
          warningMessage="⚠️ Esta acción no se puede deshacer."
          renderDetails={renderRecordDetails}
        />
      )}
    </div>
  );
};

export default BillboardTab;
