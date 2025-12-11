import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  role: string;
  agency: string; 
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: { username: string, password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
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
  // Estados
  const [user, setUser] = useState<User | null>(() => {
    // Intentar cargar usuario desde localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Configurar axios con el token si existe al cargar
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, [token]);

  const login = async (credentials: { username: string, password: string }) => {
    try {
      setLoading(true);
      console.log('Intentando login con:', credentials);
      
      const response = await axios.post('http://localhost:3000/auth/login', credentials, {
        timeout: 5000,
      });
      
      console.log('Respuesta del servidor:', response);
      
      const { token, user } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Actualizar estados
      setToken(token);
      setUser({
        id: user.id,
        username: user.username,
        role: user.role,
        agency: user.agency, // <-- Guardar la agencia
      });
      setIsAuthenticated(true);
      
      // Configurar axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    } catch (error: any) {
      console.error('Error completo:', error);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
      } else if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Credenciales incorrectas');
        } else if (error.response.status === 404) {
          throw new Error('Endpoint no encontrado. Verifica la URL.');
        } else {
          throw new Error(`Error del servidor: ${error.response.status}`);
        }
      } else if (error.request) {
        throw new Error('No se recibió respuesta del servidor');
      } else {
        throw new Error('Error de conexión inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpiar estados
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Eliminar header de autorización de axios
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};