// client/src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseClientConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your-project-ref") &&
  !supabaseAnonKey.includes("your-anon-key")
);

export const supabase = isSupabaseClientConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
