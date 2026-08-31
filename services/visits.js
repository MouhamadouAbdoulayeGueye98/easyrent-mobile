import { api } from "./api";

export const createVisit = async (visitData) => {
  const response = await api.post("/visits", visitData);
  return response.data;
};

export const getVisits = async () => {
  const response = await api.get("/visits");
  return response.data;
};

export const acceptVisit = async (id) => {
  const response = await api.patch(`/visits/${id}/accept`);
  return response.data;
};

export const refuseVisit = async (id) => {
  const response = await api.patch(`/visits/${id}/refuse`);
  return response.data;
};