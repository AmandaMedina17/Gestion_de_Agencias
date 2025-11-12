import React, { useState, useEffect } from 'react';
import { useResponsible } from '../../../context/ResponsibleContext';

const ResponsibleCreation: React.FC = () => {
  const [name, setName] = useState('');
  const { createResponsible, loading, error, clearError } = useResponsible();
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
      await createResponsible({ name: name.trim() });
      // Mostrar mensaje de éxito con el nombre del responsable
      setSuccessMessage(`Responsable "${name.trim()}" creado exitosamente`);
      setName(''); // Limpiar el campo después de éxito
      
      // Limpiar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      // El error ya está manejado en el contexto
      console.error('Error en el componente:', err);
    }
  };

  return (
    <section id="responsible_creation" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Ingrese un nuevo responsable</h1>
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

        <form className="responsible-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre completo</label>
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
              'Ingresar Responsable'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResponsibleCreation;