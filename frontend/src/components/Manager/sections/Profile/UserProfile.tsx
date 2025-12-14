"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "../../../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { Building2, Briefcase, Mail, Calendar, Users, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { agencyService } from '../../../../services/AgencyService'
import { groupService } from '../../../../services/GroupService'
import './profile.css'

import sk from "../../../../../public/images/straykids.jpg"
import { PlaceResponseDto } from "../../../../../../backend/src/ApplicationLayer/DTOs/placeDto/response-place.dto"

interface ManagerProfileProps {
  manager: {
    name: string
    role: string
    email: string
    agency: string
    agencyId: string
    joinDate: string
  }
  agencyDetails?: {
    nameAgency: string
    place: PlaceResponseDto
    dateFundation: string | Date
  } | null
}

interface Stats {
  artists: number
  apprentices: number
  groups: number
}

interface ArtistWithGroup {
  id: string
  artist: any
  group: any | null
}

// Array de imágenes para el carrusel
const carouselImages = [
  {
    src: "./logo.jpg",
    alt: "Concierto en vivo 2024",
    title: "Concierto en Vivo",
    description: "Presentación del grupo en el estadio nacional"
  },
  {
    src: "./logo.jpg",
    alt: "Sesión de fotos del grupo",
    title: "Sesión Fotográfica",
    description: "Nueva sesión de fotos para el álbum"
  },
  {
    src: "./logo.jpg",
    alt: "Entrenamiento en estudio",
    title: "Entrenamiento",
    description: "Sesión de entrenamiento en el estudio principal"
  },
  {
    src: "./logo.jpg",
    alt: "Premiación anual",
    title: "Premios Anuales",
    description: "Ceremonia de premiación de la agencia"
  },
  {
    src: "./logo.jpg",
    alt: "Firma de autógrafos",
    title: "Firma de Autógrafos",
    description: "Evento de firma de autógrafos con fans"
  },
  {
    src: "./logo.jpg",
    alt: "Grabación en estudio",
    title: "Grabación en Estudio",
    description: "Sesión de grabación del nuevo álbum"
  }
];

// Placeholder images
const placeholderImages = [
  {
    src: "./logo.jpg",
    alt: "Concierto en vivo",
    title: "Concierto en Vivo",
    description: "Nuestros artistas en el escenario principal"
  },
  {
    src: "./straykids.jpg",
    alt: "Estudio de grabación",
    title: "Estudio de Grabación",
    description: "Sesión de grabación profesional"
  },
  {
    src: "./bts.jpg",
    alt: "Danza y coreografía",
    title: "Entrenamiento de Baile",
    description: "Coreografía para la próxima presentación"
  },
  {
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    alt: "Presentación musical",
    title: "Presentación Musical",
    description: "Show en vivo para fans"
  },
  {
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    alt: "Práctica vocal",
    title: "Práctica Vocal",
    description: "Entrenamiento de voz profesional"
  }
];

export default function ManagerProfile({ manager, agencyDetails }: ManagerProfileProps) {
  const [stats, setStats] = useState<Stats>({
    artists: 0,
    apprentices: 0,
    groups: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const hasLoadedStats = useRef(false)
    const carouselTrackRef = useRef<HTMLDivElement>(null)


  // Usa tus imágenes o los placeholders
  const images = carouselImages.length > 0 ? carouselImages : placeholderImages

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Navegación del carrusel - solo hacia la izquierda
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  // Función para manejar el autoplay con useRef
  const handleAutoPlayToggle = () => {
    if (carouselTrackRef.current) {
      const isPaused = carouselTrackRef.current.style.animationPlayState === 'paused';
      carouselTrackRef.current.style.animationPlayState = isPaused ? 'running' : 'paused';
      setAutoPlay(!isPaused);
    }
  }

  // Función para ir a una imagen específica
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    if (carouselTrackRef.current) {
      // Detener animación y posicionar en la imagen seleccionada
      carouselTrackRef.current.style.animation = 'none';
      carouselTrackRef.current.style.transform = `translateX(-${index * (100 / images.length)}%)`;
      
      // Opcional: reiniciar animación después de un tiempo
      setTimeout(() => {
        if (carouselTrackRef.current && autoPlay) {
          carouselTrackRef.current.style.animation = 'slideLeft 30s linear infinite';
        }
      }, 100);
    }
  }

  

  // Auto-play del carrusel hacia la izquierda
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      nextImage() // Solo se mueve hacia adelante (izquierda)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, currentImageIndex])

  // Cargar estadísticas
  useEffect(() => {
    if (hasLoadedStats.current) return

    const loadStats = async () => {
      setLoadingStats(true)
      try {
        const artistsResponse = await agencyService.getActiveArtistsWithGroup(manager.agencyId)
        const apprenticesData = await agencyService.getAgencyApprentices(manager.agencyId)
        const groupsData = await groupService.findAll()
        
        const agencyGroups = groupsData.filter((group: any) => 
          group.agencyID === manager.agencyId && group.is_created
        )
        
        setStats({
          artists: Array.isArray(artistsResponse) ? artistsResponse.length : 0,
          apprentices: apprenticesData?.length || 0,
          groups: agencyGroups.length
        })
        
        hasLoadedStats.current = true
        
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoadingStats(false)
      }
    }

    loadStats()
    
    return () => {
      // Si quieres que se recargue cada vez que se vuelva a mostrar, puedes comentar esta línea
      // hasLoadedStats.current = false
    }
  }, [manager.agencyId])

  const reloadStats = async () => {
    hasLoadedStats.current = false
    setLoadingStats(true)
    
    try {
      const artistsResponse = await agencyService.getActiveArtistsWithGroup(manager.agencyId)
      const apprenticesData = await agencyService.getAgencyApprentices(manager.agencyId)
      const groupsData = await groupService.findAll()
      
      const agencyGroups = groupsData.filter((group: any) => 
        group.agencyID === manager.agencyId && group.is_created
      )
      
      setStats({
        artists: Array.isArray(artistsResponse) ? artistsResponse.length : 0,
        apprentices: apprenticesData?.length || 0,
        groups: agencyGroups.length
      })
      
      hasLoadedStats.current = true
    } catch (error) {
      console.error("Error recargando stats:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  return (
    <div className="manager-profile-container">
      {/* Header con gradiente sutil */}
      <div className="manager-profile-header">
        <h1 className="manager-profile-title">Bienvenido, {manager.name}</h1>
      </div>

      {/* Card Principal del Perfil */}
      <div className="manager-profile-main-card">
        <div className="manager-profile-main-content">
          {/* Avatar */}
          <div className="manager-profile-avatar-container">
            <Avatar className="manager-profile-avatar">
              <AvatarFallback className="manager-profile-avatar-fallback">
                {getInitials(manager.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Información del Manager */}
          <div className="manager-profile-info">
            {/* Nombre y Email */}
            <div className="manager-profile-name-section">
              <h2 className="manager-profile-name">{manager.name}</h2>
              
            </div>

            {/* Detalles en Grid */}
            <div className="manager-profile-details-grid">
              {/* Role */}
              <div className="manager-profile-detail-item">
                <div className="manager-profile-detail-icon role-icon">
                  <Briefcase className="manager-profile-detail-icon-svg" />
                </div>
                <div className="manager-profile-detail-text">
                  <p className="manager-profile-detail-label">Role</p>
                  <p className="manager-profile-detail-value">{manager.role}</p>
                </div>
              </div>

              {/* Agency */}
              <div className="manager-profile-detail-item">
                <div className="manager-profile-detail-icon agency-icon">
                  <Building2 className="manager-profile-detail-icon-svg" />
                </div>
                <div className="manager-profile-detail-text">
                  <p className="manager-profile-detail-label">Agency</p>
                  <p className="manager-profile-detail-value">{manager.agency}</p>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="manager-profile-stats-grid">
        {/* Total Artists */}
        <div className="manager-profile-stat-card">
          <div className="manager-profile-stat-content">
            <div className="manager-profile-stat-text">
              <p className="manager-profile-stat-label">Total Artists</p>
              {loadingStats ? (
                <div className="manager-profile-stat-loading"></div>
              ) : (
                <p className="manager-profile-stat-value">{stats.artists}</p>
              )}
            </div>
            <div className="manager-profile-stat-icon artists-icon">
              <Users className="manager-profile-stat-icon-svg" />
            </div>
          </div>
        </div>

        {/* Total Apprentices */}
        <div className="manager-profile-stat-card">
          <div className="manager-profile-stat-content">
            <div className="manager-profile-stat-text">
              <p className="manager-profile-stat-label">Total Apprentices</p>
              {loadingStats ? (
                <div className="manager-profile-stat-loading"></div>
              ) : (
                <p className="manager-profile-stat-value">{stats.apprentices}</p>
              )}
            </div>
            <div className="manager-profile-stat-icon apprentices-icon">
              <Users className="manager-profile-stat-icon-svg" />
            </div>
          </div>
        </div>

        {/* Total Groups */}
        <div className="manager-profile-stat-card">
          <div className="manager-profile-stat-content">
            <div className="manager-profile-stat-text">
              <p className="manager-profile-stat-label">Total Groups</p>
              {loadingStats ? (
                <div className="manager-profile-stat-loading"></div>
              ) : (
                <p className="manager-profile-stat-value">{stats.groups}</p>
              )}
            </div>
            <div className="manager-profile-stat-icon groups-icon">
              <Award className="manager-profile-stat-icon-svg" />
            </div>
          </div>
        </div>
      </div>

      
      {/* Carrusel de Imágenes */}
<div className="manager-profile-gallery">
  <div className="manager-profile-gallery-header">
    <h3 className="manager-profile-gallery-title">Gallery</h3>
    <div className="manager-profile-gallery-controls">
      <button 
        onClick={() => {
          const track = document.querySelector('.manager-profile-carousel-track') as HTMLElement;
          if (track) {
            const isPaused = track.style.animationPlayState === 'paused';
            track.style.animationPlayState = isPaused ? 'running' : 'paused';
            setAutoPlay(!isPaused);
          }
        }}
        className="manager-profile-autoplay-btn"
      >
        {autoPlay ? "Pause" : "Play"}
      </button>
    </div>
  </div>
  
  <div className="manager-profile-carousel-container">
    {/* Botones de navegación */}
    <button
      onClick={() => {
        const track = document.querySelector('.manager-profile-carousel-track') as HTMLElement;
        if (track) {
          const currentTransform = track.style.transform || 'translateX(0px)';
          const currentX = parseInt(currentTransform.match(/translateX\((-?\d+)px\)/)?.[1] || '0');
          track.style.transform = `translateX(${currentX + 220}px)`;
        }
      }}
      className="manager-profile-carousel-btn prev-btn"
      aria-label="Imagen anterior"
    >
      <ChevronLeft className="manager-profile-carousel-btn-icon" />
    </button>
    
    <button
      onClick={() => {
        const track = document.querySelector('.manager-profile-carousel-track') as HTMLElement;
        if (track) {
          const currentTransform = track.style.transform || 'translateX(0px)';
          const currentX = parseInt(currentTransform.match(/translateX\((-?\d+)px\)/)?.[1] || '0');
          track.style.transform = `translateX(${currentX - 220}px)`;
        }
      }}
      className="manager-profile-carousel-btn next-btn"
      aria-label="Siguiente imagen"
    >
      <ChevronRight className="manager-profile-carousel-btn-icon" />
    </button>
    
    {/* Contenedor con todas las imágenes en fila */}
    <div className="manager-profile-carousel-track">
      {images.map((image, index) => (
        <div key={index} className="manager-profile-carousel-slide">
          <img
            src={image.src}
            alt={image.alt}
            className="manager-profile-carousel-image"
          />
          <div className="manager-profile-carousel-overlay">
            <h4 className="manager-profile-carousel-title">{image.title}</h4>
            <p className="manager-profile-carousel-description">{image.description}</p>
          </div>
        </div>
      ))}
      {/* Duplicar imágenes para efecto infinito */}
      {images.map((image, index) => (
        <div key={`dup-${index}`} className="manager-profile-carousel-slide">
          <img
            src={image.src}
            alt={image.alt}
            className="manager-profile-carousel-image"
          />
          <div className="manager-profile-carousel-overlay">
            <h4 className="manager-profile-carousel-title">{image.title}</h4>
            <p className="manager-profile-carousel-description">{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  {/* Indicadores de imágenes */}
  <div className="manager-profile-carousel-indicators">
    {images.map((_, index) => (
      <button
        key={index}
        onClick={() => {
          const track = document.querySelector('.manager-profile-carousel-track') as HTMLElement;
          if (track) {
            // Calcular posición basada en el índice
            const position = -(index * 220 + index * 24); // 220px por imagen + 24px de gap
            track.style.animation = 'none';
            track.style.transform = `translateX(${position}px)`;
            setCurrentImageIndex(index);
          }
        }}
        className={`manager-profile-carousel-dot ${currentImageIndex === index ? "active" : ""}`}
        aria-label={`Ir a imagen ${index + 1}`}
      />
    ))}
  </div>
  
  {/* Contador de imágenes */}
  <div className="manager-profile-carousel-counter">
    {currentImageIndex + 1} / {images.length}
  </div>
</div>
        
    </div>
  )
}