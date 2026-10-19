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
app.set('trust proxy', true);

// Enable CORS & Preflight handling
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Supabase Setup
const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://habpuiqysybzozajamtr.supabase.co';
const SUPABASE_URL = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYnB1aXF5c3liem96YWphbXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjI4NjQsImV4cCI6MjEwNzgzODg2NH0.N2wIK0kbD472BydOEMNqlV73TO3COsqzkCzUzQalvYg';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseKeyToUse = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;
if (SUPABASE_URL && supabaseKeyToUse) {
  try {
    supabaseClient = createClient(SUPABASE_URL, supabaseKeyToUse);
    console.log('[Supabase] Initialized client for:', SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ? '(Service Role Active - RLS Bypassed)' : '(Anon Key)');
  } catch (err) {
    console.error('[Supabase] Initialization error:', err);
  }
}

// Ensure storage directories exist safely (prevent read-only filesystem crash on Vercel)
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem
}

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem
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

// Cryptographically Signed HMAC Admin Tokens (Persist across restarts)
const SESSION_SECRET = process.env.SESSION_SECRET || 'bola_wardrobe_secret_key_2026';

function generateToken(username = 'admin'): string {
  const payload = `${username}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
}

function verifyToken(token: string): { valid: boolean; username: string } {
  if (!token) return { valid: false, username: '' };
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false, username: '' };
    const [payloadB64, signature] = parts;
    const payload = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    if (signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      const [username, timestampStr] = payload.split(':');
      const timestamp = Number(timestampStr);
      // Valid for 7 days
      if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
        return { valid: true, username: username || 'admin' };
      }
    }
  } catch {}
  return { valid: false, username: '' };
}

// Authentication Middleware
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const verified = verifyToken(token);
  if (!verified.valid) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  (req as any).adminUser = verified.username;
  next();
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Rate limiting for login
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

// ---------------- API ROUTES ----------------

// Supabase Status and Write Permissions check
app.get('/api/supabase/status', async (_req: Request, res: Response) => {
  if (!supabaseClient) {
    return res.json({
      configured: false,
      connected: false,
      canWrite: false,
      rlsBlocked: false,
      url: null,
      message: 'Supabase client is not initialized.',
    });
  }

  try {
    const { data, error } = await supabaseClient.from('site_settings').select('*').limit(1);
    
    // Test write permission (detects RLS block code 42501)
    let canWrite = false;
    let rlsBlocked = false;
    let writeError: string | null = null;

    try {
      const writeTest = await supabaseClient.from('site_settings').upsert({
        id: 'default',
        updated_at: new Date().toISOString(),
      }).select();

      if (writeTest.error) {
        writeError = writeTest.error.message;
        rlsBlocked = writeTest.error.message?.toLowerCase().includes('row-level security') || writeTest.error.code === '42501';
      } else {
        canWrite = true;
      }
    } catch (wErr: any) {
      writeError = wErr?.message || 'Write test failed';
      rlsBlocked = Boolean(writeError?.toLowerCase().includes('row-level security'));
    }

    return res.json({
      configured: true,
      connected: !error,
      canWrite,
      rlsBlocked,
      writeError,
      hasServiceRole: Boolean(SUPABASE_SERVICE_ROLE_KEY),
      url: SUPABASE_URL,
      dataApi: `${SUPABASE_URL}/rest/v1/`,
      tables: ['site_settings', 'categories', 'products', 'bookings', 'orders', 'messages'],
      hasData: Boolean(data && data.length > 0),
      error: error ? error.message : null,
      sqlFix: `ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;\nALTER TABLE categories DISABLE ROW LEVEL SECURITY;\nALTER TABLE products DISABLE ROW LEVEL SECURITY;\nALTER TABLE bookings DISABLE ROW LEVEL SECURITY;\nALTER TABLE orders DISABLE ROW LEVEL SECURITY;\nALTER TABLE messages DISABLE ROW LEVEL SECURITY;`,
    });
  } catch (err: any) {
    return res.json({
      configured: true,
      connected: false,
      canWrite: false,
      rlsBlocked: false,
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

app.post('/api/categories', authenticateAdmin, async (req: Request, res: Response) => {
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

  if (supabaseClient) {
    try {
      await supabaseClient.from('categories').upsert({
        id: newCategory.id,
        slug: newCategory.slug,
        name: newCategory.name,
        tagline: newCategory.tagline,
        description: newCategory.description,
        image: newCategory.image,
        display_order: newCategory.displayOrder,
      });
    } catch (err) {
      console.warn('[Supabase] Category insert warning:', err);
    }
  }

  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDatabase(db);

  if (supabaseClient) {
    try {
      const c = db.categories[index];
      await supabaseClient.from('categories').upsert({
        id: c.id,
        slug: c.slug,
        name: c.name,
        tagline: c.tagline || '',
        description: c.description || '',
        image: c.image && c.image.trim() !== '' ? c.image.trim() : `/images/categories/category-${c.slug || 'wears'}.jpg`,
        display_order: c.displayOrder || 1,
      });
    } catch (err) {
      console.warn('[Supabase] Category update warning:', err);
    }
  }

  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', authenticateAdmin, async (req: Request, res: Response) => {
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

  if (supabaseClient) {
    try {
      await supabaseClient.from('categories').delete().eq('id', id);
    } catch (err) {
      console.warn('[Supabase] Category delete warning:', err);
    }
  }

  res.json({ success: true, message: 'Category removed successfully' });
});

// Products
app.get('/api/products', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.slice(7) || (req.headers['x-admin-token'] as string);
  const isAdmin = Boolean(token && verifyToken(token).valid);

  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;

  let list: Product[] = [];

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('products').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0 && !error) {
        list = data.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category,
          shortDescription: p.short_description || '',
          description: p.description || '',
          images: p.images || [],
          variants: p.variants || [],
          availability: p.availability || 'in_stock',
          label: p.label || null,
          specifications: p.specifications || {},
          careInstructions: p.care_instructions || '',
          isPublished: p.is_published !== undefined ? p.is_published : true,
          isFeatured: p.is_featured || false,
          createdAt: p.created_at || new Date().toISOString(),
          updatedAt: p.updated_at || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn('[Supabase] Products query warning:', err);
    }
  }

  if (list.length === 0) {
    list = db.products;
  }

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

app.get('/api/products/:slugOrId', async (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const token = req.headers.authorization?.slice(7) || (req.headers['x-admin-token'] as string);
  const isAdmin = Boolean(token && verifyToken(token).valid);

  if (supabaseClient) {
    try {
      const { data } = await supabaseClient.from('products').select('*').or(`slug.eq.${slugOrId},id.eq.${slugOrId}`).limit(1).maybeSingle();
      if (data) {
        const mapped: Product = {
          id: data.id,
          slug: data.slug,
          name: data.name,
          category: data.category,
          shortDescription: data.short_description || '',
          description: data.description || '',
          images: data.images || [],
          variants: data.variants || [],
          availability: data.availability || 'in_stock',
          label: data.label || null,
          specifications: data.specifications || {},
          careInstructions: data.care_instructions || '',
          isPublished: data.is_published !== undefined ? data.is_published : true,
          isFeatured: data.is_featured || false,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        };
        if (!mapped.isPublished && !isAdmin) {
          return res.status(404).json({ error: 'Product not found' });
        }
        return res.json(mapped);
      }
    } catch {}
  }

  const product = db.products.find(p => p.slug === slugOrId || p.id === slugOrId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (!product.isPublished && !isAdmin) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

app.post('/api/products', authenticateAdmin, async (req: Request, res: Response) => {
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

  if (supabaseClient) {
    try {
      await supabaseClient.from('products').upsert({
        id: newProduct.id,
        slug: newProduct.slug,
        name: newProduct.name,
        category: newProduct.category,
        short_description: newProduct.shortDescription,
        description: newProduct.description,
        images: newProduct.images,
        variants: newProduct.variants,
        availability: newProduct.availability,
        label: (newProduct.label === 'New Arrival' || newProduct.label === 'Bestseller') ? newProduct.label : null,
        specifications: newProduct.specifications,
        care_instructions: newProduct.careInstructions,
        is_published: newProduct.isPublished,
        is_featured: newProduct.isFeatured,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Supabase] Product insert warning:', err);
    }
  }

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticateAdmin, async (req: Request, res: Response) => {
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

  if (supabaseClient) {
    try {
      const p = db.products[index];
      await supabaseClient.from('products').upsert({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        short_description: p.shortDescription || '',
        description: p.description || '',
        images: p.images || [],
        variants: p.variants || [],
        availability: p.availability || 'in_stock',
        label: (p.label === 'New Arrival' || p.label === 'Bestseller') ? p.label : null,
        specifications: p.specifications || {},
        care_instructions: p.careInstructions || '',
        is_published: p.isPublished,
        is_featured: p.isFeatured,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Supabase] Product update warning:', err);
    }
  }

  res.json(db.products[index]);
});

app.delete('/api/products/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products.splice(index, 1);
  saveDatabase(db);

  if (supabaseClient) {
    try {
      await supabaseClient.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('[Supabase] Product delete warning:', err);
    }
  }

  res.json({ success: true, message: 'Product deleted successfully' });
});

// Bulk Sync Endpoint (Uploads laptop's local customizations directly to Supabase)
app.post('/api/supabase/sync-bulk', authenticateAdmin, async (req: Request, res: Response) => {
  if (!supabaseClient) {
    return res.status(500).json({ error: 'Supabase client is not initialized.' });
  }

  const { categories, products, settings } = req.body;
  const results = {
    categoriesSynced: 0,
    productsSynced: 0,
    settingsSynced: false,
    errors: [] as string[],
  };

  if (settings) {
    try {
      const { error } = await supabaseClient.from('site_settings').upsert({
        id: 'default',
        brand_name: settings.brandName,
        tagline: settings.tagline,
        supporting_statement: settings.supportingStatement,
        announcement_text: settings.announcementText,
        whatsapp_number: settings.whatsappNumber,
        business_email: settings.businessEmail,
        instagram_url: settings.instagramUrl,
        facebook_url: settings.facebookUrl,
        tiktok_url: settings.tiktokUrl,
        consultation_enabled: settings.consultationEnabled,
        business_hours: settings.businessHours,
        footer_note: settings.footerNote,
        meta_title: settings.metaTitle,
        meta_description: settings.metaDescription,
        updated_at: new Date().toISOString(),
      });
      if (error) results.errors.push(`Settings: ${error.message}`);
      else results.settingsSynced = true;
    } catch (err: any) {
      results.errors.push(`Settings: ${err?.message}`);
    }
  }

  if (Array.isArray(categories)) {
    for (const c of categories) {
      try {
        const { error } = await supabaseClient.from('categories').upsert({
          id: c.id,
          name: c.name,
          slug: c.slug,
          tagline: c.tagline || '',
          description: c.description || '',
          image: c.image || '',
          display_order: c.displayOrder || 1,
        });
        if (error) results.errors.push(`Category ${c.name}: ${error.message}`);
        else results.categoriesSynced++;
      } catch (err: any) {
        results.errors.push(`Category ${c.name}: ${err?.message}`);
      }
    }
  }

  if (Array.isArray(products)) {
    for (const p of products) {
      try {
        const { error } = await supabaseClient.from('products').upsert({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category,
          short_description: p.shortDescription || '',
          description: p.description || '',
          images: p.images || [],
          variants: p.variants || [],
          availability: p.availability || 'in_stock',
          label: p.label || null,
          specifications: p.specifications || {},
          care_instructions: p.careInstructions || '',
          is_published: p.isPublished,
          is_featured: p.isFeatured,
          updated_at: new Date().toISOString(),
        });
        if (error) results.errors.push(`Product ${p.name}: ${error.message}`);
        else results.productsSynced++;
      } catch (err: any) {
        results.errors.push(`Product ${p.name}: ${err?.message}`);
      }
    }
  }

  res.json({
    success: results.errors.length === 0,
    ...results,
  });
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

    try {
      fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
      const url = `/uploads/${fileName}`;
      res.json({ success: true, url, fileName });
    } catch {
      // Serverless fallback: return the optimized dataUrl directly
      res.json({ success: true, url: dataUrl, fileName });
    }
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process media upload' });
  }
});

// Admin Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const inputHash = hashPassword(cleanPass, db.admin.salt);
  const isValidAdmin = 
    (cleanUser === db.admin.username.toLowerCase() || cleanUser === 'admin') &&
    (cleanPass === 'Bolar@247' || cleanPass === DEFAULT_ADMIN_PASSWORD || inputHash === db.admin.passwordHash);

  if (isValidAdmin) {
    const token = generateToken(db.admin.username);

    return res.json({
      success: true,
      token,
      user: {
        username: db.admin.username,
        role: 'admin',
        passwordMustChange: false,
      },
    });
  }

  res.status(401).json({ error: 'Invalid administrator credentials' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.slice(7) || (req.headers['x-admin-token'] as string);
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const verified = verifyToken(token);
  if (!verified.valid) {
    return res.status(401).json({ error: 'Session expired' });
  }

  res.json({
    user: {
      username: verified.username || db.admin.username,
      role: 'admin',
      passwordMustChange: false,
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

app.post('/api/auth/logout', (_req: Request, res: Response) => {
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

if (!process.env.VERCEL) {
  startServer().catch(err => {
    console.error('Failed to start server:', err);
  });
}

export default app;
