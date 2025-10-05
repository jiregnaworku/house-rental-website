import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Property {
  _id: string;
  name: string;
  description: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: 'available' | 'occupied' | 'maintenance';
  images: string[];
  amenities: string[];
  location: {
    type: string;
    coordinates: number[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const propertyApi = {
  // Get all properties for the logged-in landlord
  getProperties: async (): Promise<Property[]> => {
    const response = await api.get('/api/properties');
    return response.data.data.properties;
  },

  // Get a single property by ID
  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/api/properties/${id}`);
    return response.data.data.property;
  },

  // Create a new property
  createProperty: async (propertyData: Omit<Property, '_id' | 'landlord' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
    const response = await api.post('/api/properties', propertyData);
    return response.data.data.property;
  },

  // Update a property
  updateProperty: async (id: string, propertyData: Partial<Property>): Promise<Property> => {
    const response = await api.patch(`/api/properties/${id}`, propertyData);
    return response.data.data.property;
  },

  // Delete a property
  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/api/properties/${id}`);
  },

  // Update property status
  updatePropertyStatus: async (id: string, status: 'available' | 'occupied' | 'maintenance'): Promise<Property> => {
    const response = await api.patch(`/api/properties/${id}/status`, { status });
    return response.data.data.property;
  },

  // Upload property images
  uploadImages: async (propertyId: string, files: File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post(`/api/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },
};

export default propertyApi;
