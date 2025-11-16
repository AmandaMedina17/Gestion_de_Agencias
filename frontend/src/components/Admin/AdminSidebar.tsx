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
    const [tooltipData, setTooltipData] = useState<{text: string, top: number} | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const menuItems = [
        {   id: 'apprentices_management', 
            label: 'Gestión de Aprendices', 
            tooltip: 'Registrar, modificar y eliminar aprendices',
        },
        {   id: 'artists_management', 
            label: 'Gestión de Artistas', 
            tooltip: 'Registrar, modificar y eliminar artistas',
        },
        {   id: 'groups_management',    
            label: 'Gestión de Grupos', 
            tooltip: 'Registrar, modificar y eliminar grupos',
        },
        {   id: 'songs_management', 
            label: 'Gestión de Canciones', 
            tooltip: 'Registrar, modificar y eliminar canciones',
        },
        {   id: 'albums_management', 
            label: 'Gestión de Albumes', 
            tooltip: 'Registrar, modificar y eliminar albumes',
        },
        {   id: 'activities_management', 
            label: 'Gestión de Actividades', 
            tooltip: 'Registrar, modificar y eliminar actividades',
        },
        {   id: 'incomes_management', 
            label: 'Gestión de Ingresos', 
            tooltip: 'Registrar, modificar y eliminar ingresos',
        },
        {   id: 'responsible_management', 
            label: 'Gestión de Responsables', 
            tooltip: 'Registrar, modificar y eliminar responsables',
        },
        {   id: 'place_management', 
            label: 'Gestión de Lugares', 
            tooltip: 'Registrar, modificar y eliminar lugares',
        },
        {   id: 'contract_management', 
            label: 'Gestión de Contratos', 
            tooltip: 'Registrar, modificar y eliminar contratos',
        },
        {   id: 'evaluation_management', 
            label: 'Gestión de Evaluaciones', 
            tooltip: 'Registrar, modificar y eliminar evaluaciones',
        },
    ];

    const handleItemClick = (itemId: string) => {
        onSectionChange(itemId);
        // Cerrar el sidebar en dispositivos móviles después de seleccionar una opción
        if (window.innerWidth <= 768) {
            onClose();
        }
    };

    const handleMouseEnter = (e: React.MouseEvent, tooltip: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            setTooltipData({
                text: tooltip,
                top: rect.top + rect.height / 2
            });
        }, 1100);
    };

    const handleMouseLeave = () => {
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
                                className={`nav-item main-item ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => handleItemClick(item.id)}
                                onMouseEnter={(e) => handleMouseEnter(e, item.tooltip)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {item.label}
                            </button>
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