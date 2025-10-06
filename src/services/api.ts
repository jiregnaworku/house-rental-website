// src/services/api.ts
export const API_URL = 'http://localhost:5000/api'; // adjust your backend URL

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '');
  if (!res.ok) {
    const message = isJson ? body?.message || body?.error || `API error: ${res.status}` : `API error: ${res.status}`;
    throw new Error(message);
  }
  return body;
};

// --- Auth API ---
export const authApi = {
  signup: async (email: string, password: string, role: string) => {
    const data = await fetchWithAuth('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (data?.token) localStorage.setItem('token', data.token);
    return data;
  },
  login: async (email: string, password: string) => {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data?.token) localStorage.setItem('token', data.token);
    return data;
  },
};

// Types
export interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  rent: number;
  status: 'available' | 'occupied' | 'vacant';
}

export interface Payment {
  id: string;
  tenantName: string;
  propertyName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  description?: string;
}

export interface TenantRequest {
  id: string;
  tenantName: string;
  propertyName: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface Profile {
  name: string;
  email: string;
}

// API functions
export const getProperties = async (): Promise<Property[]> => {
  const res = await fetchWithAuth('/properties');
  // Backend returns { status: 'success', data: { properties: [...] } }
  return res?.data?.properties ?? [];
};
export const getPayments = () => fetchWithAuth('/dashboard/payments');
export const getTenantRequests = () => fetchWithAuth('/dashboard/tenant-requests');
export const getLandlordOverview = () => fetchWithAuth('/dashboard/overview');
export const getProfile = () => fetchWithAuth('/profile');

export const approveRequest = (id: string) => fetchWithAuth(`/requests/${id}/approve`, { method: 'POST' });
export const rejectRequest = (id: string) => fetchWithAuth(`/requests/${id}/reject`, { method: 'POST' });
export const updateProfile = (data: Partial<Profile>) => fetchWithAuth('/profile', { method: 'PUT', body: JSON.stringify(data) });

// Property media endpoints
export const propertyApi = {
  getProperty: async (id: string) => {
    const res = await fetchWithAuth(`/properties/${id}`);
    return res?.data?.property;
  },
  createProperty: async (propertyData: any) => {
    const res = await fetchWithAuth('/properties', { method: 'POST', body: JSON.stringify(propertyData) });
    return res?.data?.property; // unwrap created property
  },
  updateProperty: async (id: string, propertyData: any) => {
    const res = await fetchWithAuth(`/properties/${id}`, { method: 'PATCH', body: JSON.stringify(propertyData) });
    return res?.data?.property;
  },
  deleteProperty: async (id: string) => fetchWithAuth(`/properties/${id}`, { method: 'DELETE' }),
  uploadImages: async (id: string, files: File[]): Promise<{ urls: string[] }> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    const res = await fetch(`${API_URL}/properties/${id}/images`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`Image upload failed: ${res.status}`);
    return res.json();
  },
  uploadPropertyImages: async (id: string, files: File[]) => propertyApi.uploadImages(id, files),
};
