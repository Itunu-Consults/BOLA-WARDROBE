export type ProductCategory = 'wears' | 'bags' | 'accessories' | 'cosmetics' | string;

export type ProductAvailability = 'in_stock' | 'low_stock' | 'preorder' | 'out_of_stock';

export interface ProductVariantOption {
  name: string; // e.g. "Size", "Color", "Material"
  values: string[]; // e.g. ["S", "M", "L", "XL"] or ["Onyx Black", "Cognac Brown"]
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  images: string[];
  variants: ProductVariantOption[];
  availability: ProductAvailability;
  label?: 'New Arrival' | 'Staff Pick' | 'Bestseller' | 'The Edit' | null;
  specifications: Record<string, string>;
  careInstructions?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  displayOrder: number;
}

export type BookingStatus = 'pending' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  fullName: string;
  whatsapp: string;
  email?: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  categoryInterest: string;
  budgetRange?: string;
  preferredStyle?: string;
  notes?: string;
  status: BookingStatus;
  internalNotes?: string;
  createdAt: string;
}

export type OrderRequestStatus = 'new' | 'contacted' | 'fulfilled' | 'closed';

export interface OrderRequest {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  selectedOptions: Record<string, string>;
  quantity: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerNotes?: string;
  status: OrderRequestStatus;
  internalNotes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string; // phone or email
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  supportingStatement: string;
  announcementText: string;
  whatsappNumber: string;
  businessEmail: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  consultationEnabled: boolean;
  businessHours: string;
  footerNote: string;
  metaTitle: string;
  metaDescription: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin';
  passwordMustChange?: boolean;
}
