import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'attendee' | 'organizer';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'attendee' | 'organizer' | 'admin';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
  },

  getCurrentUser: (): User | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  },
};

