import React from 'react';

const ApprenticesCreation: React.FC = () => {
  return (
    <section id="apprentices_creation" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Ingresa un nuevo aprendiz</h1>
        </div>
      </div>
      
      <div className="detail-card">
        <form className="apprentice-form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Nombre completo</label>
            <input 
              type="text" 
              id="fullName" 
              className="form-input"
              placeholder="Ej: Juan Pérez García"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age" className="form-label">Edad</label>
            <input 
              type="number" 
              id="age" 
              className="form-input"
              placeholder="Ej: 25"
              min="16"
              max="60"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="trainingLevel" className="form-label">Nivel de entrenamiento</label>
            <select id="trainingLevel" className="form-select">
              <option value="">Selecciona un nivel</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="admissionDate" className="form-label">Fecha de ingreso</label>
            <input 
              type="date" 
              id="admissionDate" 
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status" className="form-label">Estado</label>
            <select id="status" className="form-select">
              <option value="en_entrenamiento">En entrenamiento</option>
              <option value="en_proceso_de_seleccion">En proceso de seleccion</option>
              <option value="transferido">Transferido</option>
            </select>
          </div>
          
          <button type="submit" className="submit-button">
            Ingresar Aprendiz
          </button>
        </form>
      </div>
    </section>
  );
};

export default ApprenticesCreation;