import React, { useState, useEffect } from 'react';
import { useAgency } from '../../../context/AgencyContext';

const AgencyCreation: React.FC = () => {
  const [name, setName] = useState('');
  const [ubication, setUbication] = useState('');
  const [fundationDate, setFundationDate] = useState('');
  const { createAgency, loading, error, clearError } = useAgency();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    try {
      //await createAgency({ name: name.trim(), ubication: ubication.trim(), fundationDate: fundationDate});
      setName(''); // Limpiar el campo después de éxito
    } catch (err) {
      console.error('Error en el componente:', err);
    }
  };

  return (
    <section id="Agency_creation" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Ingrese una nueva agencia</h1>
        </div>
      </div>
      
      <div className="detail-card">
        {/* Mostrar error del contexto */}
        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <form className="Agency-form" onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label htmlFor="ubication" className="form-label">Ubicacion</label>
            <input 
              type="text" 
              id="ubication" 
              className="form-input"
              value={ubication}
              onChange={(e) => setUbication(e.target.value)}
              disabled={loading}
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fundationDate" className="form-label">Fecha de fundacion</label>
            <input 
              type="date" 
              id="fundationDate" 
              className="form-input"
              value={fundationDate}
              onChange={(e) => setFundationDate(e.target.value)}disabled={loading}
              required
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
              'Ingresar Agencia'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AgencyCreation;