import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "../icons";
import "./datatable.css";

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableProps<T> {
  // Datos y columnas
  data: T[];
  columns: Column<T>[];

  // Configuración
  title: string;
  description?: string;
  itemsPerPage?: number;
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";

  customCreateButton?: React.ReactNode;

  // Estados controlados opcionales
  currentPage?: number;
  onPageChange?: (page: number) => void;
  sortBy?: string;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;

  // Acciones CRUD
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onReload?: () => void;

   // Notificaciones
  notification?: {
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  };
  onNotificationClose?: () => void;

  // Modales como funciones (solución al error)
  createForm?: (props: { onClose: () => void }) => React.ReactElement;
  editForm?: (props: { item: T; onClose: () => void }) => React.ReactElement;
  deleteModal?: (props: { item: T; onClose: () => void }) => React.ReactElement;

  // Estados de modales (opcional para control externo)
  showCreateForm?: boolean;
  onShowCreateChange?: (show: boolean) => void;
  editingItem?: T | null;
  onEditingChange?: (item: T | null) => void;
  deletingItem?: T | null;
  onDeletingChange?: (item: T | null) => void;

  // Filtro personalizado
  filterComponent?: React.ReactNode;

  // Estados
  loading?: boolean;
  error?: string;
  message?: {
    type: "success" | "error";
    text: string;
  };

  // Render personalizado
  emptyState?: React.ReactNode;
  loadingComponent?: React.ReactNode;

  // Estilos
  className?: string;
  showHeader?: boolean;
  showPagination?: boolean;
  
  // NUEVAS PROPS PARA CONTROLAR VISIBILIDAD
  showActionsColumn?: boolean; // Controla si se muestra la columna de acciones
  showCreateButton?: boolean; // Controla si se muestra el botón de crear
  showSearch?: boolean; // Controla si se muestra el buscador
  showReloadButton?: boolean; // Controla si se muestra el botón de recargar
  
  // Render personalizado para acciones
  actionsTitle?: string; // Título personalizado para la columna de acciones
  customActions?: (item: T) => React.ReactNode; // Render personalizado de acciones
  renderCustomActions?: (item: T) => React.ReactNode;
}

const GenericTable = <T extends {
  [x: string]: any; id: string | number 
}>({
  data,
  columns,
  title,
  description,
  itemsPerPage = 30,
  defaultSortBy = "",
  defaultSortOrder = "asc",
  currentPage: externalCurrentPage,
  onPageChange,
  sortBy: externalSortBy,
  onSortChange,
  onAdd,
  onEdit,
  onDelete,
  onReload,
  createForm,
  editForm,
  deleteModal,
  customCreateButton,
  showCreateForm: externalShowCreateForm,
  onShowCreateChange,
  editingItem: externalEditingItem,
  onEditingChange,
  deletingItem: externalDeletingItem,
  onDeletingChange,
  filterComponent,
  loading = false,
  error,
  message,
  emptyState,
  notification,
  onNotificationClose,
  loadingComponent,
  className = "",
  showHeader = true,
  showPagination = true,
  
  // NUEVAS PROPS CON VALORES POR DEFECTO
  showActionsColumn = true, // Por defecto sí muestra la columna de acciones
  showCreateButton = true, // Por defecto sí muestra el botón de crear
  showSearch = true, // Por defecto sí muestra el buscador
  showReloadButton = true, // Por defecto sí muestra el botón de recargar
  
  renderCustomActions,
}: TableProps<T>) => {
  // Estados internos para modales
  const [internalShowCreateForm, setInternalShowCreateForm] = useState(false);
  const [internalEditingItem, setInternalEditingItem] = useState<T | null>(
    null
  );
  const [internalDeletingItem, setInternalDeletingItem] = useState<T | null>(
    null
  );

  const [openNotification, setOpenNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<typeof notification>();

  // Determinar si los modales son controlados externamente
  const showCreateForm =
    externalShowCreateForm !== undefined
      ? externalShowCreateForm
      : internalShowCreateForm;

  const editingItem =
    externalEditingItem !== undefined
      ? externalEditingItem
      : internalEditingItem;

  const deletingItem =
    externalDeletingItem !== undefined
      ? externalDeletingItem
      : internalDeletingItem;

  // Estados de paginación y ordenamiento
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalSortBy, setInternalSortBy] = useState(defaultSortBy);
  const [internalSortOrder, setInternalSortOrder] = useState<"asc" | "desc">(
    defaultSortOrder
  );
  const [filter, setFilter] = useState("");

  // Determinar si el control es externo o interno
  const isControlled =
    externalCurrentPage !== undefined && onPageChange !== undefined;
  const currentPage = isControlled ? externalCurrentPage : internalCurrentPage;
  const sortBy = externalSortBy !== undefined ? externalSortBy : internalSortBy;

  

  // Actualizar página
  const handlePageChange = (page: number) => {
    if (isControlled) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  
  // Manejar apertura de modal de creación
  const handleOpenCreateForm = () => {
    if (onShowCreateChange) {
      onShowCreateChange(true);
    } else if (onAdd) {
      onAdd();
    } else {
      setInternalShowCreateForm(true);
    }
  };

  // Manejar cierre de modal de creación
  const handleCloseCreateForm = () => {
    if (onShowCreateChange) {
      onShowCreateChange(false);
    } else {
      setInternalShowCreateForm(false);
    }
  };

  // Manejar inicio de edición
  const handleStartEdit = (item: T) => {
    if (onEditingChange) {
      onEditingChange(item);
    } else if (onEdit) {
      onEdit(item);
    } else {
      setInternalEditingItem(item);
    }
  };

  // Manejar cierre de edición
  const handleCloseEdit = () => {
    if (onEditingChange) {
      onEditingChange(null);
    } else {
      setInternalEditingItem(null);
    }
  };

  // Manejar inicio de eliminación
  const handleStartDelete = (item: T) => {
    if (onDeletingChange) {
      onDeletingChange(item);
    } else if (onDelete) {
      onDelete(item);
    } else {
      setInternalDeletingItem(item);
    }
  };

  // Manejar cierre de eliminación
  const handleCloseDelete = () => {
    if (onDeletingChange) {
      onDeletingChange(null);
    } else {
      setInternalDeletingItem(null);
    }
  };

  // Filtrar datos
  const filteredData = useMemo(() => {
    if (!filter) return data;

    return data.filter((item) =>
      columns.some((column) => {
        const value = item[column.key as keyof T];
        return value?.toString().toLowerCase().includes(filter.toLowerCase());
      })
    );
  }, [data, filter, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
  if (!sortBy) return filteredData;

  const column = columns.find((col) => col.key === sortBy);
  if (!column) return filteredData;

  return [...filteredData].sort((a, b) => {
    // Función auxiliar para obtener valores anidados
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => {
        if (acc === null || acc === undefined) return null;
        // Si el objeto tiene un getter (como getPlaceName), úsalo
        if (typeof acc === 'function') return null;
        return acc[part];
      }, obj);
    };

    let aValue: any;
    let bValue: any;

    // Si la columna tiene una función render, necesitamos obtener el valor de otra manera
    if (column.render) {
      // Para columnas con render, usamos el valor renderizado para ordenar
      // Esto requiere que tengamos una forma de obtener el valor "real"
      if (sortBy === "place") {
        // Caso específico para lugar: obtener el nombre
        aValue = a.place?.name || "";
        bValue = b.place?.name || "";
      } else if (sortBy === "antiquity") {
        // Caso para antigüedad: usar dateFundation directamente
        aValue = a.dateFundation;
        bValue = b.dateFundation;
      } else {
        // Para otras columnas con render, intentamos obtener el valor directamente
        aValue = a[column.key as keyof T];
        bValue = b[column.key as keyof T];
      }
    } else {
      // Para columnas sin render, obtenemos el valor normalmente
      // Si el key contiene un punto, es un valor anidado
      if (String(column.key).includes('.')) {
        aValue = getNestedValue(a, String(column.key));
        bValue = getNestedValue(b, String(column.key));
      } else {
        aValue = a[column.key as keyof T];
        bValue = b[column.key as keyof T];
      }
    }

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Comparación según el tipo
    if (typeof aValue === "string" && typeof bValue === "string") {
      return internalSortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return internalSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return internalSortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // Comparación por defecto
    return internalSortOrder === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
}, [filteredData, sortBy, internalSortOrder, columns]);

  // Paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    handlePageChange(1);
  }, [filter, sortBy, internalSortOrder]);

  useEffect(() => {
    if (notification) {
      setCurrentNotification(notification);
      setOpenNotification(true);
      
      // Cerrar automáticamente después de 5 segundos
      const timer = setTimeout(() => {
        setOpenNotification(false);
        setTimeout(() => {
          if (onNotificationClose) onNotificationClose();
        }, 300);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onNotificationClose]);

  // Función para cerrar manualmente la notificación
  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenNotification(false);
    setTimeout(() => {
      if (onNotificationClose) onNotificationClose();
    }, 300);
  };

  // Componente de notificación reutilizable
  const NotificationSnackbar = () => {
    if (!currentNotification) return null;

    return (
      <Snackbar
        open={openNotification}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Grow}
        sx={{
          position: 'fixed',
          zIndex: 9999,
          '& .MuiAlert-root': {
            width: '100%',
          }
        }}
      >
        <Alert
          severity={currentNotification.type}
          variant="filled"
          elevation={6}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseNotification}
              sx={{ mt: -0.5 }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            minWidth: '350px',
            maxWidth: '450px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
              alignItems: 'center',
            },
            '& .MuiAlert-message': {
              display: 'flex',
              flexDirection: 'column',
              padding: '4px 0',
            },
          }}
        >
          {currentNotification.title && (
            <AlertTitle sx={{ 
              fontSize: '1rem', 
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.2
            }}>
              {currentNotification.title}
            </AlertTitle>
          )}
          <div style={{ 
            fontSize: '0.875rem',
            lineHeight: 1.4,
            marginTop: currentNotification.title ? '2px' : '0'
          }}>
            {currentNotification.message}
          </div>
        </Alert>
      </Snackbar>
    );
  };

  // Renderizar celda
  const renderCell = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }

    const value = item[column.key as keyof T];
    return value != null ? String(value) : "-";
  };

  // Renderizar encabezado de columna
  const renderHeaderCell = (column: Column<T>) => {
  const isSortable = column.sortable;
  const isSorted = sortBy === column.key;

  return (
    <th
      key={String(column.key)}
      className={`table-header-cell ${isSortable ? "sortable" : ""} ${
        isSorted ? "active" : ""
      }`}
      style={{
        width: column.width,
        textAlign: column.align || "center",
      }}
      onClick={() => isSortable && handleSort(String(column.key))}
    >
      <div className="header-cell-content" style={{
        display: 'flex',
        justifyContent: column.align || 'center',
        alignItems: 'center',
        textAlign: column.align || 'center'
      }}>
        {column.title}
        {isSortable && (
          <span className="sort-indicator">
            {isSorted ? (
              internalSortOrder === "asc" ? (
                <Icon name="up" size={14} />
              ) : (
                <Icon name="down" size={14} />
              )
            ) : (
              <Icon name="up" size={14} />
            )}
          </span>
        )}
      </div>
    </th>
  );
};

const handleSort = (columnKey: string) => {
  const column = columns.find((col) => col.key === columnKey);
  if (!column?.sortable) return;

  let newSortOrder: "asc" | "desc" = "asc";

  if (sortBy === columnKey) {
    newSortOrder = internalSortOrder === "asc" ? "desc" : "asc";
  }

  if (onSortChange) {
    onSortChange(columnKey, newSortOrder);
  } else {
    setInternalSortBy(columnKey);
    setInternalSortOrder(newSortOrder);
  }
};

  // Estado vacío por defecto
  const defaultEmptyState = (
    <div className="empty-state">
      <div className="empty-icon">📊</div>
      <h3>No hay datos</h3>
      <p>
        {filter
          ? `No se encontraron resultados para "${filter}"`
          : "No hay registros para mostrar"}
      </p>
      {showCreateButton && (onAdd || onShowCreateChange || createForm) && !filter && (
        <button className="create-button" onClick={handleOpenCreateForm}>
          <span className="button-icon">
            <Icon name="plus" size={20} />
          </span>
        </button>
      )}
    </div>
  );

  // Componente de carga por defecto
  const defaultLoadingComponent = (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Cargando datos...</p>
    </div>
  );

  // Determinar si hay acciones disponibles
  const hasActions = Boolean(
    onEdit ||
    onDelete ||
    onEditingChange ||
    onDeletingChange ||
    editForm ||
    deleteModal ||
    renderCustomActions
  );

  // Determinar si se debe mostrar la columna de acciones
  const shouldShowActionsColumn = showActionsColumn && hasActions;

  return (
    <>
      <div className={`generic-table-container ${className}`}>
        {/* Header con título y controles */}
        {showHeader && (
          <div className="table-header">
            <div className="header-info">
              <h2 className="table-title">{title}</h2>
              {description && (
                <p className="table-description">{description}</p>
              )}
            </div>
            <div className="header-left">
              {showCreateButton && (onAdd || onShowCreateChange || createForm) && (
                customCreateButton ? (
                  customCreateButton
                ) : (
                  <button
                    className="create-button"
                    onClick={handleOpenCreateForm}
                    disabled={loading}
                  >
                    <span className="button-icon">
                      <Icon name="plus" size={20} />
                    </span>
                  </button>
                ))}
            </div>

            <div className="header-right">
              <div className="header-controls-group">
                {filterComponent || (
                  showSearch && (
                    <div className="filter-group">
                      <input
                        type="text"
                        className="form-input search-input"
                        placeholder="Buscar..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        disabled={loading}
                      />
                      {filter && (
                        <button
                          className="clear-filter-btn"
                          onClick={() => setFilter("")}
                          title="Limpiar filtro"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                )}

                {showReloadButton && onReload && (
                  <button
                    className="reload-button"
                    onClick={onReload}
                    disabled={loading}
                    title="Recargar datos"
                  >
                    {loading ? (
                      <span
                        className="loading-spinner"
                        style={{ width: "16px", height: "16px" }}
                      />
                    ) : (
                      <Icon name="reload" size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <NotificationSnackbar />

        {/* Mensajes globales */}
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {error && <div className="message error">{error}</div>}

        {/* Información de resultados */}
        {data.length > 0 && (
          <div className="results-info">
            <span className="results-count">
              {sortedData.length} de {data.length} registros
            </span>
            {sortBy && (
              <span className="sort-info">
                Ordenado por: {columns.find((c) => c.key === sortBy)?.title} •
                {internalSortOrder === "asc" ? " Ascendente" : " Descendente"}
              </span>
            )}
          </div>
        )}

        {/* Tabla */}
        <div className="table-wrapper">
          {loading ? (
            loadingComponent || defaultLoadingComponent
          ) : paginatedData.length === 0 ? (
            emptyState || defaultEmptyState
          ) : (
            <>
              <table className="generic-table">
                <thead>
                  <tr>
                    {columns.map(renderHeaderCell)}

                    {/* Columna de acciones - CONDICIONAL */}
                    {shouldShowActionsColumn && (
                      <th
                        className="table-header-cell actions-header"
                        style={{ 
                          width: renderCustomActions ? "180px" : "120px",
                          textAlign: "center"
                        }}
                      >
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="table-row">
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className="table-cell"
                          style={{ textAlign: column.align || "left" }}
                        >
                          {renderCell(item, column)}
                        </td>
                      ))}

                      {/* Acciones - CONDICIONAL */}
                      {shouldShowActionsColumn && (
                        <td className="table-cell actions-cell">
                          <div 
                            className="table-actions"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "8px"
                            }}
                          >
                            {renderCustomActions ? (
                              renderCustomActions(item)
                            ) : (
                              <>
                                {(onEdit || onEditingChange || editForm) && (
                                  <button
                                    className="action-btns edit-btn-comp"
                                    onClick={() => handleStartEdit(item)}
                                    title="Editar"
                                    disabled={loading}
                                  >
                                    <Icon name="edit" size={18} />
                                  </button>
                                )}
                                {(onDelete ||
                                  onDeletingChange ||
                                  deleteModal) && (
                                  <button
                                    className="action-btns delete-btn-comp"
                                    onClick={() => handleStartDelete(item)}
                                    title="Eliminar"
                                    disabled={loading}
                                  >
                                    <Icon name="trash" size={18} />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              {showPagination && totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ◀ Anterior
                  </button>

                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Siguiente ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de creación */}
      {showCreateForm && createForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            {createForm({ onClose: handleCloseCreateForm })}
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingItem && editForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            {editForm({ item: editingItem, onClose: handleCloseEdit })}
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {deletingItem && deleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {deleteModal({ item: deletingItem, onClose: handleCloseDelete })}
          </div>
        </div>
      )}
    </>
  );
};

export default GenericTable;