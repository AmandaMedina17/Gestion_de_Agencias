import React, { useState, useEffect } from 'react';
//import { useApprentice } from '../../../context/ApprenticeContext';
import {ApprenticeStatus, ApprenticeTrainingLevel} from '../..//../../../backend/src/DomainLayer/Enums'
import './ApprenticeManager.css';

const ApprenticeManagement: React.FC = () => {
  // const { 
  //   apprentices, 
  //   fetchApprentices, 
  //   createApprentice, 
  //   updateApprentice, 
  //   deleteApprentice, 
  //   loading, 
  //   error, 
  //   clearError 
  // } = useApprentice();

  // Estados principales
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'entryDate' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingApprentice, setEditingApprentice] = useState<any>(null);
  const [deletingApprentice, setDeletingApprentice] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Estados del formulario
  const [newApprentice, setNewApprentice] = useState({
    fullName: '',
    age: '',
    entryDate: '',
    status: ApprenticeStatus.EN_ENTRENAMIENTO,
    trainingLevel: ApprenticeTrainingLevel.PRINCIPIANTE,
    agencyId: ''
  });

  const [editApprentice, setEditApprentice] = useState({
    fullName: '',
    age: '',
    entryDate: '',
    status: ApprenticeStatus.EN_ENTRENAMIENTO,
    trainingLevel: ApprenticeTrainingLevel.PRINCIPIANTE,
    agencyId: ''
  });

  // Cargar aprendices solo cuando se monta el componente
  // useEffect(() => {
  //   const loadInitialData = async () => {
  //     if (!dataLoaded) {
  //       clearError();
  //       try {
  //         await fetchApprentices();
  //         setDataLoaded(true);
  //       } catch (err) {
  //         console.error('Error loading initial data:', err);
  //       }
  //     }
  //   };

  //   loadInitialData();
  // }, [dataLoaded]);

  // Filtrar y ordenar aprendices
  // const filteredAndSortedApprentices = React.useMemo(() => {
  //   if (!dataLoaded) return [];

  //   let filtered = apprentices;
    
  //   // Aplicar filtro por nombre
  //   if (filter) {
  //     filtered = apprentices.filter(apprentice => 
  //       apprentice.fullName.toLowerCase().includes(filter.toLowerCase())
  //     );
  //   }
    
  //   // Aplicar ordenamiento
  //   const sorted = [...filtered].sort((a, b) => {
  //     let aValue, bValue;
      
  //     switch (sortBy) {
  //       case 'name':
  //         aValue = a.fullName;
  //         bValue = b.fullName;
  //         break;
  //       case 'age':
  //         aValue = a.age;
  //         bValue = b.age;
  //         break;
  //       case 'entryDate':
  //         aValue = new Date(a.entryDate);
  //         bValue = new Date(b.entryDate);
  //         break;
  //       case 'status':
  //         aValue = a.status;
  //         bValue = b.status;
  //         break;
  //       default:
  //         aValue = a.fullName;
  //         bValue = b.fullName;
  //     }
      
  //     if (sortOrder === 'asc') {
  //       return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  //     } else {
  //       return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  //     }
  //   });
    
  //   return sorted;
  // }, [apprentices, filter, sortBy, sortOrder, dataLoaded]);

  // // Manejar creación de aprendiz
  // const handleCreate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   clearError();
  //   setMessage(null);

  //   if (!newApprentice.fullName.trim() || !newApprentice.age || !newApprentice.entryDate) {
  //     setMessage({ type: 'error', text: 'Por favor, complete todos los campos obligatorios' });
  //     return;
  //   }

  //   try {
  //     await createApprentice({
  //       ...newApprentice,
  //       age: parseInt(newApprentice.age),
  //       entryDate: new Date(newApprentice.entryDate)
  //     });
      
  //     setMessage({ 
  //       type: 'success', 
  //       text: `Aprendiz "${newApprentice.fullName}" creado exitosamente` 
  //     });
      
  //     // Resetear formulario
  //     setNewApprentice({
  //       fullName: '',
  //       age: '',
  //       entryDate: '',
  //       status: ApprenticeStatus.EN_ENTRENAMIENTO,
  //       trainingLevel: ApprenticeTrainingLevel.PRINCIPIANTE,
  //       agencyId: ''
  //     });
      
  //     setShowCreateForm(false);
  //     await fetchApprentices();
      
  //     setTimeout(() => setMessage(null), 5000);
  //   } catch (err: any) {
  //     setMessage({ 
  //       type: 'error', 
  //       text: err.message || 'Error al crear el aprendiz' 
  //     });
  //   }
  // };

  // // Manejar actualización de aprendiz
  // const handleUpdate = async () => {
  //   if (!editingApprentice || !editApprentice.fullName.trim() || !editApprentice.age || !editApprentice.entryDate) {
  //     return;
  //   }

  //   try {
  //     await updateApprentice(editingApprentice.id, {
  //       ...editApprentice,
  //       age: parseInt(editApprentice.age),
  //       entryDate: new Date(editApprentice.entryDate)
  //     });
      
  //     setMessage({ 
  //       type: 'success', 
  //       text: `Aprendiz actualizado exitosamente` 
  //     });
      
  //     setEditingApprentice(null);
  //     setEditApprentice({
  //       fullName: '',
  //       age: '',
  //       entryDate: '',
  //       status: ApprenticeStatus.EN_ENTRENAMIENTO,
  //       trainingLevel: ApprenticeTrainingLevel.PRINCIPIANTE,
  //       agencyId: ''
  //     });
      
  //     await fetchApprentices();
  //     setTimeout(() => setMessage(null), 5000);
  //   } catch (err: any) {
  //     setMessage({ 
  //       type: 'error', 
  //       text: err.message || 'Error al actualizar el aprendiz' 
  //     });
  //   }
  // };

  // // Manejar eliminación de aprendiz
  // const handleDelete = async () => {
  //   if (!deletingApprentice) {
  //     return;
  //   }

  //   try {
  //     await deleteApprentice(deletingApprentice.id);
  //     setMessage({ 
  //       type: 'success', 
  //       text: `Aprendiz "${deletingApprentice.fullName}" eliminado exitosamente` 
  //     });
  //     setDeletingApprentice(null);
  //     await fetchApprentices();
  //     setTimeout(() => setMessage(null), 5000);
  //   } catch (err: any) {
  //     setMessage({ 
  //       type: 'error', 
  //       text: err.message || 'Error al eliminar el aprendiz' 
  //     });
  //   }
  // };

  // Recargar datos manualmente
  // const handleReload = async () => {
  //   clearError();
  //   try {
  //     await fetchApprentices();
  //     setMessage({ 
  //       type: 'success', 
  //       text: 'Datos actualizados correctamente' 
  //     });
  //     setTimeout(() => setMessage(null), 3000);
  //   } catch (err: any) {
  //     setMessage({ 
  //       type: 'error', 
  //       text: err.message || 'Error al recargar los datos' 
  //     });
  //   }
  // };

  // Iniciar edición
  const startEdit = (apprentice: any) => {
    setEditingApprentice(apprentice);
    setEditApprentice({
      fullName: apprentice.fullName,
      age: apprentice.age.toString(),
      entryDate: apprentice.entryDate.split('T')[0], // Formato YYYY-MM-DD
      status: apprentice.status,
      trainingLevel: apprentice.trainingLevel,
      agencyId: apprentice.agencyId || ''
    });
  };

  // Iniciar eliminación
  const startDelete = (apprentice: any) => {
    setDeletingApprentice(apprentice);
  };

  // Limpiar filtro
  const handleClearFilter = () => {
    setFilter('');
  };

  // Alternar ordenamiento
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Traducir estados y niveles
  const getStatusText = (status: ApprenticeStatus) => {
    const statusMap = {
      [ApprenticeStatus.EN_ENTRENAMIENTO]: 'En Entrenamiento',
      [ApprenticeStatus.PROCESO_DE_SELECCION]: 'Proceso de selección',
      [ApprenticeStatus.TRANSFERIDO]: 'Transferido'
    };
    return statusMap[status] || status;
  };

  const getTrainingLevelText = (level: ApprenticeTrainingLevel) => {
    const levelMap = {
      [ApprenticeTrainingLevel.PRINCIPIANTE]: 'Principiante',
      [ApprenticeTrainingLevel.INTERMEDIO]: 'Intermedio',
      [ApprenticeTrainingLevel.AVANZADO]: 'Avanzado'
    };
    return levelMap[level] || level;
  };

  return (
    <section id="apprentice_manager" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Aprendices</h1>
          <p className="section-description">
            Administre todos los aprendices del sistema en una sola vista
          </p>
        </div>
      </div>
      
      <div className="detail-card">
        {/* Mensajes globales */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* {error && (
          <div className="message error">
            {error}
          </div>
        )} */}

        {/* Controles superiores */}
        <div className="manager-controls">
          <div className="controls-left">
            <button 
              className="create-button"
              onClick={() => setShowCreateForm(true)}
              ////disabled={loading}
            >
              <span className="button-icon">+</span>
              Nuevo Aprendiz
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input 
                type="text" 
                className="form-input search-input"
                placeholder="Filtrar por nombre..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                ////disabled={loading}
              />
              {filter && (
                <button 
                  className="clear-filter-btn"
                  onClick={handleClearFilter}
                  title="Limpiar filtro"
                >
                  ×
                </button>
              )}
            </div>

            <div className="sort-group">
              <select 
                className="form-select sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                ////disabled={loading}
              >
                <option value="name">Ordenar por nombre</option>
                <option value="age">Ordenar por edad</option>
                <option value="entryDate">Ordenar por fecha ingreso</option>
                <option value="status">Ordenar por estado</option>
              </select>
              <button 
                className="sort-order-btn"
                onClick={toggleSortOrder}
                //disabled={loading}
                title={sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            <button 
              className="reload-button"
              //onClick={handleReload}
              //disabled={loading}
              title="Recargar datos"
            >
              '⟳'
            </button>
          </div>
        </div>

        {/* Contador de resultados */}
        {dataLoaded && (
          <div className="results-info">
            {/* <span className="results-count">
              {filteredAndSortedApprentices.length} de {apprentices.length} aprendices
            </span> */}
            <span className="sort-info">
              Orden: {sortBy === 'name' ? 'Nombre' : 
                     sortBy === 'age' ? 'Edad' : 
                     sortBy === 'entryDate' ? 'Fecha Ingreso' : 'Estado'} • 
              {sortOrder === 'asc' ? ' Ascendente' : ' Descendente'}
            </span>
          </div>
        )}

        {/* Grid de aprendices */}
        <div className="apprentices-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando aprendices...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedApprentices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h3>No hay aprendices</h3>
              <p>
                {filter 
                  ? `No se encontraron resultados para "${filter}"`
                  : 'Comience agregando el primer aprendiz'
                }
              </p>
              {!filter && (
                <button 
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  <span className="button-icon">+</span>
                  Crear Primer Aprendiz
                </button>
              )}
            </div>
          ) : (
            <div className="grid-container">
              {filteredAndSortedApprentices.map((apprentice) => (
                <div key={apprentice.id} className="apprentice-card">
                  <div className="apprentice-info">
                    <div className="apprentice-name">{apprentice.fullName}</div>
                    <div className="apprentice-details">
                      <div className="detail-row">
                        <span className="detail-label">Edad:</span>
                        <span className="detail-value">{apprentice.age} años</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Fecha Ingreso:</span>
                        <span className="detail-value">{formatDate(apprentice.entryDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Estado:</span>
                        <span className={`status-badge status-${apprentice.status.toLowerCase()}`}>
                          {getStatusText(apprentice.status)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Nivel:</span>
                        <span className="detail-value">{getTrainingLevelText(apprentice.trainingLevel)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="apprentice-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => startEdit(apprentice)}
                      title="Editar aprendiz"
                      //disabled={loading}
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => startDelete(apprentice)}
                      title="Eliminar aprendiz"
                      //disabled={loading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de creación */}
        {showCreateForm && (
          <div className="modal-overlay apprentice-modal">
            <div className="modal-content">
              <h3>Crear Nuevo Aprendiz</h3>
              <form onSubmit={handleCreate}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre completo *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Ej: Juan Pérez García"
                      value={newApprentice.fullName}
                      onChange={(e) => setNewApprentice({...newApprentice, fullName: e.target.value})}
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Edad *</label>
                    <input 
                      type="number" 
                      className="form-input"
                      placeholder="Ej: 25"
                      value={newApprentice.age}
                      onChange={(e) => setNewApprentice({...newApprentice, age: e.target.value})}
                      required
                      min="16"
                      max="100"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fecha de ingreso *</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={newApprentice.entryDate}
                      onChange={(e) => setNewApprentice({...newApprentice, entryDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select 
                      className="form-select"
                      value={newApprentice.status}
                      onChange={(e) => setNewApprentice({...newApprentice, status: e.target.value as ApprenticeStatus})}
                    >
                      <option value={ApprenticeStatus.EN_ENTRENAMIENTO}>En entrenamiento</option>
                      <option value={ApprenticeStatus.PROCESO_DE_SELECCION}>Proceso de selección</option>
                      <option value={ApprenticeStatus.TRANSFERIDO}>Transferido</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nivel de entrenamiento</label>
                    <select 
                      className="form-select"
                      value={newApprentice.trainingLevel}
                      onChange={(e) => setNewApprentice({...newApprentice, trainingLevel: e.target.value as ApprenticeTrainingLevel})}
                    >
                      <option value={ApprenticeTrainingLevel.PRINCIPIANTE}>Principiante</option>
                      <option value={ApprenticeTrainingLevel.INTERMEDIO}>Intermedio</option>
                      <option value={ApprenticeTrainingLevel.AVANZADO}>Avanzado</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">ID de Agencia</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Opcional"
                      value={newApprentice.agencyId}
                      onChange={(e) => setNewApprentice({...newApprentice, agencyId: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading || !newApprentice.fullName.trim() || !newApprentice.age || !newApprentice.entryDate}
                  >
                    {loading ? 'Creando...' : 'Crear Aprendiz'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewApprentice({
                        fullName: '',
                        age: '',
                        entryDate: '',
                        status: ApprenticeStatus.EN_ENTRENAMIENTO,
                        trainingLevel: ApprenticeTrainingLevel.PRINCIPIANTE,
                        agencyId: ''
                      });
                    }}
                    //disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {editingApprentice && (
          <div className="modal-overlay apprentice-modal">
            <div className="modal-content">
              <h3>Editar Aprendiz</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre completo *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={editApprentice.fullName}
                    onChange={(e) => setEditApprentice({...editApprentice, fullName: e.target.value})}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Edad *</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={editApprentice.age}
                    onChange={(e) => setEditApprentice({...editApprentice, age: e.target.value})}
                    required
                    min="16"
                    max="100"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha de ingreso *</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={editApprentice.entryDate}
                    onChange={(e) => setEditApprentice({...editApprentice, entryDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select 
                    className="form-select"
                    value={editApprentice.status}
                    onChange={(e) => setEditApprentice({...editApprentice, status: e.target.value as ApprenticeStatus})}
                  >
                    <option value={ApprenticeStatus.EN_ENTRENAMIENTO}>En entrenamiento</option>
                    <option value={ApprenticeStatus.PROCESO_DE_SELECCION}>Proceso de selección</option>
                    <option value={ApprenticeStatus.TRANSFERIDO}>Transferido</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nivel de entrenamiento</label>
                  <select 
                    className="form-select"
                    value={editApprentice.trainingLevel}
                    onChange={(e) => setEditApprentice({...editApprentice, trainingLevel: e.target.value as ApprenticeTrainingLevel})}
                  >
                    <option value={ApprenticeTrainingLevel.PRINCIPIANTE}>Principiante</option>
                    <option value={ApprenticeTrainingLevel.INTERMEDIO}>Intermedio</option>
                    <option value={ApprenticeTrainingLevel.AVANZADO}>Avanzado</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">ID de Agencia</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={editApprentice.agencyId}
                    onChange={(e) => setEditApprentice({...editApprentice, agencyId: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="submit-button"
                  onClick={handleUpdate}
                  disabled={loading || !editApprentice.fullName.trim() || !editApprentice.age || !editApprentice.entryDate}
                >
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => {
                    setEditingApprentice(null);
                    setEditApprentice({
                      fullName: '',
                      age: '',
                      entryDate: '',
                      status: ApprenticeStatus.EN_ENTRENAMIENTO,
                      trainingLevel: ApprenticeTrainingLevel.PRINCIPIANTE,
                      agencyId: ''
                    });
                  }}
                  //disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {deletingApprentice && (
          <div className="modal-overlay apprentice-modal">
            <div className="modal-content">
              <h3>¿Eliminar Aprendiz?</h3>
              <div className="delete-confirmation">
                <p>¿Está seguro de que desea eliminar este aprendiz?</p>
                <div className="apprentice-details">
                  <div className="detail-item">
                    <strong>Nombre:</strong> {deletingApprentice.fullName}
                  </div>
                  <div className="detail-item">
                    <strong>Edad:</strong> {deletingApprentice.age} años
                  </div>
                  <div className="detail-item">
                    <strong>Fecha de ingreso:</strong> {formatDate(deletingApprentice.entryDate)}
                  </div>
                  <div className="detail-item">
                    <strong>Estado:</strong> {getStatusText(deletingApprentice.status)}
                  </div>
                </div>
                <p className="warning-text">
                  ⚠️ Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="modal-actions">
                <button 
                  className="submit-button delete-button"
                  onClick={handleDelete}
                  //disabled={loading}
                >
                  {loading ? 'Eliminando...' : 'Sí, Eliminar'}
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => setDeletingApprentice(null)}
                  //disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApprenticeManagement;