import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAgency } from '../../context/AgencyContext'; 
import ManagerSidebar from './ManagerSidebar';
import '../../components/Manager/ManagerDashboard.css';

const ManagerDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agencyName, setAgencyName] = useState<string>('No asignada');
  const [agencyDetails, setAgencyDetails] = useState<any>(null);
  
  // Obtener usuario del contexto de autenticación
  const { user } = useAuth();
  // Obtener agencias del contexto
  const { agencies, fetchAgencies } = useAgency();

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
      setAgencyDetails(agencyDetails);
    }
  }, [user?.agency, agencies]);

  // Datos del manager usando la información del usuario
  const managerData = {
    name: user?.username || "Manager",
    role: user?.role === "AGENCY_MANAGER" ? "Manager de Agencia" : "Manager",
    email: `${user?.username}@agencia.com` || "manager@agencia.com",
    agency: agencyName, // Usar el nombre de la agencia
    agencyId: user?.agency || "", // Guardar ID por si acaso
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

  // Formatear fecha de fundación si existe
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

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
        
      </main>
    </div>
  );
};

export default ManagerDashboard;