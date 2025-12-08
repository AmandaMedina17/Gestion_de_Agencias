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
            label: '🎤 Aprendices', 
            tooltip: 'Datos de Aprendices',
        },
        {   id: 'active_artists', 
            label: '🎤 Artistas', 
            tooltip: 'Datos de Artista',
        },
        {   id: 'group_calendar', 
            label: '📆 Calendario de Grupos', 
            tooltip: 'Detalles de las Actividades Grupales',
        },
        // {   id: 'agencies_management', 
        //     label: 'Gestión de Agencias', 
        //     tooltip: 'Registrar, modificar y eliminar agencias',
        // },
        // {   id: 'groups_management',    
        //     label: 'Gestión de Grupos', 
        //     tooltip: 'Registrar, modificar y eliminar grupos',
        // },
        // {   id: 'songs_management', 
        //     label: 'Gestión de Canciones', 
        //     tooltip: 'Registrar, modificar y eliminar canciones',
        // },
        // {   id: 'albums_management', 
        //     label: 'Gestión de Albumes', 
        //     tooltip: 'Registrar, modificar y eliminar albumes',
        // },
        // {   id: 'billboard_management', 
        //     label: 'Gestión de Listas Billboard', 
        //     tooltip: 'Registrar, modificar y eliminar listas billboard',
        // },
        // {   id: 'activities_management', 
        //     label: 'Gestión de Actividades', 
        //     tooltip: 'Registrar, modificar y eliminar actividades',
        // },
        // {   id: 'responsible_management', 
        //     label: 'Gestión de Responsables', 
        //     tooltip: 'Registrar, modificar y eliminar responsables',
        // },
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

  // const menuItems = [
  //   { id: 'group_calendar', label: '📆 Calendario de Grupos', tooltip: 'Detalles de las Actividades Grupales' },
  //   { id: 'artist_calendar', label: '📖 Calendario de Artistas', tooltip: 'Detalles de Actividades de los Artistas' },
  //   { id: 'artist_income', label: '💰 Ingresos de Artistas', tooltip: 'Ingresos y éxitos' },
  //   { id: 'artist_mobility', label: '🔄 Movilidad de Artistas', tooltip: 'Historial de Artistas transferidos de Agencia y Grupos' },
  //   { id: 'elite_artists', label: '👩🏼‍🎤 Artistas Élite', tooltip: 'Historial de Artistas que pertenecieron a grupos disueltos y carrera exitosa' }
  // ];

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

      {/* Botón de cerrar sesión */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => {
          // Aquí agregarías la lógica de logout
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}>
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;