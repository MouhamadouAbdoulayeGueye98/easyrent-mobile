import { api } from './api';

export async function getProperties(filters = {}) {
  const response = await api.get('/properties', { params: filters });
  return response.data;
}

export async function getPropertyById(id) {
  const response = await api.get(`/properties/${id}`);
  return response.data;
}