import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from './AdminSidebar';
// import SectionLoader from './SectionLoader';
import { sectionComponents } from './AdminSectionMap';
import '../../components/Admin/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('apprentices_creation');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const ActiveComponent = sectionComponents[activeSection as keyof typeof sectionComponents];


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
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      {/* Contenido principal */}
      <main className="main-content">
        {/* <SectionLoader sectionId={activeSection} /> */}
        {ActiveComponent ? <ActiveComponent /> : <div>Sección no encontrada</div>}
      </main>
    </div>
  );
};

export default AdminDashboard;