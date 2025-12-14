"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Sparkles } from "lucide-react"
import { useAuth } from "../../context/AuthContext" 
import "./globals.css"
import { useNavigate } from "react-router-dom"   
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export enum UserRole {
  AGENCY_MANAGER = 'AGENCY_MANAGER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN',
}

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()  
  
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  // Estados para notificaciones
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!username.trim() || !password.trim()) {
      showNotification("Por favor, completa todos los campos", "warning")
      return
    }

    try {
      await login({ username, password })
      
      // Obtener usuario del localStorage después del login exitoso
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Redirigir según el rol
      if (user.role === UserRole.AGENCY_MANAGER) {
        navigate('/manager');
      } else if (user.role === UserRole.ARTIST) {
        navigate('/artist');
      } else if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      
    } catch (err: any) {
      // Manejar diferentes tipos de errores
      let errorMsg = "Error al iniciar sesión"
      
      if (err.response) {
        // Error de respuesta del servidor
        if (err.response.status === 401) {
          errorMsg = "Credenciales incorrectas. Verifica tu usuario y contraseña."
        } else if (err.response.status === 404) {
          errorMsg = "Usuario no encontrado"
        } else if (err.response.status >= 500) {
          errorMsg = "Error del servidor. Por favor, intenta más tarde."
        } else {
          errorMsg = err.response.data?.message || "Error en la autenticación"
        }
      } else if (err.request) {
        // Error de red
        errorMsg = "Error de conexión. Verifica tu conexión a internet."
      } else {
        // Error en la configuración de la solicitud
        errorMsg = err.message || "Error al procesar la solicitud"
      }
      
      showNotification(errorMsg, "error")
    }
  }

  // Función para mostrar notificaciones
  const showNotification = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlertMessage(message)
    setAlertSeverity(severity)
    setOpenAlert(true)
  }

  // Función para cerrar la notificación
  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Panel Izquierdo */}
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="brand-header">
              <Sparkles className="brand-icon" />
              <h1 className="brand-title">K-Pop Agency</h1>
            </div>

            <h2 className="welcome-title">
              Hola,
              <br />
              ¡bienvenido!
            </h2>

            <p className="welcome-description">Sistema de gestión profesional para agencias K-pop</p>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Gestión de artistas</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Control de actividades</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Análisis y reportes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="form-section">
          <div className="form-content">

            <div className="form-header">
              <h3 className="form-title">Iniciar Sesión</h3>
              <p className="form-subtitle">Accede a tu panel de gestión</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">

              <div className="form-group">
                <label className="form-label">Usuario</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-button" 
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>

            </form>
          </div>
        </div>

      </div>

      {/* Notificación Snackbar de MUI */}
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}