import React, { useState } from 'react';
import { useResponsible } from '../../../context/ResponsibleContext';

const ResponsibleDeletion: React.FC = () => {
  const { responsibles, fetchResponsibles, deleteResponsible, loading, error, clearError } = useResponsible();
  const [searchType, setSearchType] = useState<'Id' | 'Nombre Completo'>('Id');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Manejar búsqueda
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);
    setHasSearched(true);
    setSelectedResponsible(null);
    setSearchResults([]);

    if (!searchTerm.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingrese un término de búsqueda' });
      return;
    }

    try {
      // Cargar responsables solo cuando se presiona el botón de buscar
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
        setSelectedResponsible(results[0]);
        setMessage({ type: 'success', text: 'Se encontró un responsable. Puede proceder a eliminarlo.' });
      } else {
        setMessage({ type: 'info', text: `Se encontraron ${results.length} resultados. Seleccione uno para eliminar.` });
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error al buscar responsables' 
      });
    }
  };

  // Manejar selección de responsable - CORREGIDO
  const handleSelectResponsible = (responsible: any) => {
    setSelectedResponsible(responsible);
    // NO limpiar searchResults aquí, solo cuando se hace una nueva búsqueda
    setMessage({ type: 'success', text: `Responsable "${responsible.name}" seleccionado para eliminar.` });
  };

  // Manejar eliminación
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!selectedResponsible) {
      setMessage({ type: 'error', text: 'Por favor, seleccione un responsable para eliminar' });
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
      return;
    }

    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar al responsable:\n"${selectedResponsible.name}" (ID: ${selectedResponsible.id})?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteResponsible(selectedResponsible.id);
      setMessage({ 
        type: 'success', 
        text: `Responsable "${selectedResponsible.name}" eliminado exitosamente` 
      });
      setSelectedResponsible(null);
      setSearchTerm('');
      setSearchResults([]);
      setHasSearched(false);
      
      // Recargar la lista de responsables después de eliminar
      await fetchResponsibles();
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
    setSelectedResponsible(null);
    setHasSearched(false);
    clearError();
    setMessage(null);
  };

  return (
    <section id="responsible_deletion" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Eliminar un responsable</h1>
          <p className="section-description">
            Ingrese el ID o nombre del responsable que desea eliminar
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

        {/* Resultados de búsqueda - MOSTRAR incluso cuando hay un seleccionado */}
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
            <h3>Responsable seleccionado para eliminar:</h3>
            <div className="responsible-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedResponsible.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{selectedResponsible.name}</span>
              </div>
            </div>

            <div className="delete-actions">
              <button 
                type="button" 
                className="submit-button delete-button"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar Responsable'}
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

export default ResponsibleDeletion;