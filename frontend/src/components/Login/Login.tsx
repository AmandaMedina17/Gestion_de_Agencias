import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // Estado para errores
  const [loading, setLoading] = useState(false); //  Estado para loading

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        // 🆕 LLAMADA REAL AL BACKEND
        await login({ 
          username: username,      // Cambiamos username por email
          password: password 
        });
        
        // 🆕 Redirigir según el rol del usuario (viene del backend)
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'manager') {
          navigate('/manager');
        } else if (user.role === 'artist') {
          navigate('/artist');
        } else if (user.role === 'admin') {
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
  };

  return (
    <div className="login-container">
      <div id="login" className="screen active">
        {/* Mitad izquierda - Solo "Bienvenido" */}
        <div className="login-half welcome-half">
          <h1 className="welcome-title">Hola,</h1>
          <h1 className="welcome-title">bienvenido!</h1>
          <h5 className='info'>Ingrese usuario y contraseña para comenzar la gestión de agencias de kpop</h5>
        </div>

        {/* Mitad derecha - Campos de login */}
        <div className="login-half form-half">
          <form className="login-form" onSubmit={handleLogin}>
            <h2 className='sign_in'>SIGN IN</h2>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="input-container">
              <input
                type="text"
                name="username"
                className="label_style"
                placeholder="Nombre de Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <span className="input-icon">👤</span>
            </div>

            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="label_style"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span className="input-icon">🔒</span>
            </div>

            <div className="show-password-container">
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                disabled={loading}
              />
              <label htmlFor="show-password">Mostrar contraseña</label>
            </div>

            <button 
              type="submit" 
              className="button_check"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'} 
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;