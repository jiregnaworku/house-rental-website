import { Payment, MaintenanceRequest } from '../types/dashboard';

const API_URL = 'http://localhost:5000/api';

// Types for dashboard overview
export interface DashboardOverview {
  totalProperties: number;
  activeTenants: number;
  pendingRequests: number;
  monthlyIncome: number;
  recentActivity: {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'payment' | 'request' | 'message' | 'other';
  }[];
  incomeData: {
    month: string;
    income: number;
  }[];
  occupancyData: {
    month: string;
    occupancyRate: number;
  }[];
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Auth API
export const authApi = {
  signup: async (email: string, password: string, role: string) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });
    return handleResponse(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockPayments: Payment[] = [
  {
    id: '1',
    amount: 1200,
    date: '2023-11-01',
    status: 'pending',
    method: 'Bank Transfer',
    receiptUrl: '/receipts/1',
    description: 'November Rent'
  },
  // Add more mock payments...
];

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    title: 'Leaking Faucet',
    description: 'Kitchen faucet is leaking and needs repair.',
    status: 'open',
    createdAt: '2023-10-25T14:30:00Z',
    updatedAt: '2023-10-25T14:30:00Z',
    priority: 'medium',
    images: ['/images/faucet-leak.jpg']
  },
  // Add more mock maintenance requests...
];

// API functions
export const fetchPayments = async (): Promise<Payment[]> => {
  await delay(500);
  return [...mockPayments];
};

export const fetchMaintenanceRequests = async (): Promise<MaintenanceRequest[]> => {
  await delay(600);
  return [...mockMaintenanceRequests];
};

export const createMaintenanceRequest = async (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<MaintenanceRequest> => {
  await delay(800);
  const newRequest: MaintenanceRequest = {
    ...request,
    id: Math.random().toString(36).substr(2, 9),
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockMaintenanceRequests.push(newRequest);
  return newRequest;
};

// Dashboard API
export const dashboardApi = {
  getLandlordOverview: async (): Promise<DashboardOverview> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/dashboard/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};
