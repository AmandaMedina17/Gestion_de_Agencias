import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import '../../components/Admin/AdminDashboard.css';

const ManagerDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('apprentices_creation');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    closeSidebar();
  };

  return (
    <div id="admins_interface">
      {/* Botón del menú hamburguesa */}
      <div className={`menu_desplegable ${sidebarOpen ? 'active' : ''}`} id="menu_btn" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onClose={closeSidebar}
      />

      {/* Overlay para cerrar sidebar en móviles */}
      <div className="sidebar-overlay" onClick={closeSidebar}></div>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Sección de Aprendices */}
        {activeSection === 'apprentices_creation' && (
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
        )}

        {activeSection === 'apprentices_deletion' && (
          <section id="apprentices_deletion" className="content-section active">
            
          </section>
        )}

        {/* Sección de Artistas */}
        {activeSection === 'artists_creation' && (
          <section id="artists_creation" className="content-section active">
            
          </section>
        )}

        {activeSection === 'artists_deletion' && (
          <section id="artists_deletion" className="content-section active">
            
          </section>
        )}

        {/* Sección de Artistas */}
        {activeSection === 'groups_creation' && (
          <section id="groups_creation" className="content-section active">
            
          </section>
        )}

        {activeSection === 'groups_deletion' && (
          <section id="groups_deletion" className="content-section active">
            
          </section>
        )}

        {/* Sección de Artistas */}
        {activeSection === 'songs_creation' && (
          <section id="songs_creation" className="content-section active">
            
          </section>
        )}

        {activeSection === 'songs_deletion' && (
          <section id="songs_deletion" className="content-section active">
            
          </section>
        )}


        {/* Sección de Artistas */}
        {activeSection === 'albums_creation' && (
          <section id="albums_creation" className="content-section active">
            
          </section>
        )}

        {activeSection === 'albums_deletion' && (
          <section id="albums_deletion" className="content-section active">
            
          </section>
        )}

        {/* Sección de Artistas */}
        {activeSection === 'activities_creation' && (
          <section id="activities_creation" className="content-section active">
            
          </section>
        )}
        {activeSection === 'activities_deletion' && (
          <section id="activities_deletion" className="content-section active">
            
          </section>
        )}

        {/* Sección de Artistas */}
        {activeSection === 'incomes_creation' && (
          <section id="incomes_creation" className="content-section active">
            
          </section>
        )}

        {activeSection === 'incomes_deletion' && (
          <section id="incomes_deletion" className="content-section active">
            
          </section>
        )}



        {/* Aquí puedes agregar más secciones según necesites */}
      </main>
    </div>
  );
};

export default ManagerDashboard;