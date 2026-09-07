import { api } from './api';

export async function getProperties(filters = {}) {
  const response = await api.get('/properties', { params: filters });
  return response.data;
}

export async function getPropertyById(id) {
  const response = await api.get(`/properties/${id}`);
  return response.data;
}

export async function createProperty(data) {
  const response = await api.post('/properties', data);
  return response.data;
}

// Envoie une seule photo. À appeler une fois par image après la création de la Property.
export async function uploadPropertyPhoto(propertyId, imageAsset) {
  const formData = new FormData();

  // imageAsset vient de expo-image-picker : { uri, fileName?, mimeType? }
  formData.append('file', {
    uri: imageAsset.uri,
    name: imageAsset.fileName || `photo_${Date.now()}.jpg`,
    type: imageAsset.mimeType || 'image/jpeg',
  });

  const response = await api.post(`/properties/${propertyId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function uploadPropertyPhotos(propertyId, images) {
  const results = [];
  for (const image of images) {
    const photo = await uploadPropertyPhoto(propertyId, image);
    results.push(photo);
  }
  return results;
}