// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  login: (credentials: { username: string, password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials: { username: string, password: string }) => {
    try {
      console.log('Intentando login con:', credentials); // 🆕 Debug
      
      const response = await axios.post('http://localhost:3000/auth/login', credentials, {
        timeout: 5000, // 🆕 Timeout de 5 segundos
      });
      
      console.log('Respuesta del servidor:', response); // 🆕 Debug
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      
    } catch (error: any) {
      console.error('Error completo:', error); // 🆕 Debug completo
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
      } else if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
          throw new Error('Credenciales incorrectas');
        } else if (error.response.status === 404) {
          throw new Error('Endpoint no encontrado. Verifica la URL.');
        } else {
          throw new Error(`Error del servidor: ${error.response.status}`);
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        throw new Error('No se recibió respuesta del servidor');
      } else {
        throw new Error('Error de conexión inesperado');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};