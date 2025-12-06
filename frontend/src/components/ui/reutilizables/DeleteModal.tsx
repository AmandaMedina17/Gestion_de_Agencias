import React from "react";
import { Icon } from "../../icons";

export interface DeleteModalProps<T> {
  title: string;
  item: T;
  itemName?: string;
  itemId: string | number;
  onConfirm: (id: string | number) => Promise<void> | void;
  onClose: () => void;
  loading?: boolean;
  error?: string;
  confirmText?: string;
  cancelText?: string;
  warningMessage?: string;
  renderDetails?: (item: T) => React.ReactNode;
  getItemName?: (item: T) => string;
}

const DeleteModal = <T extends Record<string, any>>({
  title,
  item,
  itemName,
  itemId,
  onConfirm,
  onClose,
  loading = false,
  error,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  warningMessage = "⚠️ Esta acción no se puede deshacer.",
  renderDetails,
  getItemName
}: DeleteModalProps<T>) => {
  const handleConfirm = async () => {
    await onConfirm(itemId);
  };

  const displayName = itemName || 
    (getItemName ? getItemName(item) : 
    (item.fullName || item.name || item.title || "este elemento"));

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        
        <div className="delete-confirmation">
          <p>¿Está seguro de que desea eliminar <strong>{displayName}</strong>?</p>
          
          {renderDetails ? (
            renderDetails(item)
          ) : (
            <div className="item-details">
              <div className="detail-item">
                <strong>ID:</strong> {itemId}
              </div>
              {item.createdAt && (
                <div className="detail-item">
                  <strong>Creado:</strong> {new Date(item.createdAt).toLocaleDateString()}
                </div>
              )}
              {item.updatedAt && (
                <div className="detail-item">
                  <strong>Actualizado:</strong> {new Date(item.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
          
          <p className="warning-text">
            {warningMessage}
          </p>
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <div className="modal-actions">
          <button
            className="submit-button delete-button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Eliminando...
              </>
            ) : (
              <>
                <Icon name="trash" size={18} />
                {confirmText}
              </>
            )}
          </button>
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            <Icon name="close" size={18} />
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;