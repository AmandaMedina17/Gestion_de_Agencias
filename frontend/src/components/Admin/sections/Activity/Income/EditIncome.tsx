import React, { useState, useEffect, useRef } from 'react';
import { useIncome } from '../../../../../context/IncomeContext';
import { useResponsible } from '../../../../../context/ResponsibleContext';
import { IncomeResponseDto } from '../../../../../../../backend/src/ApplicationLayer/DTOs/incomeDto/response-income.dto';
import { CreateIncomeDto } from '../../../../../../../backend/src/ApplicationLayer/DTOs/incomeDto/create-income.dto';
import './IncomeStyle.css';

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

interface EditIncomeModalProps {
  show: boolean;
  onClose: () => void;
  incomeToEdit: IncomeResponseDto;
  activityId: string;
  activityName: string;
}

const EditIncomeModal: React.FC<EditIncomeModalProps> = ({ 
  show, 
  onClose, 
  incomeToEdit,
  activityId,
  activityName
}) => {
  const { updateIncome, loading, error, clearError } = useIncome();
  const { responsibles, fetchResponsibles } = useResponsible();
  
  // Estados para el dropdown de responsables
  const [showResponsibleDropdown, setShowResponsibleDropdown] = useState(false);
  const [selectedResponsibleName, setSelectedResponsibleName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const responsibleDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Formatear la fecha del ingreso para el input date (YYYY-MM-DD)
  const incomeDate = new Date(incomeToEdit.date);
  const formattedDate = incomeDate.toISOString().split('T')[0];

  const [editedIncome, setEditedIncome] = useState<Omit<CreateIncomeDto, 'date'> & { date: string }>({
    type: incomeToEdit.incomeType,
    mount: incomeToEdit.mount,
    date: formattedDate,
    responsible: incomeToEdit.responsible,
    activityId: incomeToEdit.activityId,
  });

  // Función para obtener el nombre del responsable por ID
  const getResponsibleName = (responsibleId: string) => {
    const responsible = responsibles.find(r => r.id === responsibleId);
    return responsible ? responsible.name : responsibleId;
  };

  // Cargar responsables al montar el modal
  useEffect(() => {
    if (show) {
      fetchResponsibles();
    }
  }, [show]);

  // Inicializar el nombre del responsable cuando se cargan los responsables
  useEffect(() => {
    if (responsibles.length > 0 && incomeToEdit) {
      const responsibleName = getResponsibleName(incomeToEdit.responsible);
      setSelectedResponsibleName(responsibleName);
      setSearchTerm(responsibleName);
    }
  }, [responsibles, incomeToEdit]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (responsibleDropdownRef.current && !responsibleDropdownRef.current.contains(event.target as Node)) {
        setShowResponsibleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrar responsables basado en el término de búsqueda
  const filteredResponsibles = responsibles.filter(responsible =>
    responsible.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      const updateDto: CreateIncomeDto = {
        ...editedIncome,
        date: new Date(editedIncome.date)
      };
      
      await updateIncome(incomeToEdit.id, updateDto);
      
      
      onClose();
    } catch (err) {
      console.error('Error al actualizar ingreso:', err);
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Manejar selección de responsable desde el dropdown
  const handleResponsibleSelect = (responsibleId: string, responsibleName: string) => {
    setEditedIncome(prev => ({
      ...prev,
      responsible: responsibleId
    }));
    setSelectedResponsibleName(responsibleName);
    setSearchTerm(responsibleName);
    setShowResponsibleDropdown(false);
  };

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedResponsibleName(value);
    // Si el usuario escribe, guardamos el texto como responsable
    setEditedIncome(prev => ({
      ...prev,
      responsible: value
    }));
    
    // Mostrar dropdown si hay texto
    if (value.trim() && !showResponsibleDropdown) {
      setShowResponsibleDropdown(true);
    }
  };

  // Manejar clic en el input para escribir
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    // No abrir dropdown automáticamente, permitir escribir
    if (searchTerm.trim() && responsibles.length > 0) {
      setShowResponsibleDropdown(true);
    }
  };

  // Manejar clic en el botón de flecha para abrir/cerrar dropdown
  const handleToggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (responsibles.length > 0) {
      setShowResponsibleDropdown(!showResponsibleDropdown);
    }
    // Enfocar el input si está cerrado
    if (!showResponsibleDropdown && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Manejar tecla Enter en el input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Si hay resultados filtrados, seleccionar el primero
      if (filteredResponsibles.length > 0) {
        const firstResponsible = filteredResponsibles[0];
        handleResponsibleSelect(firstResponsible.id, firstResponsible.name);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay edit-income-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Editar Ingreso</h3>
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

        <div className="activity-info-card">
          <h4>Actividad asociada</h4>
          <div className="activity-info-details">
            <div className="activity-info-item">
              <strong></strong> {activityName}
            </div>
            
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de Ingreso *</label>
              <select
                className="form-select"
                value={editedIncome.type}
                onChange={(e) =>
                  setEditedIncome({
                    ...editedIncome,
                    type: e.target.value as IncomeType,
                  })
                }
                required
              >
                <option value={IncomeType.OTRO}>Otro</option>
                <option value={IncomeType.CHEQUE}>Cheque</option>
                <option value={IncomeType.DEPOSITO}>Deposito</option>
                <option value={IncomeType.EFECTIVO}>Efectivo</option>
                <option value={IncomeType.MONEDA_DIGITAL}>Moneda digital</option>
                <option value={IncomeType.PAYPAL}>Paypal</option>
                <option value={IncomeType.TARJETA_CREDITO}>Tarjeta de credito</option>
                <option value={IncomeType.TARJETA_DEBITO}>Tarjeta de debito</option>
                <option value={IncomeType.TRANSFERENCIA_BANCARIA}>Transferencia bancaria</option>
                <option value={IncomeType.TRANSFERENCIA_ELECTRONICA}>Transferencia electronica</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monto *</label>
              <div className="amount-input-container">
                <span className="currency-symbol">$&nbsp;</span>
                <input
                  type="text"
                  className="form-input amount-input"
                  placeholder="0.00"
                  value={editedIncome.mount || ''}
                  onChange={(e) =>
                    setEditedIncome({
                      ...editedIncome,
                      mount: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  min="0"
                  style={{ paddingLeft: '0.6cm' }} 
                />
                <span className="currency-text">USD</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input
                type="date"
                className="form-input"
                value={editedIncome.date}
                onChange={(e) =>
                  setEditedIncome({
                    ...editedIncome,
                    date: e.target.value,
                  })
                }
                required
                min={getTodayDate()}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Responsable *</label>
              <div className="dropdown-container" ref={responsibleDropdownRef}>
                <div className="responsible-input-container">
                  <input
                    ref={inputRef}
                    type="text"
                    className="form-input"
                    placeholder="Escriba un responsable o seleccione de la lista"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={handleInputClick}
                    onKeyDown={handleInputKeyDown}
                    required
                  />
                  <button
                    type="button"
                    className="dropdown-toggle-btn"
                    onClick={handleToggleDropdown}
                    disabled={responsibles.length === 0}
                    title={responsibles.length === 0 ? "No hay responsables disponibles" : "Mostrar lista de responsables"}
                  >
                    {showResponsibleDropdown ? '▲' : '▼'}
                  </button>
                </div>
                
                {showResponsibleDropdown && responsibles.length > 0 && (
                  <div className="dropdown-menu">
                    
                    <div className="dropdown-list">
                      {filteredResponsibles.length > 0 ? (
                        filteredResponsibles.map((responsible) => (
                          <div 
                            key={responsible.id} 
                            className="dropdown-item"
                            onClick={() => handleResponsibleSelect(responsible.id, responsible.name)}
                          >
                            <div className="responsible-info">
                              <span className="responsible-name">{responsible.name}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="dropdown-empty">
                          No se encontraron responsables con "{searchTerm}"
                        </div>
                      )}
                    </div>
    
                  </div>
                )}
              </div>
             
            </div>
          </div>

          <div className="modal-actions">
            <div className="action-buttons-left">
              <button
                type="submit"
                className="submit-buttonincome"
                disabled={
                  loading ||
                  !editedIncome.type ||
                  !editedIncome.mount ||
                  !editedIncome.date ||
                  !editedIncome.responsible
                }
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Ingreso'
                )}
              </button>
            </div>
            <div className="action-buttons-right">
              <button
                type="button"
                className="skip-button"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncomeModal;