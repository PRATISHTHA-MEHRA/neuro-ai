import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH0_CONFIG } from './src/constants/theme';
import AppNavigator from './src/navigation/AppNavigator';

WebBrowser.maybeCompleteAuthSession();

// Auth0 Configuration
const auth0Domain = AUTH0_CONFIG.domain;
const auth0ClientId = AUTH0_CONFIG.clientId;

const useProxy = true;
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const discovery = {
    authorizationEndpoint: `https://${auth0Domain}/authorize`,
    tokenEndpoint: `https://${auth0Domain}/oauth/token`,
    revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  };

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      responseType: AuthSession.ResponseType.Token,
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        nonce: 'nonce',
      },
    },
    discovery
  );

  // Check for existing auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  // Handle auth result
  useEffect(() => {
    if (result) {
      if (result.type === 'success') {
        const { access_token } = result.params;
        setAccessToken(access_token);
        
        // Get user info
        getUserInfo(access_token);
      }
    }
  }, [result]);

  const getUserInfo = async (token) => {
    try {
      const response = await fetch(`https://${auth0Domain}/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userInfo = await response.json();
      
      setUser(userInfo);
      setIsAuthenticated(true);
      
      // Store auth data
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  };

  const handleLogin = () => {
    promptAsync({ useProxy });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Optionally revoke token
      if (accessToken) {
        await WebBrowser.openAuthSessionAsync(
          `https://${auth0Domain}/v2/logout?client_id=${auth0ClientId}&returnTo=${redirectUri}`
        );
      }
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
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
