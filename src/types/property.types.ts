export interface Property {
  _id?: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: 'available' | 'rented' | 'maintenance';
  amenities: string[];
  images: string[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  landlord: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyFormData extends Omit<Property, 'images' | 'location' | '_id' | 'createdAt' | 'updatedAt'> {
  images: (string | File)[];
  latitude: number;
  longitude: number;
}

export interface PropertyFilters {
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
}
