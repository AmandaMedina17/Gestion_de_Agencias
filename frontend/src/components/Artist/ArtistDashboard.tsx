import React, { useState, useEffect, useCallback } from 'react';
import ArtistSidebar from './ArtistSidebar';
import { sectionComponents } from './ArtistSectionMap';
import '../Admin/AdminDashboard.css'
import ArtistProfile from './sections/UserProfile';
import { useAgency } from '../../context/AgencyContext';
import { useAuth } from '../../context/AuthContext';
import { AgencyResponseDto } from '../../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto';

const ArtistDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('activities');
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
  

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    closeSidebar();
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('sidebar-open');
    };


  }, [sidebarOpen]);

  const getAgencyNameById = (agencyId: string): string => {
      if (!agencyId || !agencies.length) return "No asignada";
      
      const agency = agencies.find(a => a.id === agencyId);
      return agency ? `${agency.nameAgency} - ${agency.place.name}` : "No encontrada";
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
        console.log(user.agency);
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
  

  const ActiveComponent = sectionComponents[activeSection as keyof typeof sectionComponents];

  const artistData = {
    name: user?.username || "Artista",
    role: user?.role === "Artista" ? "Artista" : "Artista",
    email: `${user?.username}@agencia.com` || "manager@agencia.com",
    agency: agencyName,
    agencyId: user?.agency || "",
    joinDate: "1 Jul 2025"
  };

  return (
    <div id="artist_interface">
      {/* Botón del menú hamburguesa */}
      <div className={`menu_desplegable ${sidebarOpen ? 'active' : ''}`} id="menu_btn" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Sidebar */}
      <ArtistSidebar 
        isOpen={sidebarOpen} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onClose={closeSidebar}
      />

      {/* Overlay para cerrar sidebar en móviles */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      {/* Contenido principal */}
      <main className="main-content">
        {activeSection === 'profile' ? (
                  <ArtistProfile 
                    manager={artistData} 
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

export default ArtistDashboard;