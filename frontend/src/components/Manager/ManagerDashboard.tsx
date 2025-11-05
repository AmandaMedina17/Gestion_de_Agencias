import React, { useState } from 'react';
import ManagerSidebar from './ManagerSidebar';
import '../../components/Manager/ManagerDashboard.css';

const ManagerDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
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

  // Datos de ejemplo - luego los reemplazarás con datos reales de tu API
  const managerData = {
    name: "Amanda Medina",
    role: "Manager",
    email: "amanda.medina@agencia.com",
    phone: "52364197",
    agency: "Una ahi",
    joinDate: "1 Jul 2025"
  };

  const artistsData = [
    { realName: "María González", stageName: "Maria Pop", group: "Solista", debutDate: "15/03/2018", status: "active" },
    { realName: "Carlos Rodríguez", stageName: "Carlos Rock", group: "Los Rockeros", debutDate: "10/07/2015", status: "active" },
    { realName: "Ana Martínez", stageName: "Ana Jazz", group: "Jazz Trio", debutDate: "22/11/2019", status: "active" },
    { realName: "Javier López", stageName: "Javi Electro", group: "Electro Beat", debutDate: "05/01/2020", status: "active" },
    { realName: "Lucía Fernández", stageName: "Lucy Soul", group: "Soul Sisters", debutDate: "18/09/2017", status: "active" },
    { realName: "Roberto Silva", stageName: "Rob Indie", group: "The Indie Band", debutDate: "30/04/2016", status: "inactive" }
  ];

  return (
    <div id="managers_interface">
      {/* Botón del menú hamburguesa */}
      <div className={`menu_desplegable ${sidebarOpen ? 'active' : ''}`} id="menu_btn" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Sidebar */}
      <ManagerSidebar 
        isOpen={sidebarOpen} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onClose={closeSidebar}
      />

      {/* Overlay para cerrar sidebar en móviles */}
      <div className="sidebar-overlay" onClick={closeSidebar}></div>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Sección de Perfil */}
        {activeSection === 'profile' && (
          <section id="profile" className="content-section active">
            <div className="profile-header">
              <div className="profile-info">
                <h1>{managerData.name}</h1>
                <p className="profile-role">{managerData.role}</p>
                <p className="profile-email">{managerData.email}</p>
              </div>
            </div>
            <div className="profile-details">
              <div className="detail-card">
                <h3>📋 Información Personal</h3>
                <div className="detail-item">
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{managerData.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Agencia:</span>
                  <span className="detail-value">{managerData.agency}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha de ingreso:</span>
                  <span className="detail-value">{managerData.joinDate}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sección de Artistas Activos */}
        {activeSection === 'active_artist' && (
          <section id="active_artist" className="content-section active">
            <div className="profile-header">
              <div className="profile-info">
                <h1>Artistas Activos</h1>
                <p className="profile-role">Gestión de Artistas</p>
              </div>
            </div>
            
            <div className="artists-table-container">
              <table className="artists-table">
                <thead>
                  <tr>
                    <th>Nombre Real</th>
                    <th>Nombre Artístico</th>
                    <th>Grupo</th>
                    <th>Fecha de Debut</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {artistsData.map((artist, index) => (
                    <tr key={index}>
                      <td>{artist.realName}</td>
                      <td>{artist.stageName}</td>
                      <td>{artist.group}</td>
                      <td>{artist.debutDate}</td>
                      <td className={artist.status === 'active' ? 'status-active' : 'status-inactive'}>
                        {artist.status === 'active' ? 'Activo' : 'Inactivo'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Aquí puedes agregar más secciones según necesites */}
      </main>
    </div>
  );
};

export default ManagerDashboard;