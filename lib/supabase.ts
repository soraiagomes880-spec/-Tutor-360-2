
import { createClient } from '@supabase/supabase-js';

// No Vite, process.env é injetado via config.define
const getEnv = (key: string) => {
  try {
    const val = (process.env as any)[`VITE_${key}`] || (process.env as any)[key];
    return (val && val !== 'undefined') ? val : null;
  } catch {
    return null;
  }
};

const supabaseUrl = getEnv('SUPABASE_URL') || (typeof window !== 'undefined' ? localStorage.getItem('supabase_url') : null);
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || (typeof window !== 'undefined' ? localStorage.getItem('supabase_key') : null);

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('supabase_url', url);
  localStorage.setItem('supabase_key', key);
  window.location.reload();
};
