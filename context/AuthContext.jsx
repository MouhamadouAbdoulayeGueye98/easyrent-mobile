import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { router } from 'expo-router';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredUser() {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          const response = await api.get('/auth/profile');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Session expirée ou invalide', error);
        await AsyncStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    }
    loadStoredUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    setUser(null);
    // Redirection vers la page visiteur / index principal
    router.replace('/'); 
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);