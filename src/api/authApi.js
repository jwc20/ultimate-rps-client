import { apiClient } from './apiClient';
import { tokenManager } from './tokenManager';

export const authApi = {
  async login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.postFormData('/token', formData);
    
    if (response.access_token) {
      tokenManager.setToken(response.access_token);
    }
    
    return response;
  },

  async register(username, password) {
    const response = await apiClient.post('/register', {
      username,
      password,
    });
    return response;
  },

  async getCurrentUser() {
    return await apiClient.get('/users/me/');
  },

  async logout() {
    tokenManager.removeToken();
    // await apiClient.post('/logout');
  },

  isAuthenticated() {
    const token = tokenManager.getToken();
    return token && !tokenManager.isTokenExpired(token);
  }
};