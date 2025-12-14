"use client"
import { Card } from "./card"
import { Badge } from "./badge"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Building2, Briefcase, User, Sparkles } from "lucide-react"

interface UserProfileProps {
  user: {
    id: string
    username: string
    role: string
    agency: string
    artist: string
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  // Imágenes de ejemplo para el carrusel
  const galleryImages = [
    { id: 1, query: "professional music studio recording" },
    { id: 2, query: "live concert performance stage lights" },
    { id: 3, query: "artist in recording booth with microphone" },
    { id: 4, query: "music producer mixing console" },
    { id: 5, query: "acoustic guitar close up" },
    { id: 6, query: "vinyl records collection" },
    { id: 7, query: "concert crowd silhouette" },
    { id: 8, query: "music notes abstract background" },
  ]

  // Duplicar las imágenes para el efecto de loop infinito
  const duplicatedImages = [...galleryImages, ...galleryImages]

  const getInitials = (name: string) => {
    return name
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header con gradiente sutil */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">Profile Dashboard</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Welcome back</h1>
      </div>

      {/* Card Principal del Perfil */}
      <Card className="p-6 md:p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/10 shadow-md">
              <AvatarImage
                src={`/placeholder.svg?height=128&width=128&query=professional%20avatar`}
                alt={user.username}
              />
              <AvatarFallback className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Información del Usuario */}
          <div className="flex-1 space-y-4">
            {/* Username */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{user.username}</h2>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </div>

            {/* Detalles en Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Role */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Role</p>
                  <p className="text-sm font-semibold">{user.role}</p>
                </div>
              </div>

              {/* Agency */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="p-2 rounded-md bg-accent/10 text-accent">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Agency</p>
                  <p className="text-sm font-semibold">{user.agency}</p>
                </div>
              </div>

              {/* Artist */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors sm:col-span-2 lg:col-span-1">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Managing Artist</p>
                  <p className="text-sm font-semibold">{user.artist}</p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary" className="px-3 py-1">
                Active
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Sección de Galería con Scroll Automático */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Gallery</h3>
          <p className="text-sm text-muted-foreground">Recent moments</p>
        </div>

        {/* Contenedor del Carrusel con Overflow Hidden */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-md">
          {/* Gradientes en los bordes para efecto fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

          {/* Carrusel con animación */}
          <div className="flex animate-scroll hover:animation-pause py-4">
            {duplicatedImages.map((image, index) => (
              <div key={`${image.id}-${index}`} className="flex-shrink-0 px-2">
                <div className="relative w-64 h-40 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  <img
                    src={`/.jpg?height=160&width=256&query=${image.query}`}
                    alt={`Gallery image ${image.id}`}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de interacción */}
        <p className="text-xs text-center text-muted-foreground">Hover to pause • Auto-scrolling gallery</p>
      </div>
    </div>
  )
}
