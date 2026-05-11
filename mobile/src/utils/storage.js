import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'campus_hub_jwt';

const saveToken = async (token) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export { saveToken, getToken, removeToken };
