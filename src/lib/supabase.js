/**
 * Supabase Client Configuration
 * ────────────────────────────────────────────────────────────────
 * Initializes Supabase client with environment variables.
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key
 * 
 * SECURITY NOTES:
 * ✓ Uses VITE_* prefix for frontend exposure (safe)
 * ✗ NEVER expose SUPABASE_SERVICE_ROLE_KEY on frontend
 * ✗ NEVER hardcode credentials in code
 * 
 * Reference: https://supabase.com/docs/reference/javascript/initializing
 */

import { createClient } from '@supabase/supabase-js';

// ────────────────────────────────────────────────────────────────
// Environment Variable Validation
// ────────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔍 Supabase Environment Check:');
  console.log('  VITE_SUPABASE_URL:', SUPABASE_URL ? '✓ Set (' + SUPABASE_URL.substring(0, 20) + '...)' : '✗ Missing');
  console.log('  VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓ Set (' + SUPABASE_ANON_KEY.substring(0, 20) + '...)' : '✗ Missing');
}

let supabase = null;
let isConfigured = false;

// Only create client if both variables are set
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
      },
    });
    isConfigured = true;
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    supabase = null;
  }
} else {
  console.warn(
    '⚠️ SUPABASE NOT CONFIGURED\n' +
    'Missing environment variables:\n' +
    (SUPABASE_URL ? '' : '  - VITE_SUPABASE_URL\n') +
    (SUPABASE_ANON_KEY ? '' : '  - VITE_SUPABASE_ANON_KEY\n') +
    '\nFor local development: Add to .env.local\n' +
    'For Vercel: Settings > Environment Variables > Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n' +
    'Then redeploy.'
  );
}

// ────────────────────────────────────────────────────────────────
// Supabase Client Instance (may be null if not configured)
// ────────────────────────────────────────────────────────────────

/**
 * Supabase client instance
 * Check isSupabaseConfigured() before using
 * 
 * Usage:
 * ```javascript
 * import { supabase, isSupabaseConfigured } from '@/lib/supabase';
 * 
 * if (!isSupabaseConfigured()) {
 *   console.warn('Supabase not available');
 *   return;
 * }
 * 
 * const { data, error } = await supabase.from('products').select('*');
 * ```
 */
export { supabase };

/**
 * Helper function to check if Supabase is properly configured
 * ALWAYS use this before calling supabase methods
 * 
 * @returns {boolean} true if Supabase is configured, false otherwise
 */
export const isSupabaseConfigured = () => {
  return isConfigured && supabase !== null;
};

/**
 * Helper function to get Supabase configuration status
 * Useful for debugging connection issues
 * 
 * @returns {object} Configuration status object
 */
export const getSupabaseStatus = () => ({
  configured: isSupabaseConfigured(),
  url: SUPABASE_URL ? '✓ Set' : '✗ Missing',
  key: SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
  message: !isSupabaseConfigured()
    ? 'Supabase client is not properly configured. Check environment variables.'
    : 'Supabase client is ready.'
});

export default supabase;
