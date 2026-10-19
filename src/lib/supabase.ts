import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  'https://habpuiqysybzozajamtr.supabase.co';

export const cleanSupabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

export const defaultSupabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYnB1aXF5c3liem96YWphbXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjI4NjQsImV4cCI6MjEwNzgzODg2NH0.N2wIK0kbD472BydOEMNqlV73TO3COsqzkCzUzQalvYg';

export function getActiveSupabaseKey(): string {
  if (typeof window !== 'undefined') {
    const customServiceKey = localStorage.getItem('bola_supabase_service_role_key');
    if (customServiceKey && customServiceKey.trim().length > 20) {
      return customServiceKey.trim();
    }
  }
  const envServiceKey = 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_SERVICE_ROLE_KEY) ||
    (typeof process !== 'undefined' && process.env?.SUPABASE_SERVICE_ROLE_KEY);
  if (envServiceKey && envServiceKey.trim().length > 20) {
    return envServiceKey.trim();
  }
  return defaultSupabaseAnonKey;
}

export function createSupabaseInstance(customKey?: string): SupabaseClient {
  const key = customKey || getActiveSupabaseKey();
  return createClient(cleanSupabaseUrl, key);
}

export const isSupabaseConfigured = Boolean(cleanSupabaseUrl && defaultSupabaseAnonKey);
export const supabase = createSupabaseInstance();

export async function testSupabaseWrite(): Promise<{ success: boolean; rlsBlocked: boolean; error?: string }> {
  try {
    const client = createSupabaseInstance();
    const { error } = await client.from('site_settings').upsert({
      id: 'default',
      updated_at: new Date().toISOString(),
    });
    if (error) {
      const isRls = error.message?.toLowerCase().includes('row-level security') || error.code === '42501';
      return { success: false, rlsBlocked: isRls, error: error.message };
    }
    return { success: true, rlsBlocked: false };
  } catch (err: any) {
    return { success: false, rlsBlocked: false, error: err?.message || 'Network error' };
  }
}
