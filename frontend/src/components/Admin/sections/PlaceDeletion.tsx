import React from 'react';

const PlaceDeletion: React.FC = () => {
  return (
    <section id="place_deletion" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Eliminar un lugar</h1>
        </div>
      </div>

      
      
      <div className="detail-card">

        
        <form className="place-form">

            <div className="form-group">
                <label htmlFor="search-options" className="form-label">Búsqueda por:</label>
                <select id="search-options" className="form-select">
                <option value="Id">Id</option>
                <option value="Nombre Completo">Nombre Completo</option>
                </select>

                <label htmlFor="search" className="form-label">Buscar</label>
                <input 
                type="text" 
                id="search" 
                className="form-input"
                placeholder="Ej: Juan Pérez García"
                />
            </div>

          <div className="form-group">
            <label htmlFor="result" className="form-label">Resultado</label>
            <input 
              type="text" 
              id="result" 
              className="form-input"
            />
          </div>

          
          
          <button type="submit" className="submit-button">
            Eliminar Lugar
          </button>
        </form>
      </div>
    </section>
  );
};

export default PlaceDeletion;