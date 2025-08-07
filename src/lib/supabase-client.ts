
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  // Changed to console.warn
  console.warn("Warning: NEXT_PUBLIC_SUPABASE_URL is not set. Please add it to your .env.local file.");
}
if (!supabaseAnonKey) {
  // Changed to console.warn
  console.warn("Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please add it to your .env.local file.");
}

// Fallback to placeholder if not set, to prevent crashing during build/dev if .env.local is missing initially
const activeSupabaseUrl = supabaseUrl || "https://your-project-ref.supabase.co";
const activeSupabaseAnonKey = supabaseAnonKey || "your-anon-key";

export const supabase: SupabaseClient = createClient(activeSupabaseUrl, activeSupabaseAnonKey);

// Helper function to create a .env.local file if it doesn't exist, instructing the user.
// This is just for local development convenience.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      `Supabase URL or Anon Key is missing. 
      Please create a '.env.local' file in the root of your project with:
      NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key

      You can get these from your Supabase project settings.
      The app is currently using placeholder values.`
    );
  }
}

