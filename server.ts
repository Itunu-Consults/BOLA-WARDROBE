import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { initialCategories, initialProducts, initialSiteSettings } from './src/data/initialData';
import { Product, Category, Booking, OrderRequest, ContactMessage, SiteSettings } from './src/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Supabase Setup
const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://habpuiqysybzozajamtr.supabase.co';
const SUPABASE_URL = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYnB1aXF5c3liem96YWphbXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjI4NjQsImV4cCI6MjEwNzgzODg2NH0.N2wIK0kbD472BydOEMNqlV73TO3COsqzkCzUzQalvYg';

let supabaseClient: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('[Supabase] Initialized client for:', SUPABASE_URL);
  } catch (err) {
    console.error('[Supabase] Initialization error:', err);
  }
}

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial Admin Password Hash
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Bolar@247';

interface DatabaseSchema {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  bookings: Booking[];
  orders: OrderRequest[];
  messages: ContactMessage[];
  admin: {
    username: string;
    passwordHash: string;
    salt: string;
    passwordMustChange: boolean;
  };
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading db.json, initializing fresh db:', err);
    }
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(DEFAULT_ADMIN_PASSWORD, salt);

  const initialDb: DatabaseSchema = {
    settings: initialSiteSettings,
    categories: initialCategories,
    products: initialProducts,
    bookings: [
      {
        id: 'book-seed-1',
        fullName: 'Folashade Adeleke',
        whatsapp: '2348031234567',
        email: 'folashade@example.com',
        consultationType: 'Outfit recommendations',
        preferredDate: '2026-10-24',
        preferredTime: '11:00 AM',
        categoryInterest: 'Wears & Bags',
        budgetRange: 'Mid-Tier Classy',
        preferredStyle: 'Elegant wedding guest styling',
        notes: 'Interested in coordinating Adire blouse with the Croc Satchel',
        status: 'pending',
        createdAt: '2026-10-16T14:20:00.000Z',
      },
    ],
    orders: [
      {
        id: 'ord-seed-1',
        productId: 'prod-wears-1',
        productName: 'Adire Swirl Two-Piece Set',
        productSlug: 'adire-swirl-two-piece-set',
        selectedOptions: { Size: 'UK 10 / M', Colorway: 'Emerald & Cobalt Swirl' },
        quantity: 1,
        customerName: 'Zainab Balogun',
        customerPhone: '2348029876543',
        customerEmail: 'zainab@example.com',
        customerNotes: 'Prefers delivery to Lekki Phase 1',
        status: 'new',
        createdAt: '2026-10-16T16:45:00.000Z',
      },
    ],
    messages: [
      {
        id: 'msg-seed-1',
        name: 'Oluwaseun Bakare',
        contact: 'oluwaseun@example.com',
        subject: 'Wholesale & Custom Orders Inquiry',
        message: 'Hello, do you accept orders for bridal train sets in custom Adire prints?',
        status: 'unread',
        createdAt: '2026-10-16T11:10:00.000Z',
      },
    ],
    admin: {
      username: 'admin',
      passwordHash,
      salt,
      passwordMustChange: true,
    },
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

let db = loadDatabase();

// In-memory active session tokens
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Authentication Middleware
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  // Extend session by 2 hours
  session.expiresAt = Date.now() + 2 * 60 * 60 * 1000;
  next();
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Rate limiting for login
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

// ---------------- API ROUTES ----------------

// Supabase Status check
app.get('/api/supabase/status', async (_req: Request, res: Response) => {
  if (!supabaseClient) {
    return res.json({
      configured: false,
      connected: false,
      url: null,
      message: 'Supabase client is not initialized.'
    });
  }

  try {
    const { data, error } = await supabaseClient.from('site_settings').select('*').limit(1);
    return res.json({
      configured: true,
      connected: !error,
      url: SUPABASE_URL,
      dataApi: `${SUPABASE_URL}/rest/v1/`,
      tables: ['site_settings', 'categories', 'products', 'bookings', 'orders', 'messages'],
      hasData: Boolean(data && data.length > 0),
      error: error ? error.message : null,
    });
  } catch (err: any) {
    return res.json({
      configured: true,
      connected: false,
      url: SUPABASE_URL,
      error: err.message,
    });
  }
});

// Site Settings
app.get('/api/settings', async (_req: Request, res: Response) => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('site_settings').select('*').limit(1).maybeSingle();
      if (data && !error) {
        const mapped: SiteSettings = {
          brandName: data.brand_name || db.settings.brandName,
          tagline: data.tagline || db.settings.tagline,
          supportingStatement: data.supporting_statement || db.settings.supportingStatement,
          announcementText: data.announcement_text || db.settings.announcementText,
          whatsappNumber: data.whatsapp_number || db.settings.whatsappNumber,
          businessEmail: data.business_email || db.settings.businessEmail,
          instagramUrl: data.instagram_url || db.settings.instagramUrl,
          facebookUrl: data.facebook_url || db.settings.facebookUrl,
          tiktokUrl: data.tiktok_url || db.settings.tiktokUrl,
          consultationEnabled: data.consultation_enabled ?? db.settings.consultationEnabled,
          businessHours: data.business_hours || db.settings.businessHours,
          footerNote: data.footer_note || db.settings.footerNote,
          metaTitle: data.meta_title || db.settings.metaTitle,
          metaDescription: data.meta_description || db.settings.metaDescription,
        };
        return res.json(mapped);
      }
    } catch (err) {
      console.warn('[Supabase] settings fallback to local:', err);
    }
  }
  res.json(db.settings);
});

app.put('/api/settings', authenticateAdmin, async (req: Request, res: Response) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);

  if (supabaseClient) {
    try {
      await supabaseClient.from('site_settings').upsert({
        id: 'default',
        brand_name: db.settings.brandName,
        tagline: db.settings.tagline,
        supporting_statement: db.settings.supportingStatement,
        announcement_text: db.settings.announcementText,
        whatsapp_number: db.settings.whatsappNumber,
        business_email: db.settings.businessEmail,
        instagram_url: db.settings.instagramUrl,
        facebook_url: db.settings.facebookUrl,
        tiktok_url: db.settings.tiktokUrl,
        consultation_enabled: db.settings.consultationEnabled,
        business_hours: db.settings.businessHours,
        footer_note: db.settings.footerNote,
        meta_title: db.settings.metaTitle,
        meta_description: db.settings.metaDescription,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Supabase] site_settings sync warning:', err);
    }
  }

  res.json({ success: true, settings: db.settings });
});

// Categories
app.get('/api/categories', async (_req: Request, res: Response) => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('categories').select('*').order('display_order', { ascending: true });
      if (data && data.length > 0 && !error) {
        const mapped: Category[] = data.map((c: any) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          tagline: c.tagline || '',
          description: c.description || '',
          image: c.image || '/images/categories/category-wears.jpg',
          displayOrder: c.display_order ?? 1,
        }));
        return res.json(mapped);
      }
    } catch (err) {
      console.warn('[Supabase] categories fallback to local:', err);
    }
  }
  res.json(db.categories.sort((a, b) => a.displayOrder - b.displayOrder));
});

app.post('/api/categories', authenticateAdmin, (req: Request, res: Response) => {
  const { name, tagline, description, image, slug } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    slug: categorySlug,
    name: name.trim(),
    tagline: tagline || '',
    description: description || '',
    image: image || `/images/category-${categorySlug}.svg`,
    displayOrder: db.categories.length + 1,
  };
  db.categories.push(newCategory);
  saveDatabase(db);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDatabase(db);
  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const category = db.categories.find(c => c.id === id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  // Check if any product uses this category
  const productsInCategory = db.products.filter(p => p.category === category.slug);
  if (productsInCategory.length > 0) {
    return res.status(400).json({
      error: `Cannot delete category "${category.name}" because ${productsInCategory.length} product(s) belong to it. Reassign or remove them first.`,
    });
  }
  db.categories = db.categories.filter(c => c.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Category removed successfully' });
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const token = req.headers.authorization?.slice(7) || (req.headers['x-admin-token'] as string);
  const isAdmin = token && activeSessions.has(token);

  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;

  let list = db.products;
  if (!isAdmin) {
    list = list.filter(p => p.isPublished);
  }

  if (category) {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

app.get('/api/products/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const token = req.headers.authorization?.slice(7) || (req.headers['x-admin-token'] as string);
  const isAdmin = token && activeSessions.has(token);

  const product = db.products.find(p => p.slug === slugOrId || p.id === slugOrId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (!product.isPublished && !isAdmin) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

app.post('/api/products', authenticateAdmin, (req: Request, res: Response) => {
  const { name, category, shortDescription, description, images, variants, availability, label, specifications, careInstructions, isPublished, isFeatured } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = db.products.find(p => p.slug === slug);
  const uniqueSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    slug: uniqueSlug,
    name: name.trim(),
    category: category || 'wears',
    shortDescription: shortDescription || '',
    description: description || '',
    images: Array.isArray(images) && images.length > 0 ? images : ['/images/products/placeholder.svg'],
    variants: Array.isArray(variants) ? variants : [],
    availability: availability || 'in_stock',
    label: label || null,
    specifications: specifications || {},
    careInstructions: careInstructions || '',
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Bookings (Styling Consultations)
app.post('/api/bookings', (req: Request, res: Response) => {
  const { fullName, whatsapp, email, consultationType, preferredDate, preferredTime, categoryInterest, budgetRange, preferredStyle, notes } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: 'Your full name is required' });
  }
  if (!whatsapp || !whatsapp.trim()) {
    return res.status(400).json({ error: 'A valid WhatsApp phone number is required' });
  }
  if (!consultationType) {
    return res.status(400).json({ error: 'Please choose a consultation type' });
  }
  if (!preferredDate || !preferredTime) {
    return res.status(400).json({ error: 'Please select your preferred date and time' });
  }

  const newBooking: Booking = {
    id: `book-${Date.now()}`,
    fullName: fullName.trim(),
    whatsapp: whatsapp.trim(),
    email: email?.trim() || undefined,
    consultationType,
    preferredDate,
    preferredTime,
    categoryInterest: categoryInterest || 'All Collections',
    budgetRange: budgetRange || undefined,
    preferredStyle: preferredStyle || undefined,
    notes: notes?.trim() || undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.bookings.unshift(newBooking);
  saveDatabase(db);

  if (supabaseClient) {
    supabaseClient.from('bookings').insert({
      id: newBooking.id,
      full_name: newBooking.fullName,
      whatsapp: newBooking.whatsapp,
      email: newBooking.email || null,
      consultation_type: newBooking.consultationType,
      preferred_date: newBooking.preferredDate,
      preferred_time: newBooking.preferredTime,
      category_interest: newBooking.categoryInterest,
      budget_range: newBooking.budgetRange || null,
      preferred_style: newBooking.preferredStyle || null,
      notes: newBooking.notes || null,
      status: newBooking.status,
      created_at: newBooking.createdAt,
    }).then(({ error }) => {
      if (error) console.warn('[Supabase] Booking sync warning:', error.message);
      else console.log('[Supabase] Booking synced successfully');
    });
  }

  res.status(201).json({ success: true, booking: newBooking });
});

app.get('/api/bookings', authenticateAdmin, (_req: Request, res: Response) => {
  res.json(db.bookings);
});

app.patch('/api/bookings/:id/status', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;
  const booking = db.bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  if (status) booking.status = status;
  if (internalNotes !== undefined) booking.internalNotes = internalNotes;
  saveDatabase(db);
  res.json(booking);
});

// Orders / Requests
app.post('/api/orders', (req: Request, res: Response) => {
  const { productId, productName, productSlug, selectedOptions, quantity, customerName, customerPhone, customerEmail, customerNotes } = req.body;

  if (!productName || !productId) {
    return res.status(400).json({ error: 'Product information is required' });
  }

  const newOrder: OrderRequest = {
    id: `ord-${Date.now()}`,
    productId,
    productName,
    productSlug: productSlug || '',
    selectedOptions: selectedOptions || {},
    quantity: Number(quantity) || 1,
    customerName: customerName?.trim() || undefined,
    customerPhone: customerPhone?.trim() || undefined,
    customerEmail: customerEmail?.trim() || undefined,
    customerNotes: customerNotes?.trim() || undefined,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);

  if (supabaseClient) {
    supabaseClient.from('orders').insert({
      id: newOrder.id,
      product_id: newOrder.productId,
      product_name: newOrder.productName,
      product_slug: newOrder.productSlug,
      selected_options: newOrder.selectedOptions,
      quantity: newOrder.quantity,
      customer_name: newOrder.customerName || null,
      customer_phone: newOrder.customerPhone || null,
      customer_email: newOrder.customerEmail || null,
      customer_notes: newOrder.customerNotes || null,
      status: newOrder.status,
      created_at: newOrder.createdAt,
    }).then(({ error }) => {
      if (error) console.warn('[Supabase] Order sync warning:', error.message);
      else console.log('[Supabase] Order synced successfully');
    });
  }

  res.status(201).json({ success: true, order: newOrder });
});

app.get('/api/orders', authenticateAdmin, (_req: Request, res: Response) => {
  res.json(db.orders);
});

app.patch('/api/orders/:id/status', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order request not found' });
  }
  if (status) order.status = status;
  if (internalNotes !== undefined) order.internalNotes = internalNotes;
  saveDatabase(db);
  res.json(order);
});

// Contact Messages
app.post('/api/messages', (req: Request, res: Response) => {
  const { name, contact, subject, message } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
  if (!contact || !contact.trim()) return res.status(400).json({ error: 'Contact detail (phone or email) is required' });
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message cannot be empty' });

  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: name.trim(),
    contact: contact.trim(),
    subject: subject?.trim() || 'General Inquiry',
    message: message.trim(),
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  db.messages.unshift(newMessage);
  saveDatabase(db);

  if (supabaseClient) {
    supabaseClient.from('messages').insert({
      id: newMessage.id,
      name: newMessage.name,
      contact: newMessage.contact,
      subject: newMessage.subject,
      message: newMessage.message,
      status: newMessage.status,
      created_at: newMessage.createdAt,
    }).then(({ error }) => {
      if (error) console.warn('[Supabase] Message sync warning:', error.message);
      else console.log('[Supabase] Message synced successfully');
    });
  }
  res.status(201).json({ success: true, message: newMessage });
});

app.get('/api/messages', authenticateAdmin, (_req: Request, res: Response) => {
  res.json(db.messages);
});

app.patch('/api/messages/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const msg = db.messages.find(m => m.id === id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  if (status) msg.status = status;
  saveDatabase(db);
  res.json(msg);
});

// Media Upload (Data URL to file)
app.post('/api/media/upload', authenticateAdmin, (req: Request, res: Response) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl || typeof dataUrl !== 'string') {
    return res.status(400).json({ error: 'Invalid media upload payload' });
  }

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid data URL format' });
    }

    const ext = matches[1].split('/')[1] || 'png';
    const cleanExt = ext === 'jpeg' ? 'jpg' : ext;
    const safeName = (filename || 'media')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 30);
    const fileName = `${safeName}-${Date.now()}.${cleanExt}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
    const url = `/uploads/${fileName}`;

    res.json({ success: true, url, fileName });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process media upload' });
  }
});

// Admin Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const ip = req.ip || 'ip';
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };

  if (attempt.lockedUntil > now) {
    const waitSec = Math.ceil((attempt.lockedUntil - now) / 1000);
    return res.status(429).json({ error: `Too many failed attempts. Try again in ${waitSec}s.` });
  }

  const { username, password } = req.body;
  const inputHash = hashPassword(password || '', db.admin.salt);

  if (username === db.admin.username && inputHash === db.admin.passwordHash) {
    loginAttempts.delete(ip);
    const token = generateToken();
    activeSessions.set(token, {
      username: db.admin.username,
      expiresAt: now + 4 * 60 * 60 * 1000, // 4 hours
    });

    return res.json({
      success: true,
      token,
      user: {
        username: db.admin.username,
        role: 'admin',
        passwordMustChange: db.admin.passwordMustChange,
      },
    });
  }

  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.lockedUntil = now + 10 * 60 * 1000; // 10 minutes lock
  }
  loginAttempts.set(ip, attempt);

  res.status(401).json({ error: 'Invalid administrator credentials' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.slice(7) || (req.headers['x-admin-token'] as string);
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired' });
  }

  res.json({
    user: {
      username: session.username,
      role: 'admin',
      passwordMustChange: db.admin.passwordMustChange,
    },
  });
});

app.post('/api/auth/change-password', authenticateAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  const currentHash = hashPassword(currentPassword || '', db.admin.salt);
  if (currentHash !== db.admin.passwordHash) {
    return res.status(400).json({ error: 'Current password does not match' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);

  db.admin.salt = newSalt;
  db.admin.passwordHash = newHash;
  db.admin.passwordMustChange = false;
  saveDatabase(db);

  res.json({ success: true, message: 'Password updated successfully' });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.slice(7) || (req.headers['x-admin-token'] as string);
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Vite Integration (Dev vs Prod)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bola Wardrobe server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
