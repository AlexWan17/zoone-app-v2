
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';

// Helper to check if Supabase is configured correctly
export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

// Re-export for backwards compatibility
export { supabase, testSupabaseConnection };
