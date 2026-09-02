/**
 * Supabase Client Configuration (Optional)
 * ────────────────────────────────────────────────────────────────
 * Supabase is optional - app works without it
 * 
 * Environment Variables (Optional):
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key
 * 
 * SECURITY NOTES:
 * ✓ Uses VITE_* prefix for frontend exposure (safe)
 * ✗ NEVER expose SUPABASE_SERVICE_ROLE_KEY on frontend
 * ✗ NEVER hardcode credentials in code
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock/dummy client if variables are not set
// This prevents crashes and allows the app to function
const createSupabaseClient = () => {
  // If either variable is missing, return a dummy client
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      '⚠️  Supabase not configured - using mock mode\n' +
      'To enable Supabase:\n' +
      '  1. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment\n' +
      '  2. Visit /debug-env to check configuration status'
    );
    // Return a mock object that won't crash
    return {
      from: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      auth: { getSession: () => Promise.resolve({ data: { session: null }, error: null }) },
    };
  }

  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
      },
    });
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    // Return mock on error
    return {
      from: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      auth: { getSession: () => Promise.resolve({ data: { session: null }, error: null }) },
    };
  }
};

export const supabase = createSupabaseClient();

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = () => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};

/**
 * Get Supabase configuration status
 */
export const getSupabaseStatus = () => ({
  configured: isSupabaseConfigured(),
  url: SUPABASE_URL ? '✓ Set' : '✗ Missing',
  key: SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
  message: isSupabaseConfigured()
    ? 'Supabase client is ready.'
    : 'Supabase not configured - app using mock mode.',
});

export default supabase;
