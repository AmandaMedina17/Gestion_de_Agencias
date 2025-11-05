import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username && password) {
      if (username.includes('admin')) {
        navigate('/admin');
      } else if (username.includes('manager')) {
        navigate('/manager');
      } else {
        alert('Usuario no reconocido. Use "admin" o "manager" en el nombre.');
      }
    } else {
      alert('Por favor complete ambos campos');
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

            <div className="input-container">
              <input
                type="text"
                name="username"
                className="label_style"
                placeholder="Nombre de Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
              />
              <span className="input-icon">🔒</span>
            </div>

            <div className="show-password-container">
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="show-password">Mostrar contraseña</label>
            </div>


            <button type="submit" className="button_check">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;