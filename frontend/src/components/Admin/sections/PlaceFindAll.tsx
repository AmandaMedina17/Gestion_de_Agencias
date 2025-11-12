import React, { useState, useEffect } from 'react';
import { usePlace } from '../../../context/PlaceContext';

const PlaceFindAll: React.FC = () => {
  const { places, fetchPlaces, loading, error, clearError } = usePlace();
  const [filter, setFilter] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Cargar automáticamente al montar el componente
  useEffect(() => {
    const loadData = async () => {
      if (!initialLoadDone) {
        clearError();
        try {
          await fetchPlaces();
          setInitialLoadDone(true);
        } catch (err) {
          // El error ya está manejado en el contexto
        }
      }
    };
    
    loadData();
  }, [initialLoadDone, clearError, fetchPlaces]);

  // Aplicar filtro cuando cambia el texto de filtro o la lista de lugares
  useEffect(() => {
    let filtered = places;

    // Aplicar filtro si existe
    if (filter) {
      filtered = places.filter(resp => 
        resp.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    // Ordenar alfabéticamente por nombre
    const sorted = [...filtered].sort((a, b) => 
      a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );
    
    setFilteredPlaces(sorted);
  }, [filter, places]);

  const handleClearFilter = () => {
    setFilter('');
  };

  const handleReload = async () => {
    clearError();
    try {
      await fetchPlaces();
    } catch (err) {
      // El error ya está manejado en el contexto
    }
  };

  const handleClearAll = () => {
    setFilter('');
    clearError();
  };

  return (
    <section id="place_findall" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Lista de Lugares</h1>
          <p className="section-description">
            Vea todos los lugares registrados en el sistema
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
            Cargando lugares...
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
              placeholder="Ej: Universidad de La Habana"
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
            Ingrese el nombre completo o parcial del lugar
          </div>
        </div>

        {/* Contador de resultados */}
        {initialLoadDone && !loading && (
          <div className="results-count">
            Mostrando {filteredPlaces.length} de {places.length} lugares
          </div>
        )}

        {/* Lista de lugares */}
        {initialLoadDone && !loading && filteredPlaces.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">❌</div>
            <p>
              {filter 
                ? `No se encontraron lugares que coincidan con "${filter}"`
                : 'No hay lugares registrados en el sistema'
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
          <div className="places-list">
            <h3>Lugares:</h3>
            <div className="results-list">
              {filteredPlaces.map((place) => (
                <div key={place.id} className="result-item">
                  <div className="place-info">
                    <strong>ID:</strong> {place.id}
                  </div>
                  <div className="place-info">
                    <strong>Nombre:</strong> {place.name}
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

export default PlaceFindAll;