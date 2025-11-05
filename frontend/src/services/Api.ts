import { authService } from "./AuthService";

class ApiService {
  private baseURL = 'http://localhost:3000';

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = authService.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    // 🎯 Manejar errores de autenticación
    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
  }

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PATCH', 
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();