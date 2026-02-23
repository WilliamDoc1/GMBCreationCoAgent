import { createClient } from '@supabase/supabase-js';

// These variables are provided by the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// We initialize the client with fallbacks to avoid crashing the app if keys are missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey);