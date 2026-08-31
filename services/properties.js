import { api } from './api';

export async function getProperties(filters = {}) {
  const response = await api.get('/properties', { params: filters });
  return response.data;
}

export async function getPropertyById(id) {
  const response = await api.get(`/properties/${id}`);
  return response.data;
}

export async function uploadPropertyPhoto(propertyId, imageUri) {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: `photo-${Date.now()}.jpg`,
    type: 'image/jpeg',
  });

  const response = await api.post(
    `/properties/${propertyId}/photos`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
}