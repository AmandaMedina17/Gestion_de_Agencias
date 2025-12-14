import { useArtist } from '../../context/ArtistContext';
import { useAgency } from '../../context/AgencyContext';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    const { user } = useAuth();
    const { agencies, fetchAgencies } = useAgency();
    const { artists, fetchArtists } = useArtist();
    
    // Estados para almacenar los nombres
    const [agencyName, setAgencyName] = useState<string>("No asignada");
    const [artistName, setArtistName] = useState<string>("Artista");

    // Fetch inicial - solo una vez al principio
    useEffect(() => {
        if (!agencies.length && fetchAgencies) {
        fetchAgencies();
    }
    if (!artists.length && fetchArtists) {
        fetchArtists();
    }
    }, []); // Array vacío significa que solo se ejecuta al montar

    // Usar useMemo para calcular los nombres basados en los datos disponibles
    const memoizedAgencyName = useMemo(() => {
        if (!user?.agency || !agencies.length) return "No asignada";
        const agency = agencies.find(a => a.id === user.agency);
        return agency ? agency.nameAgency : "No encontrada";
    }, [user?.agency, agencies]);

    const memoizedArtistName = useMemo(() => {
        if (!user?.artist || !artists.length) return "Artista";
        const artist = artists.find(a => a.id === user.artist);
        return artist ? artist.stageName : "No encontrado";
    }, [user?.artist, artists]);

    // Actualizar los estados cuando cambian los valores memoizados
    useEffect(() => {
        setAgencyName(memoizedAgencyName);
        setArtistName(memoizedArtistName);
    }, [memoizedAgencyName, memoizedArtistName]);

    const [tooltipData, setTooltipData] = useState<{text: string, top: number} | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const menuItems = [
        {   id: 'activities', 
            label: 'Actividades', 
            tooltip: '',
        },
        {   id: 'group_proposal', 
            label: 'Proposición de Grupos', 
            tooltip: '',
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

    // Obtener inicial del nombre de usuario para el avatar
    const userInitial = useMemo(() => {
        return user?.username?.charAt(0)?.toUpperCase() || 
               artistName?.charAt(0)?.toUpperCase() || 
               "M";
    }, [user?.username, artistName]);

    return (
        <>
            <div className={`sidebar ${isOpen ? 'show' : ''}`} id="drop">
                <div className="sidebar-user-info">
                    <div className="user-avatar">
                    <div className="avatar-circle">
                        {userInitial}
                    </div>
                    </div>
                    <div className="user-details">
                    <div className="user-role">Artista</div>
                    <h3 className="username">{artistName}</h3>
                    
                    <div className="user-agency">
                        <span className="agency-label">Agencia:</span>
                        <span className="agency-name">{agencyName}</span>
                    </div>
                    </div>
                </div>
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