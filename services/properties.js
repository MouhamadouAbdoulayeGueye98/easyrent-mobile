import { api } from './api';
import { isRecent } from '../utils/dates';

const ALL_PROPERTIES_LIMIT = 50;

function normalizePage(result, page, limit) {
  return {
    data: Array.isArray(result?.data) ? result.data : [],
    total: result?.total ?? 0,
    page: result?.page ?? page,
    limit: result?.limit ?? limit,
    totalPages: result?.totalPages ?? 1,
  };
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

// Filtres appliqués localement quand l'API déployée ne les gère pas encore.
function applyLocalFilters(items, filters) {
  const term = (filters.search || "").trim().toLowerCase();
  const type = filters.type;
  const minPrice = toNumber(filters.minPrice);
  const maxPrice = toNumber(filters.maxPrice);
  const recent = filters.recent === true || filters.recent === "true";

  return items.filter((item) => {
    if (recent && !isRecent(item.createdAt)) return false;

    if (type && item.type !== type) return false;

    if (term) {
      const haystack = [item.title, item.city, item.quartier]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(term)) return false;
    }

    const price = toNumber(item.price);

    if (minPrice !== null && price !== null && price < minPrice) return false;
    if (maxPrice !== null && price !== null && price > maxPrice) return false;

    return true;
  });
}

function paginateLocally(items, page, limit, filters) {
  const filtered = applyLocalFilters(items, filters);
  const total = filtered.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}

async function requestPage(filters, page, limit) {
  const response = await api.get('/properties', {
    params: { ...filters, page, limit },
  });

  return response.data;
}

// Une page d'annonces : { data, total, page, limit, totalPages }
export async function getPropertiesPage({ page = 1, limit = 5, ...filters } = {}) {
  const result = await requestPage(filters, page, limit);

  // Compatibilité avec l'ancienne API qui renvoyait toutes les annonces
  // dans un tableau : on filtre et pagine côté mobile.
  if (Array.isArray(result)) {
    return paginateLocally(result, page, limit, filters);
  }

  return normalizePage(result, page, limit);
}

// Toutes les annonces (utilisé par l'accueil, les favoris et la carte).
export async function getProperties(filters = {}) {
  const firstPage = await requestPage(filters, 1, ALL_PROPERTIES_LIMIT);

  // Ancienne API : le tableau contient déjà toutes les annonces.
  if (Array.isArray(firstPage)) {
    return firstPage;
  }

  const properties = Array.isArray(firstPage?.data) ? [...firstPage.data] : [];
  const totalPages = firstPage?.totalPages || 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await requestPage(filters, page, ALL_PROPERTIES_LIMIT);
    properties.push(...(Array.isArray(nextPage?.data) ? nextPage.data : []));
  }

  return properties;
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