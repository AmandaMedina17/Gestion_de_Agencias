import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

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
    const [tooltipData, setTooltipData] = useState<{text: string, top: number} | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const menuItems = [
        {   id: 'apprentices_management', 
            label: 'Gestión de Aprendices', 
            icon: '👤', 
            tooltip: 'Registrar, modificar y eliminar aprendices',
            submenu:[
                { id: 'apprentices_creation', label: 'Creación' },
                { id: 'apprentices_update', label: 'Actualizacion'},
                { id: 'apprentices_findall', label: 'Buscar todo'},
                { id: 'apprentices_deletion', label: 'Eliminación' }
            ]
        },
        {   
            id: 'artists_management', 
            label: 'Gestión de Artistas', 
            tooltip: 'Registrar, modificar y eliminar artistas',
            submenu:[
                { id: 'artists_creation', label: 'Creación' },
                { id: 'artists_update', label: 'Actualizacion'},
                { id: 'artists_findall', label: 'Buscar todo'},
                { id: 'artists_deletion', label: 'Eliminación' }
            ]
        },
        {   
            id: 'groups_management',    
            label: 'Gestión de Grupos', 
            tooltip: 'Registrar, modificar y eliminar grupos',
            submenu:[
                { id: 'groups_creation', label: 'Creación' },
                { id: 'groups_update', label: 'Actualizacion'},
                { id: 'groups_findall', label: 'Buscar todo'},
                { id: 'groups_deletion', label: 'Eliminación' }
            ] 
        },
        {   
            id: 'songs_management', 
            label: 'Gestión de Canciones', 
            tooltip: 'Registrar, modificar y eliminar canciones',
            submenu:[
                { id: 'songs_creation', label: 'Creación' },
                { id: 'songs_update', label: 'Actualizacion'},
                { id: 'songs_findall', label: 'Buscar todo'},
                { id: 'songs_deletion', label: 'Eliminación' }
            ]
        },
        {   
            id: 'albums_management', 
            label: 'Gestión de Albumes', 
            tooltip: 'Registrar, modificar y eliminar albumes',
            submenu:[
                { id: 'albumes_creation', label: 'Creación' },
                { id: 'albumes_update', label: 'Actualizacion'},
                { id: 'albumes_findall', label: 'Buscar todo'},
                { id: 'albumes_deletion', label: 'Eliminación' }
            ]
        },
        {   
            id: 'activities_management', 
            label: 'Gestión de Actividades', 
            tooltip: 'Registrar, modificar y eliminar actividades',
            submenu:[
                { id: 'activities_creation', label: 'Creación' },
                { id: 'activities_update', label: 'Actualizacion'},
                { id: 'activities_findall', label: 'Buscar todo'},
                { id: 'activities_deletion', label: 'Eliminación' }
            ] 
        },
        { 
            id: 'incomes_management', 
            label: 'Gestión de Ingresos', 
            tooltip: 'Registrar, modificar y eliminar ingresos',
            submenu:[
                { id: 'incomes_creation', label: 'Creación' },
                { id: 'incomes_update', label: 'Actualizacion'},
                { id: 'incomes_findall', label: 'Buscar todo'},
                { id: 'incomes_deletion', label: 'Eliminación' }
            ] 
        },
        { 
            id: 'responsible_management', 
            label: 'Gestión de Responsables', 
            tooltip: 'Registrar, modificar y eliminar responsables',
            submenu:[
                { id: 'responsible_creation', label: 'Creación' },
                { id: 'responsible_update', label: 'Actualizacion'},
                { id: 'responsible_findall', label: 'Buscar todo'},
                { id: 'responsible_deletion', label: 'Eliminación' }
            ] 
        },
        { 
            id: 'place_management', 
            label: 'Gestión de Lugares', 
            tooltip: 'Registrar, modificar y eliminar lugares',
            submenu:[
                { id: 'place_creation', label: 'Creación' },
                { id: 'place_update', label: 'Actualizacion'},
                { id: 'place_findall', label: 'Buscar todo'},
                { id: 'place_deletion', label: 'Eliminación' }
            ] 
        },
        { 
            id: 'contract_management', 
            label: 'Gestión de Contratos', 
            tooltip: 'Registrar, modificar y eliminar contratos',
            submenu:[
                { id: 'contract_creation', label: 'Creación' },
                { id: 'contract_update', label: 'Actualizacion'},
                { id: 'contract_findall', label: 'Buscar todo'},
                { id: 'contract_deletion', label: 'Eliminación' }
            ] 
        },
        { 
            id: 'evaluation_management', 
            label: 'Gestión de Evaluaciones', 
            tooltip: 'Registrar, modificar y eliminar evaluaciones',
            submenu:[
                { id: 'evaluation_creation', label: 'Creación' },
                { id: 'evaluation_update', label: 'Actualizacion'},
                { id: 'evaluation_findall', label: 'Buscar todo'},
                { id: 'evaluation_deletion', label: 'Eliminación' }
            ] 
        },

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
        setOpenSubmenu(null);
    };

    const handleMouseEnter = (e: React.MouseEvent, tooltip: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Establecer nuevo timeout de 2 segundos (2000ms)
        timeoutRef.current = setTimeout(() => {
            setTooltipData({
                text: tooltip,
                top: rect.top + rect.height / 2
            });
        }, 1100); // 2 segundos de delay
    };
    const handleMouseLeave = () => {
       // Limpiar el timeout si el mouse sale antes de los 2 segundos
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setTooltipData(null);
    };

    // Función para crear portal de tooltip
    const TooltipPortal = () => {
        if (!tooltipData) return null;

        return ReactDOM.createPortal(
            <div 
                className="external-tooltip"
                style={{
                    top: `${tooltipData.top}px`,
                    left: '300px'
                }}
            >
                {tooltipData.text}
            </div>,
            document.body
        );
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'show' : ''}`} id="drop">
                <nav className="sidebar-nav">
                    <div className="nav-items-container">
                        {menuItems.map((item) => (
                        <div key={item.id} className="nav-item-container">
                            <button
                                className={`nav-item main-item ${activeSection.startsWith(item.id) ? 'active' : ''} ${openSubmenu === item.id ? 'submenu-open' : ''}`}
                                onClick={() => handleMainItemClick(item.id)}
                                onMouseEnter={(e) => handleMouseEnter(e, item.tooltip)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {item.label}
                                <span className="dropdown-arrow">▼</span>
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
                    </div>
                </nav>
            </div>

            {/* Renderizar el portal del tooltip */}
            <TooltipPortal />
        </>
    );
};

export default AdminSidebar;