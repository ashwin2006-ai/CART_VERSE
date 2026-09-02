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

// Validate required environment variables at client initialization
if (!SUPABASE_URL) {
  console.error(
    '❌ SUPABASE ERROR: VITE_SUPABASE_URL is not defined.\n' +
    'Add to .env.local or environment variables:\n' +
    'VITE_SUPABASE_URL=https://your-project.supabase.co'
  );
}

if (!SUPABASE_ANON_KEY) {
  console.error(
    '❌ SUPABASE ERROR: VITE_SUPABASE_ANON_KEY is not defined.\n' +
    'Add to .env.local or environment variables:\n' +
    'VITE_SUPABASE_ANON_KEY=your_anon_key'
  );
}

// ────────────────────────────────────────────────────────────────
// Supabase Client Initialization
// ────────────────────────────────────────────────────────────────

/**
 * Supabase client instance
 * 
 * Usage:
 * ```javascript
 * import { supabase } from '@/lib/supabase';
 * 
 * // Authenticate
 * const { data, error } = await supabase.auth.signUp({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * 
 * // Query data
 * const { data: products, error } = await supabase
 *   .from('products')
 *   .select('*')
 *   .limit(10);
 * ```
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
});

/**
 * Helper function to check if Supabase is properly configured
 * Use this in components that require Supabase connection
 * 
 * @returns {boolean} true if Supabase is configured, false otherwise
 */
export const isSupabaseConfigured = () => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
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
