import apiClient from './apiClient';

// Add type declaration for Vite's import.meta.env
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
    }
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Types
export interface VendorInfo {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessDescription: string;
  businessCategory: string;
  isVerified: boolean;
}

export interface VendorProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  vendorInfo: VendorInfo;
  createdAt: string;
  updatedAt: string;
}

export interface VendorResponse {
  vendor: VendorProfile;
}

export interface DashboardStats {
  statistics: {
    servicesCount: number;
    totalOrdersCount: number;
    incompleteOrdersCount: number;
    totalEarnings: number;
  };
  recentOrders: any[]; // TODO: Define Order type
  orderStatusDistribution: {
    _id: string;
    count: number;
  }[];
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface OrderItemStatus {
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  vendorNotes?: string;
}

export interface OrderItemMedia {
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  name: string;
  description?: string;
}

// API Functions
export const vendorService = {
  // Profile
  getProfile: async (): Promise<VendorProfile> => {
    const response = await apiClient.get<VendorResponse>('/vendors/profile');
    return response.data.vendor;
  },

  updateProfile: async (profileData: Partial<VendorProfile>): Promise<VendorProfile> => {
    const response = await apiClient.put<VendorResponse>('/vendors/profile', profileData);
    return response.data.vendor;
  },

  // Dashboard
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/vendors/dashboard');
    return response.data;
  },

  // Orders
  getOrders: async (filters: OrderFilters) => {
    const response = await apiClient.get('/vendors/orders', { params: filters });
    return response.data;
  },

  updateOrderItemStatus: async (
    orderId: string,
    itemId: string,
    statusData: OrderItemStatus
  ) => {
    const response = await apiClient.put(
      `/vendors/orders/${orderId}/items/${itemId}`,
      statusData
    );
    return response.data;
  },

  getOrderStatistics: async (startDate?: string, endDate?: string) => {
    const response = await apiClient.get('/vendors/orders/statistics', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Order Media
  addOrderItemMedia: async (
    orderId: string,
    itemId: string,
    mediaData: OrderItemMedia
  ) => {
    const response = await apiClient.post(
      `/vendors/orders/${orderId}/items/${itemId}/media`,
      mediaData
    );
    return response.data;
  },

  removeOrderItemMedia: async (
    orderId: string,
    itemId: string,
    mediaId: string
  ) => {
    const response = await apiClient.delete(
      `/vendors/orders/${orderId}/items/${itemId}/media/${mediaId}`
    );
    return response.data;
  },

  // Categories
  getCategories: async (page = 1, limit = 10, isFavourite?: boolean) => {
    const response = await apiClient.get('/vendors/categories', {
      params: { page, limit, isFavourite }
    });
    return response.data;
  },

  // Services
  getServices: async (page = 1, limit = 10, category?: string, search?: string) => {
    const response = await apiClient.get('/vendors/services', {
      params: { page, limit, category, search }
    });
    return response.data;
  }
};