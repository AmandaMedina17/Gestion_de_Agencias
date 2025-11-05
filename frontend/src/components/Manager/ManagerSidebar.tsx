import React from 'react';

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
  const menuItems = [
    { id: 'profile', label: 'Perfil', icon: '👤', tooltip: 'Perfil Usuario' },
    { id: 'active_artist', label: '💃🏻 Artistas Activos', tooltip: 'Datos de Artista, Grupo y Contrato' },
    { id: 'group_calendar', label: '📆 Calendario de Grupos', tooltip: 'Detalles de las Actividades Grupales' },
    { id: 'artist_calendar', label: '📖 Calendario de Artistas', tooltip: 'Detalles de Actividades de los Artistas' },
    { id: 'artist_income', label: '💰 Ingresos de Artistas', tooltip: 'Ingresos y éxitos' },
    { id: 'artist_mobility', label: '🔄 Movilidad de Artistas', tooltip: 'Historial de Artistas transferidos de Agencia y Grupos' },
    { id: 'elite_artists', label: '👩🏼‍🎤 Artistas Élite', tooltip: 'Historial de Artistas que pertenecieron a grupos disueltos y carrera exitosa' }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'show' : ''}`} id="drop">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            {item.label}
            <span className="tooltip">{item.tooltip}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ManagerSidebar;