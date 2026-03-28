
import { createClient } from '@supabase/supabase-js';

// No Vite, process.env é injetado via config.define ou lido do localStorage
const getEnv = (key: string) => {
    const env = (import.meta as any).env || {};
    const processEnv = (typeof process !== 'undefined' ? process.env : {}) as any;
    const val = env[`VITE_${key}`] || processEnv[`VITE_${key}`] || processEnv[key];
    return (val && val !== 'undefined' && val !== '') ? val : null;
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
