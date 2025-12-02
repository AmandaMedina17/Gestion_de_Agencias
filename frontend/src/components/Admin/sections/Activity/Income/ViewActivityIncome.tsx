import React, { useState, useEffect } from 'react';
import { useIncome } from '../../../../../context/IncomeContext';
import { useResponsible } from '../../../../../context/ResponsibleContext'; // Importar el contexto de responsables
import { IncomeResponseDto } from '../../../../../../../backend/src/ApplicationLayer/DTOs/incomeDto/response-income.dto';
import { Icon } from '../../../../icons';
import EditIncomeModal from './EditIncome';
import './IncomeStyle.css';

interface ViewActivityIncomesModalProps {
  show: boolean;
  onClose: () => void;
  activityId: string;
  activityName: string;
}

export enum IncomeType {
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA',
  TARJETA_CREDITO = 'TARJETA_CREDITO', 
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  CHEQUE = 'CHEQUE',
  DEPOSITO = 'DEPOSITO',
  MONEDA_DIGITAL = 'MONEDA_DIGITAL',
  PAYPAL = 'PAYPAL',
  TRANSFERENCIA_ELECTRONICA = 'TRANSFERENCIA_ELECTRONICA',
  OTRO = 'OTRO'
}

const ViewActivityIncomesModal: React.FC<ViewActivityIncomesModalProps> = ({ 
  show, 
  onClose, 
  activityId,
  activityName
}) => {
  const { incomes, fetchIncomes, loading, error, clearError } = useIncome();
  const { responsibles, fetchResponsibles } = useResponsible(); // Agregar el contexto de responsables
  const [activityIncomes, setActivityIncomes] = useState<IncomeResponseDto[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedIncome, setSelectedIncome] = useState<IncomeResponseDto | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Función para obtener el nombre del responsable por ID
  const getResponsibleName = (responsibleId: string) => {
    const responsible = responsibles.find(r => r.id === responsibleId);
    return responsible ? responsible.name : responsibleId; // Si no se encuentra, devuelve el ID
  };

  // Función para obtener el texto del tipo de ingreso
  const getIncomeTypeText = (type: IncomeType) => {
    const typeMap = {
      [IncomeType.CHEQUE]: "Cheque",
      [IncomeType.DEPOSITO]: "Depósito",
      [IncomeType.EFECTIVO]: "Efectivo",
      [IncomeType.MONEDA_DIGITAL]: "Moneda Digital",
      [IncomeType.OTRO]: "Otro",
      [IncomeType.PAYPAL]: "PayPal",
      [IncomeType.TARJETA_CREDITO]: "Tarjeta de Crédito",
      [IncomeType.TARJETA_DEBITO]: "Tarjeta de Débito",
      [IncomeType.TRANSFERENCIA_BANCARIA]: "Transferencia Bancaria",
      [IncomeType.TRANSFERENCIA_ELECTRONICA]: "Transferencia Electrónica",
    };
    return typeMap[type] || type;
  };

  // Formatear fecha
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Cargar ingresos y responsables al abrir el modal
  useEffect(() => {
    if (show) {
      fetchIncomes();
      fetchResponsibles(); // Cargar responsables
    }
  }, [show]);

  // Filtrar ingresos por actividad y calcular total
  useEffect(() => {
    if (incomes.length > 0) {
      const filtered = incomes.filter(income => income.activityId === activityId);
      setActivityIncomes(filtered);
      
      // Calcular total
      const total = filtered.reduce((sum, income) => sum + income.mount, 0);
      setTotalAmount(total);
    } else {
      setActivityIncomes([]);
      setTotalAmount(0);
    }
  }, [incomes, activityId]);

  const handleClose = () => {
    clearError();
    onClose();
  };

  const handleEditIncome = (income: IncomeResponseDto) => {
    setSelectedIncome(income);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedIncome(null);
    // Recargar ingresos para reflejar cambios
    fetchIncomes();
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay incomes-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Ingresos de la Actividad</h3>
            <button 
              className="close-button" 
              onClick={handleClose}
              disabled={loading}
              title="Cerrar"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button className="clear-error-btn" onClick={clearError}>×</button>
            </div>
          )}

          <div className="activity-summary-card">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Actividad:</span>
                <span className="summary-value">{activityName}</span>
              </div>
              
            </div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando ingresos...</p>
            </div>
          ) : activityIncomes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <h4>No hay ingresos registrados</h4>
              <p>Esta actividad no tiene ingresos registrados aún.</p>
            </div>
          ) : (
            <div className="incomes-table-container">
              <table className="incomes-table">
                <thead>
                  <tr>
                    <th>Tipo de Ingreso</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Responsable</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {activityIncomes.map((income) => (
                    <tr key={income.id} className="income-row">
                      <td>
                        <span className={`income-type-badge`}>
                          {getIncomeTypeText(income.incomeType)}
                        </span>
                      </td>
                      <td>
                        <span className="income-amount">
                          {formatCurrency(income.mount)}
                        </span>
                      </td>
                      <td>
                        <span className="income-date">
                          {formatDate(income.date)}
                        </span>
                      </td>
                      <td>
                        <span className="income-responsible">
                          {getResponsibleName(income.responsible)} 
                        </span>
                      </td>
                      <td>
                        <div className="income-actions">
                          <button
                            className="action-btn edit-btn-inc"
                            title="Editar ingreso"
                            onClick={() => handleEditIncome(income)}
                          >
                            <Icon name="edit" size={16} />
                          </button>

                          <button
                            className="action-btn delete-btn-inc"
                            title="Eliminar ingreso"
                            onClick={() => {
                              if (window.confirm(`¿Está seguro de eliminar el ingreso de ${formatCurrency(income.mount)}?`)) {
                              }
                            }}
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición de ingreso */}
      {showEditModal && selectedIncome && (
        <EditIncomeModal
          show={showEditModal}
          onClose={handleEditModalClose}
          incomeToEdit={selectedIncome}
          activityId={activityId}
          activityName={activityName}
        />
      )}
    </>
  );
};

export default ViewActivityIncomesModal;