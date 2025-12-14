// ManagerDashboard.tsx (actualizado)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAgency } from '../../context/AgencyContext'; 
import ManagerSidebar from './ManagerSidebar';
import '../../components/Manager/ManagerDashboard.css';
import { AgencyResponseDto } from '../../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto';
import { ArtistStatus } from '../Admin/sections/Artist/ArtistManagement';
import { ApprenticeStatus } from '../Admin/sections/Apprentice/ApprenticesManagement';
import { sectionComponents } from './ManagerSectionMap';
import '../Admin/AdminDashboard.css';
import ManagerProfile from './sections/Profile/UserProfile'; // Asegúrate de que la ruta sea correcta

const ManagerDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agencyName, setAgencyName] = useState<string>('No asignada');
  const [agencyDetails, setAgencyDetails] = useState<AgencyResponseDto | null>(null);
  const [stats, setStats] = useState({
    artists: 0,
    apprentices: 0,
    activeProjects: 0
  });
  
  const { user } = useAuth();
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
    
    if (user?.agency) {
      if (sectionId === 'artists') {
        fetchAgencyArtists(user.agency);
      } else if (sectionId === 'apprentices') {
        fetchAgencyApprentices(user.agency);
      }
    }
  };

  const getAgencyNameById = (agencyId: string): string => {
    if (!agencyId || !agencies.length) return "No asignada";
    
    const agency = agencies.find(a => a.id === agencyId);
    return agency ? `${agency.nameAgency} - ${agency.place}` : "No encontrada";
  };

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

  // Actualizar datos cuando se carguen las agencias, artistas y aprendices
  useEffect(() => {
    if (user?.agency && agencies.length > 0) {
      const agencyName = getAgencyNameById(user.agency);
      const agencyDetails = getAgencyDetails(user.agency);
      setAgencyName(agencyName);
      if(agencyDetails) setAgencyDetails(agencyDetails);
      
      // Actualizar estadísticas
      if (artists || apprentices) {
        setStats({
          artists: artists?.length || 0,
          apprentices: apprentices?.length || 0,
          activeProjects: 5 // Esto podría venir de otra fuente de datos
        });
      }
    }
  }, [user?.agency, agencies, artists, apprentices]);

  // Datos del manager usando la información del usuario
  const managerData = {
    name: user?.username || "Manager",
    role: user?.role === "AGENCY_MANAGER" ? "Manager de Agencia" : "Manager",
    email: `${user?.username}@agencia.com` || "manager@agencia.com",
    agency: agencyName,
    agencyId: user?.agency || "",
    joinDate: "1 Jul 2025"
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
        {activeSection === 'profile' ? (
          <ManagerProfile 
            manager={managerData} 
            agencyDetails={agencyDetails}
          />
        ) : ActiveComponent ? (
          <ActiveComponent />
        ) : (
          <div>Sección no encontrada</div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;