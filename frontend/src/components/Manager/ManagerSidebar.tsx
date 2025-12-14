import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAgency } from '../../context/AgencyContext';
//import './Sidebar.css';

interface ManagerSidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onClose: () => void;
}

const ManagerSidebar: React.FC<ManagerSidebarProps> = ({ 
  isOpen, 
  activeSection, 
  onSectionChange, 
  onClose 
}) => {
  const { user } = useAuth();
  const { agencies } = useAgency();
  
  // Función para obtener el nombre de la agencia por ID
  const getAgencyName = (agencyId: string) => {
    if (!agencyId || !agencies.length) return "No asignada";
    const agency = agencies.find(a => a.id === agencyId);
    return agency ? agency.nameAgency : "No encontrada";
  };

  const menuItems = [
        {   id: 'active_apprentice', 
            label: 'Gestión de Aprendices', 
            tooltip: 'Datos de Aprendices',
        },
        {   id: 'active_artists', 
            label: 'Gestión de Artistas', 
            tooltip: 'Datos de Artista',
        },
        {   id: 'group_management', 
            label: 'Gestión de Grupos', 
            tooltip: 'Crear, aceptar, editar y eliminar grupos',
        },
        {   id: 'activities_management', 
            label: 'Gestión de Actividades', 
            tooltip: 'Programar actividades para grupo y artista',
        },
        {   id: 'success_management',    
            label: 'Gestión de Éxitos', 
            tooltip: 'Registrar éxitos',
        },
        {   id: 'collaboration_management', 
            label: 'Gestión de Colaboraciones', 
            tooltip: 'Registrar, modificar y eliminar colaboraciones',
        },
        {   id: 'evaluations_management', 
            label: 'Gestión de Evaluaciones', 
            tooltip: 'Registrar, modificar y eliminar evaluaciones de aprendices',
        },
        {   id: 'artists_changes', 
            label: 'Gestión de Artistas Cmabiados', 
            tooltip: 'Registrar, modificar y eliminar listas billboard',
        },
        {   id: 'calendar_group', 
            label: 'Calendario de Grupos', 
            tooltip: 'Consultar actividades programadas de un grupo',
        },
        {   id: 'artist_debut_contract', 
            label: 'Artistas con contratos', 
            tooltip: 'Artistas que ya debutaron y tienen contratos activos',
        },
        // {   id: 'place_management', 
        //     label: 'Gestión de Lugares', 
        //     tooltip: 'Registrar, modificar y eliminar lugares',
        // },
        // {   id: 'contract_management', 
        //     label: 'Gestión de Contratos', 
        //     tooltip: 'Registrar, modificar y eliminar contratos',
        // },
        // {   id: 'evaluation_management', 
        //     label: 'Gestión de Evaluaciones', 
        //     tooltip: 'Registrar, modificar y eliminar evaluaciones',
        // },
    ];


  return (
    <div className={`sidebar ${isOpen ? 'show' : ''}`} id="drop">
      {/* Información del usuario y agencia */}
      <div className="sidebar-user-info">
        <div className="user-avatar">
          <div className="avatar-circle">
            {user?.username?.charAt(0)?.toUpperCase() || "M"}
          </div>
        </div>
        <div className="user-details">
          <h3 className="username">{user?.username || "Manager"}</h3>
          <div className="user-role">Manager</div>
          <div className="user-agency">
            <span className="agency-label">Agencia:</span>
            <span className="agency-name">{user?.agency ? getAgencyName(user.agency) : "No asignada"}</span>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="sidebar-divider"></div>

      {/* Menú de navegación */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="nav-item-icon">{item.label.split(' ')[0]}</span>
            <span className="nav-item-label">{item.label.substring(item.label.indexOf(' ') + 1)}</span>
            <span className="tooltip">{item.tooltip}</span>
          </button>
        ))}
      </nav>

      
    </div>
  );
};

export default ManagerSidebar;