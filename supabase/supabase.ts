import { createClient } from "@supabase/supabase-js";

// Only use environment variables, no hardcoded fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Log the values for debugging (without revealing full key)
if (supabaseUrl && supabaseKey) {
  console.log("Supabase URL is configured");
  console.log("Supabase Key is configured");
} else {
  console.warn("Missing Supabase configuration. Please check your environment variables.");
}

// Create Supabase client with minimal options
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export a function to get a fresh client for each request
export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey);
}
