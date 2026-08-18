export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'vendor'; // Fixed: changed from 'planner' to 'client'
  company?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  description: string;
  services: string[];
  location: {
    city: string;
    state: string;
    address?: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  pricing: {
    min: number;
    max: number;
    currency: string;
    unit: string;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  featured: boolean;
  verified: boolean;
  availability: boolean;
  createdAt: Date;
  subscription?: VendorSubscription;
}

export interface Review {
  id: string;
  vendorId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  eventType: string;
  createdAt: Date;
}

export type VendorCategory = 
  | 'catering'
  | 'photography'
  | 'venues'
  | 'music'
  | 'flowers'
  | 'decor'
  | 'transportation'
  | 'planning';

export interface SearchFilters {
  category?: VendorCategory;
  location?: string;
  priceRange?: [number, number];
  rating?: number;
  availability?: boolean;
}

export interface SavedVendor {
  id: string;
  vendorId: string;
  userId: string;
  notes?: string;
  createdAt: Date;
}

// Subscription types
export interface VendorSubscription {
  id: string;
  vendor_id: string;
  plan_type: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  price: number;
  currency: 'USD' | 'NGN';
  duration: number; // in months
  features: string[];
  popular?: boolean;
}

export interface PaystackPaymentData {
  email: string;
  amount: number;
  currency: 'NGN' | 'USD';
  reference: string;
  callback_url?: string;
  metadata?: {
    vendor_id: string;
    plan_type: string;
    plan_duration: number;
  };
}