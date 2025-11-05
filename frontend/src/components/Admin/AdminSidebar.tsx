import React, { useState }  from 'react';

interface AdminSidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen, 
  activeSection, 
  onSectionChange, 
  onClose 
}) => {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const menuItems = [
        {   id: 'apprentices_management', 
            label: 'Gestión de Aprendices', 
            icon: '👤', 
            tooltip: 'Registrar, modificar y eliminar aprendices',
            submenu:[
                { id: 'apprentices_creation', label: 'Creación' },
                { id: 'apprentices_deletion', label: 'Eliminación' }
            ]
        },
        {   
            id: 'artists_management', 
            label: 'Gestión de Artistas', 
            tooltip: 'Registrar, modificar y eliminar artistas',
            submenu:[
                { id: 'artists_creation', label: 'Creación' },
                { id: 'artists_deletion', label: 'Eliminación' }
            ]
        },
        {   
            id: 'groups_management',    
            label: 'Gestión de Grupos', 
            tooltip: 'Registrar, modificar y eliminar grupos',
            submenu:[
                { id: 'groups_creation', label: 'Creación' },
                { id: 'groups_deletion', label: 'Eliminación' }
            ] 
        },
        {   
            id: 'songs_management', 
            label: 'Gestión de Canciones', 
            tooltip: 'Registrar, modificar y eliminar canciones',
            submenu:[
                { id: 'songs_creation', label: 'Creación' },
                { id: 'songs_deletion', label: 'Eliminación' }
            ]
        },
        {   
            id: 'albums_management', 
            label: 'Gestión de Albumes', 
            tooltip: 'Registrar, modificar y eliminar albumes',
            submenu:[
                { id: 'albumes_creation', label: 'Creación' },
                { id: 'albumes_deletion', label: 'Eliminación' }
            ]
        },
        {   
            id: 'activities_management', 
            label: 'Gestión de Actividades', 
            tooltip: 'Registrar, modificar y eliminar actividades',
            submenu:[
                { id: 'activities_creation', label: 'Creación' },
                { id: 'activities_deletion', label: 'Eliminación' }
            ] 
        },
        { 
            id: 'incomes_management', 
            label: 'Gestión de Ingresos', 
            tooltip: 'Registrar, modificar y eliminar ingresos',
            submenu:[
                { id: 'incomes_creation', label: 'Creación' },
                { id: 'incomes_deletion', label: 'Eliminación' }
            ] 
        }
    ];

    const handleMainItemClick = (itemId: string) => {
        if (openSubmenu === itemId) {
        setOpenSubmenu(null);
        } else {
        setOpenSubmenu(itemId);
        }
    };

    const handleSubItemClick = (subItemId: string) => {
        onSectionChange(subItemId);
        setOpenSubmenu(null); // Cerrar submenú después de seleccionar
    };

    return (
        <div className={`sidebar ${isOpen ? 'show' : ''}`} id="drop">
        <nav className="sidebar-nav">
            {menuItems.map((item) => (
            <div key={item.id} className="nav-item-container">
                <button
                className={`nav-item main-item ${activeSection.startsWith(item.id) ? 'active' : ''} ${openSubmenu === item.id ? 'submenu-open' : ''}`}
                onClick={() => handleMainItemClick(item.id)}
                >
                {item.label}
                <span className="dropdown-arrow">▼</span>
                <span className="tooltip">{item.tooltip}</span>
                </button>
                
                {openSubmenu === item.id && (
                <div className="submenu">
                    {item.submenu.map((subItem) => (
                    <button
                        key={subItem.id}
                        className={`submenu-item ${activeSection === subItem.id ? 'active' : ''}`}
                        onClick={() => handleSubItemClick(subItem.id)}
                    >
                        {subItem.label}
                    </button>
                    ))}
                </div>
                )}
            </div>
            ))}
        </nav>
        </div>
    );
};

export default AdminSidebar;