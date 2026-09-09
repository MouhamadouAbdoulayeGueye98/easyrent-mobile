import { api } from "./api";

export async function getProperties(filters = {}) {
  const response = await api.get("/properties", {
    params: filters,
  });

  return response.data;
}

export async function getMyProperties() {
  const response = await api.get("/properties/my");
  return response.data;
}

export async function getPropertyById(id) {
  const response = await api.get(`/properties/${id}`);
  return response.data;
}

export async function createProperty(data) {
  const response = await api.post("/properties", data);
  return response.data;
}

export async function updateProperty(id, data) {
  const response = await api.patch(`/properties/${id}`, data);
  return response.data;
}

export async function deleteProperty(id) {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
}

export async function deletePropertyPhoto(photoId) {
  const response = await api.delete(`/properties/photos/${photoId}`);
  return response.data;
}

export async function uploadPropertyPhoto(propertyId, image) {
  const formData = new FormData();

  formData.append("file", {
    uri: image.uri,
    name: image.fileName || `property-${Date.now()}.jpg`,
    type: image.mimeType || "image/jpeg",
  });

  const response = await api.post(
    `/properties/${propertyId}/photos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}