
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sqqdonukgpcfpwgaazne.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcWRvbnVrZ3BjZnB3Z2Fhem5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDUzNjMsImV4cCI6MjA2MzQyMTM2M30.T7VxRMeuiH2iaS9SeUkFoMcH0Rx0epMOwSMCtoRHD0Y";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Helper function to test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple auth check that doesn't rely on specific tables
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
};
