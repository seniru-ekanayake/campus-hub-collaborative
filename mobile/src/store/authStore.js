import { create } from 'zustand';
import { saveToken, getToken, removeToken } from '../utils/storage';
import apiClient from '../services/apiClient';
import { ENDPOINTS } from '../constants/api';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    const token = await getToken();
    if (token) {
      set({ token, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  login: async (username, password) => {
    const response = await apiClient.post(ENDPOINTS.LOGIN, { username, password });
    const { token, ...user } = response.data;
    await saveToken(token);
    set({ user, token, isAuthenticated: true });
    return response.data;
  },

  register: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.REGISTER, payload);
    return response.data;
  },

  fetchProfile: async () => {
    const response = await apiClient.get(ENDPOINTS.PROFILE);
    set({ user: response.data });
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await apiClient.put(ENDPOINTS.PROFILE, payload);
    set({ user: response.data });
    return response.data;
  },

  logout: async () => {
    await removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
