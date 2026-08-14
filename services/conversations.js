import { api } from './api';

export async function startConversation(propertyId) {
  const response = await api.post(`/conversations/property/${propertyId}`);
  return response.data;
}

export async function getConversations() {
  const response = await api.get('/conversations');
  return response.data;
}

export async function getMessages(conversationId) {
  const response = await api.get(`/conversations/${conversationId}/messages`);
  return response.data;
}

export async function sendMessage(conversationId, content) {
  const response = await api.post(`/conversations/${conversationId}/messages`, { content });
  return response.data;
}