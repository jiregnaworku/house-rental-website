export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type MaintenanceStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type MessageStatus = 'unread' | 'read' | 'archived';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Payment {
  id: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  method: string;
  receiptUrl?: string;
  description: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  images: string[];
  assignedTo?: string;
  estimatedCompletion?: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  status: MessageStatus;
  date: string;
  isImportant: boolean;
}

export interface LeaseDocument {
  id: string;
  name: string;
  type: 'lease' | 'addendum' | 'notice' | 'other';
  uploadDate: string;
  fileUrl: string;
  size: string;
}

export interface Property {
  id: string;
  address: string;
  image: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  isFavorite: boolean;
  nextInspection?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  date: string;
  time: string;
  status: BookingStatus;
  type: 'viewing' | 'inspection' | 'maintenance';
  notes?: string;
}
