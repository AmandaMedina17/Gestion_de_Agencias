import React from 'react';

const PlaceCreation: React.FC = () => {
  return (
    <section id="place_creation" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Ingrese un nuevo lugar</h1>
        </div>
      </div>
      
      <div className="detail-card">
        <form className="place-form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Nombre completo</label>
            <input 
              type="text" 
              id="fullName" 
              className="form-input"
              placeholder="Ej: Universidad de La Habana"
            />
          </div>
          
          <button type="submit" className="submit-button">
            Ingresar Lugar
          </button>
        </form>
      </div>
    </section>
  );
};

export default PlaceCreation;