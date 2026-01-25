import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_API_URL } from './src/constants/theme';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Verify token with backend
        const response = await fetch(`${AUTH_API_URL}/verify`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const handleSignup = async (name, email, password, phoneNumber, childAge, region, problemDescription) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber,
          childAge,
          region,
          problemDescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator 
          isAuthenticated={isAuthenticated}
          user={user}
          token={token}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onLogout={handleLogout}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
