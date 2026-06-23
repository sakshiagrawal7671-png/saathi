import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuth } from './src/hooks/useAuth';

export default function App() {
  const { user, loading, login, register, logout } = useAuth();
  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator
          user={user}
          loading={loading}
          onLogin={login}
          onRegister={register}
          onLogout={logout}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
