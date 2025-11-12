import React, { useState, useEffect } from 'react';
import { useResponsible } from '../../../context/ResponsibleContext';

const ResponsibleFindAll: React.FC = () => {
  const { responsibles, fetchResponsibles, loading, error, clearError } = useResponsible();
  const [filter, setFilter] = useState('');
  const [filteredResponsibles, setFilteredResponsibles] = useState<any[]>([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Cargar automáticamente al montar el componente
  useEffect(() => {
    const loadData = async () => {
      if (!initialLoadDone) {
        clearError();
        try {
          await fetchResponsibles();
          setInitialLoadDone(true);
        } catch (err) {
          // El error ya está manejado en el contexto
        }
      }
    };
    
    loadData();
  }, [initialLoadDone, clearError, fetchResponsibles]);

  // Aplicar filtro y ordenar alfabéticamente por nombre
  useEffect(() => {
    let filtered = responsibles;
    
    // Aplicar filtro si existe
    if (filter) {
      filtered = responsibles.filter(resp => 
        resp.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    // Ordenar alfabéticamente por nombre
    const sorted = [...filtered].sort((a, b) => 
      a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );
    
    setFilteredResponsibles(sorted);
  }, [filter, responsibles]);

  const handleClearFilter = () => {
    setFilter('');
  };

  const handleReload = async () => {
    clearError();
    try {
      await fetchResponsibles();
    } catch (err) {
      // El error ya está manejado en el contexto
    }
  };

  const handleClearAll = () => {
    setFilter('');
    clearError();
  };

  return (
    <section id="responsible_findall" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Lista de responsables</h1>
          <p className="section-description">
            Vea todos los responsables registrados en el sistema
          </p>
        </div>
      </div>
      
      <div className="detail-card">
        {/* Mensajes */}
        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {/* Mostrar estado de carga */}
        {loading && (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            Cargando responsables...
          </div>
        )}

        {/* Filtro y lista - mostrar siempre */}
        <div className="form-group">
          <label htmlFor="filter" className="form-label">Filtrar por nombre</label>
          <div className="search-input-container">
            <input 
              type="text" 
              id="filter" 
              className="form-input"
              placeholder="Ej: Juan Pérez García"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              disabled={loading}
            />
            {filter && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={handleClearFilter}
                title="Limpiar filtro"
              >
                ×
              </button>
            )}
          </div>
          <div className="search-hint">
            Ingrese el nombre completo o parcial del responsable
          </div>
        </div>

        {/* Contador de resultados */}
        {initialLoadDone && !loading && (
          <div className="results-count">
            Mostrando {filteredResponsibles.length} de {responsibles.length} responsables
            <span className="sort-info"></span>
          </div>
        )}

        {/* Lista de responsables */}
        {initialLoadDone && !loading && filteredResponsibles.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">❌</div>
            <p>
              {filter 
                ? `No se encontraron responsables que coincidan con "${filter}"`
                : 'No hay responsables registrados en el sistema'
              }
            </p>
            {filter && (
              <button 
                type="button" 
                className="clear-search-btn secondary"
                onClick={handleClearFilter}
              >
                Limpiar filtro
              </button>
            )}
          </div>
        ) : initialLoadDone && !loading ? (
          <div className="responsibles-list">
            <h3>Responsables:</h3>
            <div className="results-list">
              {filteredResponsibles.map((responsible) => (
                <div key={responsible.id} className="result-item">
                  <div className="responsible-info">
                    <strong>ID:</strong> {responsible.id}
                  </div>
                  <div className="responsible-info">
                    <strong>Nombre:</strong> {responsible.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Botón para recargar */}
        <div className="action-buttons">
          <button 
            type="button" 
            className="submit-button reload-button"
            onClick={handleReload}
            disabled={loading}
          >
            {loading ? 'Recargando...' : 'Recargar Lista'}
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={handleClearAll}
            disabled={loading}
          >
            Limpiar Filtro
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResponsibleFindAll;