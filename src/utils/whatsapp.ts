import type { Booking, Product } from '../types/index.ts';

/**
 * Official Bola Wardrobe direct WhatsApp Link
 */
export const BOLA_OFFICIAL_WHATSAPP_LINK = 'https://wa.link/ghucjd';

/**
 * Sanitizes phone number to digits only or preserves direct wa.link URL
 */
export function sanitizeWhatsappNumber(phone: string): string {
  if (!phone) return BOLA_OFFICIAL_WHATSAPP_LINK;
  if (phone.includes('wa.link') || phone.startsWith('http')) {
    return phone;
  }
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '234' + cleaned.substring(1);
  }
  return cleaned || BOLA_OFFICIAL_WHATSAPP_LINK;
}

export interface ProductOrderWhatsappParams {
  whatsappNumber?: string;
  product?: Pick<Product, 'name' | 'slug'>;
  selectedOptions?: Record<string, string>;
  quantity?: number;
  productUrl?: string;
}

/**
 * Generates the WhatsApp link for ordering a product.
 * Directed to https://wa.link/ghucjd
 */
export function createProductOrderWhatsappUrl(_params?: ProductOrderWhatsappParams): string {
  return BOLA_OFFICIAL_WHATSAPP_LINK;
}

/**
 * Generates the WhatsApp link for a styling consultation request.
 * Directed to https://wa.link/ghucjd
 */
export function createConsultationWhatsappUrl(
  _whatsappNumber?: string,
  _booking?: Partial<Booking>
): string {
  return BOLA_OFFICIAL_WHATSAPP_LINK;
}

/**
 * Generates general customer service WhatsApp inquiry link.
 * Directed to https://wa.link/ghucjd
 */
export function createGeneralInquiryWhatsappUrl(
  _whatsappNumber?: string,
  _subject?: string,
  _customMessage?: string
): string {
  return BOLA_OFFICIAL_WHATSAPP_LINK;
}
