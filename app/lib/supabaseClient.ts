import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Defensive check: prevent crash if variables are missing (e.g. during build)
// This ensures the app can at least start/build, though auth will fail if vars are truly missing.
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Authentication will not work."
  );
}

export const supabase = createClient(url, key);
