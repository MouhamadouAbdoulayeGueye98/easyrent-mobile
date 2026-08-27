import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';


export async function getUserRole() {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error("Erreur getUserRole:", error.response?.data || error.message);
    return null;
  }
}

export async function registerClient(data) {
  const response = await api.post('/auth/register', {
    name: data.firstName,
    email: data.email,
    password: data.password,
    role: 'client',
  });

  if (response.data.access_token) {
    await AsyncStorage.setItem('access_token', response.data.access_token);
  }

  return response.data;
}


export async function registerPublisher(data) {
  const response = await api.post('/auth/register', {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    password: data.password,
    phone: data.phone,
    city: data.city,
    publisherType: data.publisherType,
    role: 'publisher',
  });

  if (response.data.access_token) {
    await AsyncStorage.setItem('access_token', response.data.access_token);
  }

  return response.data;
}


export async function login(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  if (response.data.access_token) {
    // Stockage immédiat et sécurisé du nouveau token
    await AsyncStorage.setItem('access_token', response.data.access_token);
  }

  return response.data;
}


export async function logout() {
  await AsyncStorage.removeItem('access_token');
}


export async function resetPassword(email) {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
}