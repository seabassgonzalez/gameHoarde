import { api } from './api';
import { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },
};