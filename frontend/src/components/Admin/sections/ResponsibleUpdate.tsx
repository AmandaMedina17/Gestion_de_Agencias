import React, { useState } from 'react';
import { useResponsible } from '../../../context/ResponsibleContext';

const ResponsibleUpdate: React.FC = () => {
  const { responsibles, fetchResponsibles, updateResponsible, loading, error, clearError } = useResponsible();
  const [searchType, setSearchType] = useState<'Id' | 'Nombre Completo'>('Id');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState<any>(null);
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
    setSelectedResponsible(null);
    setSearchResults([]);
    setName('');

    if (!searchTerm.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingrese un término de búsqueda' });
      return;
    }

    try {
      await fetchResponsibles();
      
      let results = [];
      if (searchType === 'Id') {
        results = responsibles.filter(resp => 
          resp.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        results = responsibles.filter(resp => 
          resp.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setSearchResults(results);
      
      if (results.length === 0) {
        setMessage({ type: 'error', text: 'No se encontraron responsables con los criterios de búsqueda' });
      } else if (results.length === 1) {
        const responsible = results[0];
        setSelectedResponsible(responsible);
        setName(responsible.name);
        setMessage({ type: 'success', text: 'Se encontró un responsable. Puede proceder a editarlo.' });
      } else {
        setMessage({ type: 'info', text: `Se encontraron ${results.length} resultados. Seleccione uno para editar.` });
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error al buscar responsables' 
      });
    }
  };

  // Manejar selección de responsable
  const handleSelectResponsible = (responsible: any) => {
    setSelectedResponsible(responsible);
    setName(responsible.name);
    setMessage({ type: 'success', text: `Responsable "${responsible.name}" seleccionado para editar.` });
  };

  // Manejar actualización
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!selectedResponsible) {
      setMessage({ type: 'error', text: 'Por favor, seleccione un responsable para editar' });
      return;
    }

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingrese un nombre válido' });
      return;
    }

    // Verificar que el responsable todavía existe en la lista actual
    const responsibleExists = responsibles.some(resp => resp.id === selectedResponsible.id);
    if (!responsibleExists) {
      setMessage({ 
        type: 'error', 
        text: 'El responsable seleccionado ya no existe en la base de datos. Por favor, realice una nueva búsqueda.' 
      });
      setSelectedResponsible(null);
      setName('');
      return;
    }

    const confirmUpdate = window.confirm(
      `¿Está seguro de que desea actualizar al responsable:\n"${selectedResponsible.name}" (ID: ${selectedResponsible.id})?\n\nNuevo nombre: ${name}`
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      await updateResponsible(selectedResponsible.id, { name: name.trim() });
      setMessage({ 
        type: 'success', 
        text: `Responsable "${selectedResponsible.name}" actualizado exitosamente a "${name}"` 
      });
      setSelectedResponsible(null);
      setSearchTerm('');
      setSearchResults([]);
      setHasSearched(false);
      setName('');
      
      // Recargar la lista de responsables después de actualizar
      await fetchResponsibles();
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error al actualizar el responsable' 
      });
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedResponsible(null);
    setHasSearched(false);
    setName('');
    clearError();
    setMessage(null);
  };

  return (
    <section id="responsible_update" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Actualizar un responsable</h1>
          <p className="section-description">
            Ingrese el ID o nombre del responsable que desea actualizar
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
        <form className="responsible-form" onSubmit={handleSearch}>
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
              {searchType === 'Id' ? 'ID del responsable' : 'Nombre del responsable'}
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
                ? 'Ingrese el ID completo o parcial del responsable'
                : 'Ingrese el nombre completo o parcial del responsable'
              }
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button search-button"
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? 'Buscando...' : 'Buscar Responsable'}
          </button>
        </form>

        {/* Estado inicial - antes de buscar */}
        {!hasSearched && !loading && (
          <div className="search-placeholder">
            <div className="placeholder-icon">🔍</div>
            <p>Ingrese un término de búsqueda y haga clic en "Buscar Responsable"</p>
          </div>
        )}

        {/* Resultados de búsqueda */}
        {hasSearched && searchResults.length > 0 && (
          <div className="search-results">
            <h3>Resultados de búsqueda:</h3>
            <div className="results-list">
              {searchResults.map((responsible) => (
                <div 
                  key={responsible.id} 
                  className={`result-item ${selectedResponsible?.id === responsible.id ? 'selected' : ''}`}
                  onClick={() => handleSelectResponsible(responsible)}
                >
                  <div className="responsible-info">
                    <strong>ID:</strong> {responsible.id}
                  </div>
                  <div className="responsible-info">
                    <strong>Nombre:</strong> {responsible.name}
                  </div>
                  <div className="select-hint">
                    {selectedResponsible?.id === responsible.id ? '✓ Seleccionado' : 'Click para seleccionar'}
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
            <p>No se encontraron responsables que coincidan con "{searchTerm}"</p>
            <button 
              type="button" 
              className="clear-search-btn secondary"
              onClick={handleClearSearch}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Responsable seleccionado */}
        {selectedResponsible && (
          <div className="selected-responsible">
            <h3>Responsable seleccionado para editar:</h3>
            <div className="responsible-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedResponsible.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nombre actual:</span>
                <span className="detail-value">{selectedResponsible.name}</span>
              </div>
            </div>

            <form className="responsible-form" onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nuevo nombre completo</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-input"
                  placeholder="Ej: Juan Pérez García"
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
                  disabled={loading || !name.trim() || name === selectedResponsible.name}
                >
                  {loading ? 'Actualizando...' : 'Actualizar Responsable'}
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

export default ResponsibleUpdate;