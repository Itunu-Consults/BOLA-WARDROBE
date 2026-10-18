import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, SiteSettings, Booking, OrderRequest, ContactMessage, AdminUser } from '../types';
import { initialCategories, initialProducts, initialSiteSettings } from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  adminUser: AdminUser | null;
  adminToken: string | null;
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  changeAdminPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  submitBooking: (booking: Partial<Booking>) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  submitOrderRequest: (order: Partial<OrderRequest>) => Promise<{ success: boolean; order?: OrderRequest; error?: string }>;
  submitContactMessage: (msg: Partial<ContactMessage>) => Promise<{ success: boolean; error?: string }>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const TOKEN_KEY = 'bola_wardrobe_admin_token';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const authHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return headers;
  }, [adminToken]);

  // Load Settings
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      // keep fallback
    }
  }, []);

  // Load Categories
  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      // keep fallback
    }
  }, []);

  // Load Products
  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      // keep fallback
    }
  }, [authHeaders]);

  // Check auth session
  useEffect(() => {
    if (!adminToken) {
      setAdminUser(null);
      return;
    }
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setAdminToken(null);
          setAdminUser(null);
        }
      })
      .then(data => {
        if (data?.user) setAdminUser(data.user);
      })
      .catch(() => {
        // silent fail
      });
  }, [adminToken]);

  useEffect(() => {
    Promise.allSettled([refreshSettings(), refreshCategories(), refreshProducts()]).then(() => {
      setIsLoading(false);
    });
  }, [refreshSettings, refreshCategories, refreshProducts]);

  const loginAdmin = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => '');
        return { success: false, error: text || `Authentication server responded with error ${res.status}` };
      }

      if (res.ok && data.success) {
        setAdminToken(data.token);
        setAdminUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        refreshProducts().catch(err => console.warn('Product refresh warning after login:', err));
        return { success: true };
      } else {
        return { success: false, error: data.error || `Authentication failed (${res.status})` };
      }
    } catch (err: any) {
      console.error('Login network error:', err);
      return { 
        success: false, 
        error: err?.message ? `Network connection error: ${err.message}` : 'Network error connecting to authentication server' 
      };
    }
  };

  const logoutAdmin = async () => {
    if (adminToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: authHeaders(),
        });
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setAdminToken(null);
    setAdminUser(null);
    await refreshProducts();
  };

  const changeAdminPassword = async (currentPassword: string, newPassword: string) => {
    if (!adminToken) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (adminUser) {
          setAdminUser({ ...adminUser, passwordMustChange: false });
        }
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update password' };
    } catch {
      return { success: false, error: 'Connection error' };
    }
  };

  const submitBooking = async (bookingData: Partial<Booking>) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, booking: data.booking };
      }
      return { success: false, error: data.error || 'Failed to submit consultation booking' };
    } catch {
      return { success: false, error: 'Unable to reach the booking server' };
    }
  };

  const submitOrderRequest = async (orderData: Partial<OrderRequest>) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, order: data.order };
      }
      return { success: false, error: data.error || 'Failed to register order request' };
    } catch {
      return { success: false, error: 'Unable to register order request' };
    }
  };

  const submitContactMessage = async (msgData: Partial<ContactMessage>) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to send message' };
    } catch {
      return { success: false, error: 'Unable to reach contact server' };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        adminUser,
        adminToken,
        isLoading,
        refreshProducts,
        refreshCategories,
        refreshSettings,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        submitBooking,
        submitOrderRequest,
        submitContactMessage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
