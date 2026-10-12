const BASE_URL = "http://192.168.68.155:3000";

// Helper interne pour factoriser les appels fetch
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function getProperties(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = `/properties${queryParams ? `?${queryParams}` : ""}`;
  return await request(endpoint, { method: "GET" });
}

export async function getMyProperties() {
  return await request("/properties/my", { method: "GET" });
}

export async function getPropertyById(id) {
  return await request(`/properties/${id}`, { method: "GET" });
}

export async function createProperty(data) {
  return await request("/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProperty(id, data) {
  return await request(`/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProperty(id) {
  return await request(`/properties/${id}`, {
    method: "DELETE",
  });
}

export async function deletePropertyPhoto(photoId) {
  return await request(`/properties/photos/${photoId}`, {
    method: "DELETE",
  });
}

export async function uploadPropertyPhoto(propertyId, image) {
  const formData = new FormData();

  formData.append("file", {
    uri: image.uri,
    name: image.fileName || `property-${Date.now()}.jpg`,
    type: image.mimeType || "image/jpeg",
  });

  return await request(`/properties/${propertyId}/photos`, {
    method: "POST",
    body: formData,
  });
}