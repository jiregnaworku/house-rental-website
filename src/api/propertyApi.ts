import axios from 'axios';
import { Property, PropertyFilters } from '../types/property.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const propertyApi = {
  // Get all properties with optional filters
  getProperties: async (filters?: PropertyFilters): Promise<{ data: Property[] }> => {
    const response = await api.get('/properties', { params: filters });
    return response.data;
  },

  // Get single property by ID
  getPropertyById: async (id: string): Promise<{ data: Property }> => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property
  createProperty: async (propertyData: FormData): Promise<{ data: Property }> => {
    const response = await api.post('/properties', propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update property
  updateProperty: async (id: string, propertyData: FormData): Promise<{ data: Property }> => {
    const response = await api.patch(`/properties/${id}`, propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },

  // Upload property images
  uploadImages: async (files: File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/properties/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default propertyApi;
