// ManagerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAgency } from '../../context/AgencyContext'; 
import ManagerSidebar from './ManagerSidebar';
import '../../components/Manager/ManagerDashboard.css';
import { AgencyResponseDto } from '../../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto';
import { ArtistStatus } from '../Admin/sections/Artist/ArtistManagement';
import { ApprenticeStatus } from '../Admin/sections/Apprentice/ApprenticesManagement';
import { sectionComponents } from './ManagerSectionMap';

const ManagerDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agencyName, setAgencyName] = useState<string>('No asignada');
  const [agencyDetails, setAgencyDetails] = useState<AgencyResponseDto | null>(null);
  
  // Obtener usuario del contexto de autenticación
  const { user } = useAuth();
  // Obtener agencias, artistas y aprendices del contexto
  const { 
    agencies, 
    artists, 
    apprentices, 
    fetchAgencies, 
    fetchAgencyArtists, 
    fetchAgencyApprentices,
    loading 
  } = useAgency();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    closeSidebar();
    
    // Cargar datos según la sección seleccionada
    if (user?.agency) {
      if (sectionId === 'artists') {
        fetchAgencyArtists(user.agency);
      } else if (sectionId === 'apprentices') {
        fetchAgencyApprentices(user.agency);
      }
    }
  };

  // Función para obtener el nombre de la agencia por ID
  const getAgencyNameById = (agencyId: string): string => {
    if (!agencyId || !agencies.length) return "No asignada";
    
    const agency = agencies.find(a => a.id === agencyId);
    return agency ? `${agency.nameAgency} - ${agency.place}` : "No encontrada";
  };

  // Función para obtener detalles completos de la agencia
  const getAgencyDetails = (agencyId: string) => {
    if (!agencyId || !agencies.length) return null;
    return agencies.find(a => a.id === agencyId);
  };

  // Cargar agencias al montar el componente
  useEffect(() => {
    if (user?.agency) {
      fetchAgencies();
    }
  }, [user?.agency]);

  // Actualizar nombre de la agencia cuando se carguen las agencias
  useEffect(() => {
    if (user?.agency && agencies.length > 0) {
      const agencyName = getAgencyNameById(user.agency);
      const agencyDetails = getAgencyDetails(user.agency);
      setAgencyName(agencyName);
    }
  }, [user?.agency, agencies]);

  // Datos del manager usando la información del usuario
  const managerData = {
    name: user?.username || "Manager",
    role: user?.role === "AGENCY_MANAGER" ? "Manager de Agencia" : "Manager",
    email: `${user?.username}@agencia.com` || "manager@agencia.com",
    agency: agencyName,
    agencyId: user?.agency || "",
    joinDate: "1 Jul 2025"
  };

  // Formatear fecha de fundación si existe
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="profile-section">
            <h1>Perfil del Manager</h1>
            <div className="profile-card">
              <h2>{managerData.name}</h2>
              <p><strong>Rol:</strong> {managerData.role}</p>
              <p><strong>Email:</strong> {managerData.email}</p>
              <p><strong>Agencia:</strong> {managerData.agency}</p>
              {agencyDetails && (
                <div className="agency-details">
                  <h3>Detalles de la Agencia</h3>
                  <p><strong>Nombre:</strong> {agencyDetails.nameAgency}</p>
                  <p><strong>Lugar:</strong> {agencyDetails.place}</p>
                  <p><strong>Fecha de Fundación:</strong> {formatDate(agencyDetails.dateFundation)}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'artists':
        return (
          <div className="artists-section">
            <h1>Artistas de la Agencia</h1>
            {loading ? (
              <p>Cargando artistas...</p>
            ) : artists.length === 0 ? (
              <p>No hay artistas en esta agencia</p>
            ) : (
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
                  {artists.map((artist) => (
                    <tr key={artist.id}>
                      <td>{artist.stageName}</td>
                      <td>{artist.groupId || 'Solista'}</td>
                      <td>{formatDate(artist.transitionDate)}</td>
                      <td>
                        <span className={`status-badge ${artist.status}`}>
                          {artist.status === ArtistStatus.ACTIVO ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'apprentices':
        return (
          <div className="apprentices-section">
            <h1>Aprendices de la Agencia</h1>
            {loading ? (
              <p>Cargando aprendices...</p>
            ) : apprentices.length === 0 ? (
              <p>No hay aprendices en esta agencia</p>
            ) : (
              <table className="apprentices-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha de Inicio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {apprentices.map((apprentice) => (
                    <tr key={apprentice.id}>
                      <td>{apprentice.fullName}</td>
                      <td>{formatDate(apprentice.entryDate)}</td>
                      <td>
                        <span className={`status-badge ${apprentice.status}`}>
                          {apprentice.status === ApprenticeStatus.EN_ENTRENAMIENTO ? 'En entrenamiento' : 'En proceso de seleccion'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      default:
        return <div>Sección no encontrada</div>;
    }
  };

  const ActiveComponent = sectionComponents[activeSection as keyof typeof sectionComponents];

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
        {/* <SectionLoader sectionId={activeSection} /> */}
        {ActiveComponent ? <ActiveComponent /> : <div>Sección no encontrada</div>}
      </main>
    </div>
  );
};

export default ManagerDashboard;