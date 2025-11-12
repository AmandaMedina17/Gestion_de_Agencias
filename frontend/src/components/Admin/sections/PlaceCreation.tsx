import React, { useState, useEffect } from 'react';
import { usePlace } from '../../../context/PlaceContext';

const PlaceCreation: React.FC = () => {
  const [name, setName] = useState('');
  const { createPlace, loading, error, clearError } = usePlace();
  const [successMessage, setSuccessMessage] = useState('');
  

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    try {
      await createPlace({ name: name.trim() });
      setSuccessMessage(`Lugar "${name.trim()}" creado exitosamente`);
      setName(''); // Limpiar el campo después de éxito
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      // El error ya está manejado en el contexto
      console.error('Error en el componente:', err);
    }
  };

  return (
    <section id="place_creation" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Ingrese un nuevo lugar</h1>
        </div>
      </div>
      
      <div className="detail-card">
        {/* Mostrar mensaje de éxito */}
        {successMessage && (
          <div className="message success">
            {successMessage}
          </div>
        )}

        {/* Mostrar error del contexto */}
        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <form className="place-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre del lugar</label>
            <input 
              type="text" 
              id="name" 
              className="form-input"
              placeholder="Ej: Auditorio Principal, Sala de Ensayos, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              minLength={2}
              maxLength={100}
            />
          </div>
          
          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading || !name.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creando...
              </>
            ) : (
              'Ingresar Lugar'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default PlaceCreation;