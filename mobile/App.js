import 'react-native-gesture-handler';
import React, { useEffect, useCallback } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import useAuthStore from './src/store/authStore';
import LoadingSpinner from './src/components/LoadingSpinner';

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0B1628',
    card: '#112240',
    text: '#F0F4FF',
    border: '#1E3A5F',
  },
};

export default function App() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    initialize();
    // Dismiss the native splash screen immediately to prevent any cached white splash screen from hanging
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  if (!fontsLoaded || isLoading) {
    return <LoadingSpinner fontsLoaded={fontsLoaded} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={AppTheme}>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
