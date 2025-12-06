"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, User, Lock, Sparkles } from "lucide-react"
import { useAuth } from "../../context/AuthContext"   // <-- IMPORTANTE
import "./globals.css"
import { useNavigate } from "react-router-dom"    // <-- si usas react-router


export enum UserRole {
  AGENCY_MANAGER = 'AGENCY_MANAGER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN',
}

export default function Login() {
  const navigate = useNavigate() // <-- quitar si NO usas router

  const { login, loading } = useAuth()  // <-- usamos el contexto
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [error, setError] = useState(''); // Estado para errores
    const [loadingg, setLoading] = useState(false); //  Estado para loading
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setLoading(true);
    setError('');

    try {
      await login({ username, password })   // <-- llamada real al contexto
const user = JSON.parse(localStorage.getItem('user') || '{}');
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
        // 🆕 Manejar errores del backend
        setError(err.message || 'Error al iniciar sesión');
      } finally {
        setLoading(false);
      }
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
                <span>Control de eventos</span>
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

            {/* Mostrar errores */}
            {errorMessage && (
              <div className="error-box">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">

              <div className="form-group">
                <label className="form-label">Usuario</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
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
                  <Lock className="input-icon" />
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
                  >
                    {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
