// components/icons/Icon.tsx
import React from 'react';

// 1. Definimos todos los iconos disponibles en el sistema
export type IconName = 
  | 'trash'     // Papelera/basura
  | 'edit'      // Editar/lápiz
  | 'plus'      // Agregar/+
  | 'search'    // Buscar/lupa
  | 'reload'    // Recargar
  | 'user'      // Usuario
  | 'building'  // Edificio
  | 'check'     // Check/verificado
  | 'close'     // Cerrar/X
  | 'menu'
  | 'up'
  | 'down';     // Menú hamburguesa

// 2. Interfaz de props del componente
interface IconProps {
  name: IconName;        // Nombre del icono (obligatorio)
  size?: number;         // Tamaño en píxeles (opcional)
  className?: string;    // Clases CSS adicionales (opcional)
  color?: string;        // Color personalizado (opcional)
  strokeWidth?: number;  // Grosor del trazo (opcional)
}

// 3. Base de datos de paths SVG - CADA ICONO ES UN PATH SVG
const iconPaths: Record<IconName, string> = {
  // Icono de papelera (trash)
  trash: 'M21 21L9 21 M15.889 14.8891L8.46436 7.46448 M2.8934 12.6066L12.0858 3.41421C12.8668 2.63317 14.1332 2.63317 14.9142 3.41421L19.864 8.36396C20.645 9.14501 20.645 10.4113 19.864 11.1924L10.6213 20.435C10.2596 20.7968 9.76894 21 9.25736 21C8.74577 21 8.25514 20.7968 7.8934 20.435L2.8934 15.435C2.11235 14.654 2.11235 13.3877 2.8934 12.6066Z',
  
  // Icono de editar (edit)
  edit: 'M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942',
  
  // Icono de agregar (plus)
  plus: 'M8 12H12M16 12H12M12 12V8M12 12V16 M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z',
  
  // Icono de buscar (search)
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  
  // Icono de recargar (reload)
  reload: 'M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8 M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3',
  
  // Icono de usuario (user)
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  
  // Icono de edificio (building)
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  
  // Icono de check (check)
  check: 'M5 13l4 4L19 7',
  
  // Icono de cerrar (close)
  close: 'M6 18L18 6M6 6l12 12',
  
  // Icono de menú (menu)
  menu: 'M4 6h16M4 12h16M4 18h16',

  //ordenar
  up: 'M14 10L2 10 M10 14H2 M6 18H2 M18 6L2 6 M19 10V20M19 20L22 17M19 20L16 17',
  down: 'M14 14L2 14 M10 10H2 M6 6H2 M18 18H2 M19 14V4M19 4L22 7M19 4L16 7'
};

// 4. El componente principal de Icono
const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 16, 
  className = '', 
  color = 'currentColor',
  strokeWidth = 2 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`icon icon-${name} ${className}`}
      aria-hidden="true" // Para accesibilidad
    >
      <path d={iconPaths[name]} />
    </svg>
  );
};

export default Icon;