import React, { useState } from 'react';
import { usePlace } from '../../../context/PlaceContext';

const PlaceUpdate: React.FC = () => {
  const { places, fetchPlaces, updatePlace, loading, error, clearError } = usePlace();
  const [searchType, setSearchType] = useState<'Id' | 'Nombre Completo'>('Id');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [name, setName] = useState('');

  // Manejar búsqueda
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);
    setHasSearched(true);
    setSelectedPlace(null);
    setSearchResults([]);
    setName('');

    if (!searchTerm.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingrese un término de búsqueda' });
      return;
    }

    try {
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
        const place = results[0];
        setSelectedPlace(place);
        setName(place.name);
        setMessage({ type: 'success', text: 'Se encontró un lugar. Puede proceder a editarlo.' });
      } else {
        setMessage({ type: 'info', text: `Se encontraron ${results.length} resultados. Seleccione uno para editar.` });
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error al buscar lugares' 
      });
    }
  };

  // Manejar selección de lugar
  const handleSelectPlace = (place: any) => {
    setSelectedPlace(place);
    setName(place.name);
    setMessage({ type: 'success', text: `Lugar "${place.name}" seleccionado para editar.` });
  };

  // Manejar actualización
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!selectedPlace) {
      setMessage({ type: 'error', text: 'Por favor, seleccione un lugar para editar' });
      return;
    }

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingrese un nombre válido' });
      return;
    }

    // Verificar que el lugar todavía existe en la lista actual
    const placeExists = places.some(resp => resp.id === selectedPlace.id);
    if (!placeExists) {
      setMessage({ 
        type: 'error', 
        text: 'El lugar seleccionado ya no existe en la base de datos. Por favor, realice una nueva búsqueda.' 
      });
      setSelectedPlace(null);
      setName('');
      return;
    }

    const confirmUpdate = window.confirm(
      `¿Está seguro de que desea actualizar al lugar:\n"${selectedPlace.name}" (ID: ${selectedPlace.id})?\n\nNuevo nombre: ${name}`
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      await updatePlace(selectedPlace.id, { name: name.trim() });
      setMessage({ 
        type: 'success', 
        text: `Lugar "${selectedPlace.name}" actualizado exitosamente a "${name}"` 
      });
      setSelectedPlace(null);
      setSearchTerm('');
      setSearchResults([]);
      setHasSearched(false);
      setName('');
      
      // Recargar la lista de lugares después de actualizar
      await fetchPlaces();
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error al actualizar el lugar' 
      });
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedPlace(null);
    setHasSearched(false);
    setName('');
    clearError();
    setMessage(null);
  };

  return (
    <section id="place_update" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Actualizar un lugar</h1>
          <p className="section-description">
            Ingrese el ID o nombre del lugar que desea actualizar
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
                    : 'Ej: Juan Pérez García'
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

        {/* Resultados de búsqueda */}
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
            <h3>Lugar seleccionado para editar:</h3>
            <div className="place-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedPlace.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nombre actual:</span>
                <span className="detail-value">{selectedPlace.name}</span>
              </div>
            </div>

            <form className="place-form" onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nuevo nombre completo</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-input"
                  placeholder="Ej: Universidad de La Habana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="update-actions">
                <button 
                  type="submit" 
                  className="submit-button update-button"
                  disabled={loading || !name.trim() || name === selectedPlace.name}
                >
                  {loading ? 'Actualizando...' : 'Actualizar Lugar'}
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
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlaceUpdate;