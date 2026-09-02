import React from 'react';

/**
 * Debug page to check environment variables on Vercel
 * Visit: http://localhost:3000/debug-env (dev) or your-site.vercel.app/debug-env
 */
export function DebugEnv() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'monospace',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      minHeight: '100vh',
      fontSize: '12px',
      lineHeight: '1.6',
    }}>
      <h1 style={{ color: '#4ec9b0', marginBottom: '20px' }}>🔍 Environment Variables Debug</h1>
      
      <div style={{
        backgroundColor: '#252526',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #3e3e42',
      }}>
        <h2 style={{ color: '#ce9178', margin: '0 0 10px 0' }}>Vite Env Variables (import.meta.env)</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#9cdcfe' }}>VITE_SUPABASE_URL</span>
          <span style={{ color: '#d7ba7d' }}>:</span>
          <span style={{ color: '#ce9178', marginLeft: '8px' }}>
            {import.meta.env.VITE_SUPABASE_URL ? (
              <>
                <span style={{ color: '#6a9955' }}>"{import.meta.env.VITE_SUPABASE_URL}"</span>
                <span style={{ color: '#6a9955', marginLeft: '8px' }}>✅</span>
              </>
            ) : (
              <>
                <span style={{ color: '#f48771' }}>undefined</span>
                <span style={{ color: '#f48771', marginLeft: '8px' }}>❌</span>
              </>
            )}
          </span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#9cdcfe' }}>VITE_SUPABASE_ANON_KEY</span>
          <span style={{ color: '#d7ba7d' }}>:</span>
          <span style={{ color: '#ce9178', marginLeft: '8px' }}>
            {import.meta.env.VITE_SUPABASE_ANON_KEY ? (
              <>
                <span style={{ color: '#6a9955' }}>"{import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 30)}..."</span>
                <span style={{ color: '#6a9955', marginLeft: '8px' }}>✅</span>
              </>
            ) : (
              <>
                <span style={{ color: '#f48771' }}>undefined</span>
                <span style={{ color: '#f48771', marginLeft: '8px' }}>❌</span>
              </>
            )}
          </span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#9cdcfe' }}>VITE_API_URL</span>
          <span style={{ color: '#d7ba7d' }}>:</span>
          <span style={{ color: '#ce9178', marginLeft: '8px' }}>
            {import.meta.env.VITE_API_URL ? (
              <>
                <span style={{ color: '#6a9955' }}>"{import.meta.env.VITE_API_URL}"</span>
                <span style={{ color: '#6a9955', marginLeft: '8px' }}>✅</span>
              </>
            ) : (
              <>
                <span style={{ color: '#f48771' }}>undefined</span>
                <span style={{ color: '#f48771', marginLeft: '8px' }}>❌</span>
              </>
            )}
          </span>
        </div>
      </div>

      <div style={{
        backgroundColor: '#252526',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #3e3e42',
      }}>
        <h2 style={{ color: '#ce9178', margin: '0 0 10px 0' }}>All Available Env Variables</h2>
        <pre style={{
          margin: 0,
          overflow: 'auto',
          maxHeight: '300px',
          padding: '10px',
          backgroundColor: '#1e1e1e',
          borderRadius: '4px',
        }}>
          {JSON.stringify(import.meta.env, null, 2)}
        </pre>
      </div>

      <div style={{
        backgroundColor: '#252526',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #3e3e42',
      }}>
        <h2 style={{ color: '#ce9178', margin: '0 0 10px 0' }}>Instructions</h2>
        <ol style={{ margin: '0', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            If <span style={{ color: '#6a9955' }}>VITE_SUPABASE_URL</span> shows ❌, then:
            <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li>Go to <span style={{ color: '#9cdcfe' }}>https://vercel.com/dashboard</span></li>
              <li>Click your <span style={{ color: '#9cdcfe' }}>e-commerce</span> project</li>
              <li>Go to <span style={{ color: '#9cdcfe' }}>Settings → Environment Variables</span></li>
              <li>Add:
                <pre style={{
                  backgroundColor: '#1e1e1e',
                  padding: '8px',
                  borderRadius: '4px',
                  marginTop: '4px',
                  fontSize: '11px',
                }}>VITE_SUPABASE_URL=https://yjzkfwyattiibfgnngiv.supabase.co</pre>
              </li>
              <li>Make sure it applies to <span style={{ color: '#6a9955' }}>Production, Preview, Development</span></li>
              <li>Click <span style={{ color: '#9cdcfe' }}>Save</span></li>
              <li>Go to <span style={{ color: '#9cdcfe' }}>Deployments</span> and redeploy</li>
            </ol>
          </li>
        </ol>
      </div>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0e639c',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        🔄 Refresh
      </button>
    </div>
  );
}

export default DebugEnv;
