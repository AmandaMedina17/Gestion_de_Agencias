import React from 'react';

const ResponsibleUpdate: React.FC = () => {
  return (
    <section id="responsible_update" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Actualizar un responsable</h1>
        </div>
      </div>

      
      
      <div className="detail-card">

        
        <form className="responsible-form">

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

          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Nombre completo</label>
            <input 
              type="text" 
              id="fullName" 
              className="form-input"
              placeholder="Ej: Alberto Pérez García"
            />
          </div>
          
          <button type="submit" className="submit-button">
            Actualizar Responsable
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResponsibleUpdate;