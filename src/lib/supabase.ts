import { createClient } from '@supabase/supabase-js';

const rawUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  'https://habpuiqysybzozajamtr.supabase.co';

const cleanSupabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYnB1aXF5c3liem96YWphbXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjI4NjQsImV4cCI6MjEwNzgzODg2NH0.N2wIK0kbD472BydOEMNqlV73TO3COsqzkCzUzQalvYg';

export const isSupabaseConfigured = Boolean(cleanSupabaseUrl && supabaseAnonKey);

export const supabase = createClient(cleanSupabaseUrl, supabaseAnonKey);
