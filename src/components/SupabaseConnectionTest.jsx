/**
 * SupabaseConnectionTest Component
 * ────────────────────────────────────────────────────────────────
 * Optional test component to verify Supabase connection is working.
 * 
 * Usage:
 * Import this component in your App.jsx during development:
 * <SupabaseConnectionTest />
 * 
 * Remove or conditionally show only in development before production.
 */

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, getSupabaseStatus } from '@/lib';

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState('Checking connection...');
  const [details, setDetails] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      // 1. Check if configured
      const configured = isSupabaseConfigured();
      setIsConfigured(configured);

      if (!configured) {
        setStatus(
          '❌ Supabase NOT configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
        );
        setDetails(getSupabaseStatus());
        return;
      }

      // 2. Check session
      const { data: { session } } = await supabase.auth.getSession();
      setSessionUser(session?.user || null);

      // 3. Set success status
      if (session?.user) {
        setStatus(`✓ Supabase Connected • User: ${session.user.email}`);
      } else {
        setStatus('✓ Supabase Connected • No user logged in');
      }

      setDetails(getSupabaseStatus());
    } catch (error) {
      setStatus(`❌ Connection Error: ${error.message}`);
      setDetails(error);
    }
  };

  if (!isConfigured) {
    return (
      <div
        style={{
          padding: '16px',
          margin: '16px',
          border: '2px solid #ef4444',
          borderRadius: '8px',
          background: '#fee2e2',
          color: '#991b1b',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
          ⚠️ Supabase Configuration Error
        </h3>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
          {status}
        </p>
        {details && (
          <pre
            style={{
              margin: '8px 0 0 0',
              padding: '8px',
              background: '#fecaca',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(details, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '16px',
        margin: '16px',
        border: '2px solid #10b981',
        borderRadius: '8px',
        background: '#ecfdf5',
        color: '#065f46',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
        ✓ Supabase Connection Status
      </h3>
      <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
        {status}
      </p>
      {sessionUser && (
        <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
          <strong>Email:</strong> {sessionUser.email}
        </p>
      )}
      {details && (
        <div
          style={{
            fontSize: '12px',
            padding: '8px',
            background: '#d1fae5',
            borderRadius: '4px',
            marginTop: '8px',
          }}
        >
          <strong>Configuration:</strong>
          <br />
          URL: {details.url}
          <br />
          Key: {details.key}
        </div>
      )}
      <button
        onClick={checkSupabaseConnection}
        style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        Refresh Status
      </button>
    </div>
  );
}

export default SupabaseConnectionTest;
