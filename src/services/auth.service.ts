import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'vendor';
  vendorInfo: {
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessDescription?: string;
    businessCategory: 'restaurant' | 'retail' | 'service' | 'other';
  };
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    vendorInfo: {
      businessName: string;
      businessAddress: string;
      businessPhone: string;
      businessDescription?: string;
      businessCategory: string;
      isVerified: boolean;
    };
  };
}

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Making registration API call to:', `${API_URL}/auth/register`);
      console.log('Request data:', JSON.stringify(data, null, 2));
      const response = await api.post('/auth/register', {
        ...data,
        vendorInfo: {
          ...data.vendorInfo,
          businessName: data.vendorInfo.businessName,
          businessAddress: data.vendorInfo.businessAddress,
          businessPhone: data.vendorInfo.businessPhone,
          businessDescription: data.vendorInfo.businessDescription || '',
          businessCategory: data.vendorInfo.businessCategory
        }
      });
      console.log('API response:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error: any) {
      console.error('Registration API error:', error.response?.data || error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService; 