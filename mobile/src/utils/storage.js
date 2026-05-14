import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const saveToken = async (token) => {
  if (Platform.OS === 'web') {
    localStorage.setItem('auth_token', token);
  } else {
    await SecureStore.setItemAsync('auth_token', token);
  }
};

export const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('auth_token');
  } else {
    return await SecureStore.getItemAsync('auth_token');
  }
};

export const removeToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem('auth_token');
  } else {
    await SecureStore.deleteItemAsync('auth_token');
  }
};
