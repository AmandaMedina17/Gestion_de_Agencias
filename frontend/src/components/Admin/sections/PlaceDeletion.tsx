import React, { useState } from 'react';
import { usePlace } from '../../../context/PlaceContext';

const PlaceDeletion: React.FC = () => {
  const { places, fetchPlaces, deletePlace, loading, error, clearError } = usePlace();
  const [searchType, setSearchType] = useState<'Id' | 'Nombre Completo'>('Id');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Manejar búsqueda
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);
    setHasSearched(true);
    setSelectedPlace(null);
    setSearchResults([]);

    if (!searchTerm.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingrese un término de búsqueda' });
      return;
    }

    try {
      // Cargar responsables solo cuando se presiona el botón de buscar
      await fetchPlaces();
      
      let results = [];
      if (searchType === 'Id') {
        results = places.filter(resp => 
          resp.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        results = places.filter(resp => 
          resp.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setSearchResults(results);
      
      if (results.length === 0) {
        setMessage({ type: 'error', text: 'No se encontraron lugares con los criterios de búsqueda' });
      } else if (results.length === 1) {
        setSelectedPlace(results[0]);
        setMessage({ type: 'success', text: 'Se encontró un lugar. Puede proceder a eliminarlo.' });
      } else {
        setMessage({ type: 'info', text: `Se encontraron ${results.length} resultados. Seleccione uno para eliminar.` });
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error al buscar lugares' 
      });
    }
  };

  // Manejar selección de responsable - CORREGIDO
  const handleSelectPlace = (place: any) => {
    setSelectedPlace(place);
    // NO limpiar searchResults aquí, solo cuando se hace una nueva búsqueda
    setMessage({ type: 'success', text: `Lugar "${place.name}" seleccionado para eliminar.` });
  };

  // Manejar eliminación
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!selectedPlace) {
      setMessage({ type: 'error', text: 'Por favor, seleccione un lugar para eliminar' });
      return;
    }

    // Verificar que el lugar todavía existe en la lista actual
    const responsibleExists = places.some(resp => resp.id === selectedPlace.id);
    if (!responsibleExists) {
      setMessage({ 
        type: 'error', 
        text: 'El lugar seleccionado ya no existe en la base de datos. Por favor, realice una nueva búsqueda.' 
      });
      setSelectedPlace(null);
      return;
    }

    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar al lugar:\n"${selectedPlace.name}" (ID: ${selectedPlace.id})?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deletePlace(selectedPlace.id);
      setMessage({ 
        type: 'success', 
        text: `Responsable "${selectedPlace.name}" eliminado exitosamente` 
      });
      setSelectedPlace(null);
      setSearchTerm('');
      setSearchResults([]);
      setHasSearched(false);
      
      // Recargar la lista de responsables después de eliminar
      await fetchPlaces();
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error al eliminar el responsable' 
      });
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedPlace(null);
    setHasSearched(false);
    clearError();
    setMessage(null);
  };

  return (
    <section id="place_deletion" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Eliminar un lugar</h1>
          <p className="section-description">
            Ingrese el ID o nombre del lugar que desea eliminar
          </p>
        </div>
      </div>
      
      <div className="detail-card">
        {/* Mensajes */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {/* Formulario de búsqueda */}
        <form className="place-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="search-options" className="form-label">Búsqueda por:</label>
            <select 
              id="search-options" 
              className="form-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'Id' | 'Nombre Completo')}
              disabled={loading}
            >
              <option value="Id">ID</option>
              <option value="Nombre Completo">Nombre Completo</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="search" className="form-label">
              {searchType === 'Id' ? 'ID del lugar' : 'Nombre del lugar'}
            </label>
            <div className="search-input-container">
              <input 
                type="text" 
                id="search" 
                className="form-input"
                placeholder={
                  searchType === 'Id' 
                    ? 'Ej: resp_123456789' 
                    : 'Ej: Universidad de La Habana'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  title="Limpiar búsqueda"
                >
                  ×
                </button>
              )}
            </div>
            <div className="search-hint">
              {searchType === 'Id' 
                ? 'Ingrese el ID completo o parcial del lugar'
                : 'Ingrese el nombre completo o parcial del lugar'
              }
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button search-button"
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? 'Buscando...' : 'Buscar Lugar'}
          </button>
        </form>

        {/* Estado inicial - antes de buscar */}
        {!hasSearched && !loading && (
          <div className="search-placeholder">
            <div className="placeholder-icon">🔍</div>
            <p>Ingrese un término de búsqueda y haga clic en "Buscar Lugar"</p>
          </div>
        )}

        {/* Resultados de búsqueda - MOSTRAR incluso cuando hay un seleccionado */}
        {hasSearched && searchResults.length > 0 && (
          <div className="search-results">
            <h3>Resultados de búsqueda:</h3>
            <div className="results-list">
              {searchResults.map((place) => (
                <div 
                  key={place.id} 
                  className={`result-item ${selectedPlace?.id === place.id ? 'selected' : ''}`}
                  onClick={() => handleSelectPlace(place)}
                >
                  <div className="place-info">
                    <strong>ID:</strong> {place.id}
                  </div>
                  <div className="place-info">
                    <strong>Nombre:</strong> {place.name}
                  </div>
                  <div className="select-hint">
                    {selectedPlace?.id === place.id ? '✓ Seleccionado' : 'Click para seleccionar'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sin resultados */}
        {hasSearched && searchResults.length === 0 && searchTerm && !loading && (
          <div className="no-results">
            <div className="no-results-icon">❌</div>
            <p>No se encontraron lugares que coincidan con "{searchTerm}"</p>
            <button 
              type="button" 
              className="clear-search-btn secondary"
              onClick={handleClearSearch}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Lugar seleccionado */}
        {selectedPlace && (
          <div className="selected-place">
            <h3>Lugar seleccionado para eliminar:</h3>
            <div className="place-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedPlace.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{selectedPlace.name}</span>
              </div>
            </div>

            <div className="delete-actions">
              <button 
                type="button" 
                className="submit-button delete-button"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar Lugar'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleClearSearch}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlaceDeletion;