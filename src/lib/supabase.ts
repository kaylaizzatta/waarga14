import { createClient } from '@supabase/supabase-js';

/**
 * Supabase browser client — gunakan di Client Components.
 * Tunduk pada Row Level Security (RLS) sesuai anon key.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);