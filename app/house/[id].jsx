import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.68.145:3000';

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // --- Authentification ---
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/registerclient',
        method: 'POST',
        body: userData,
      }),
    }),
    registerPublisher: builder.mutation({
      query: (publisherData) => ({
        url: '/auth/register-publisher',
        method: 'POST',
        body: publisherData,
      }),
    }),

    // --- Propriétés ---
    getProperties: builder.query({
      query: () => '/properties',
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data || response?.properties || [];
      },
    }),
    getPropertyById: builder.query({
      query: (id) => `/properties/${id}`,
    }),
    createProperty: builder.mutation({
      query: (propertyData) => ({
        url: '/properties',
        method: 'POST',
        body: propertyData,
      }),
    }),

    // --- Visites & Conversations ---
    createVisit: builder.mutation({
      query: (visitData) => ({
        url: '/visits',
        method: 'POST',
        body: visitData,
      }),
    }),
    startConversation: builder.mutation({
      query: (chatData) => ({
        url: '/conversations',
        method: 'POST',
        body: chatData,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useRegisterPublisherMutation,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useCreateVisitMutation,
  useStartConversationMutation
} = servicesApi;