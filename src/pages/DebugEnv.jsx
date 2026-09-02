import React from 'react';

export function DebugEnv() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const apiUrl = import.meta.env.VITE_API_URL;

  const EnvVar = ({ name, value }) => {
    const exists = !!value;
    const displayValue = value 
      ? (value.length > 40 ? `${value.substring(0, 30)}...` : value)
      : 'undefined';
    
    return (
      <div style={styles.envRow}>
        <span style={styles.varName}>{name}</span>
        <span style={styles.colon}>:</span>
        <span style={{
          ...styles.varValue,
          color: exists ? '#6a9955' : '#f48771'
        }}>
          {displayValue}
        </span>
        <span style={{ marginLeft: '8px', fontSize: '16px' }}>
          {exists ? '✅' : '❌'}
        </span>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Environment Variables Debug</h1>
      
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Vite Environment Variables</h2>
        
        <EnvVar 
          name="VITE_SUPABASE_URL" 
          value={supabaseUrl}
        />
        
        <EnvVar 
          name="VITE_SUPABASE_ANON_KEY" 
          value={supabaseKey}
        />
        
        <EnvVar 
          name="VITE_API_URL" 
          value={apiUrl}
        />
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>How to Fix</h2>
        <ol style={styles.instructions}>
          <li style={styles.instructionItem}>
            Go to <code style={styles.code}>https://vercel.com/dashboard</code>
          </li>
          <li style={styles.instructionItem}>
            Click your <code style={styles.code}>e-commerce</code> project
          </li>
          <li style={styles.instructionItem}>
            Go to <code style={styles.code}>Settings</code> → <code style={styles.code}>Environment Variables</code>
          </li>
          <li style={styles.instructionItem}>
            Add these two variables:
            <div style={styles.variableList}>
              <div style={styles.variableItem}>
                <code style={styles.code}>VITE_SUPABASE_URL</code>
                <div style={styles.variableValue}>https://yjzkfwyattiibfgnngiv.supabase.co</div>
              </div>
              <div style={styles.variableItem}>
                <code style={styles.code}>VITE_SUPABASE_ANON_KEY</code>
                <div style={styles.variableValue}>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqemtmd3lhdHRpaWJmZ25uZ2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTE4NjUsImV4cCI6MjEwMzgyNzg2NX0.AjmaFKcARU0MOJHnUI-0PcLUOkQwtM9xC16AfFjgUJA</div>
              </div>
            </div>
          </li>
          <li style={styles.instructionItem}>
            For each variable, select <code style={styles.code}>Production, Preview, Development</code>
          </li>
          <li style={styles.instructionItem}>
            Click <code style={styles.code}>Save</code>
          </li>
          <li style={styles.instructionItem}>
            Go to <code style={styles.code}>Deployments</code> and redeploy the latest deployment
          </li>
        </ol>
      </div>

      <button
        onClick={() => window.location.reload()}
        style={styles.button}
      >
        Refresh
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'monospace',
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    minHeight: '100vh',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  title: {
    color: '#4ec9b0',
    marginBottom: '20px',
    fontSize: '24px',
  },
  card: {
    backgroundColor: '#252526',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #3e3e42',
  },
  cardTitle: {
    color: '#ce9178',
    margin: '0 0 15px 0',
    fontSize: '16px',
  },
  envRow: {
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  varName: {
    color: '#9cdcfe',
    fontWeight: 'bold',
  },
  colon: {
    color: '#d7ba7d',
  },
  varValue: {
    color: '#ce9178',
  },
  code: {
    backgroundColor: '#1e1e1e',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '12px',
    color: '#9cdcfe',
  },
  instructions: {
    margin: '0',
    paddingLeft: '20px',
  },
  instructionItem: {
    marginBottom: '10px',
    lineHeight: '1.8',
  },
  variableList: {
    marginTop: '10px',
    marginLeft: '20px',
    backgroundColor: '#1e1e1e',
    padding: '10px',
    borderRadius: '4px',
  },
  variableItem: {
    marginBottom: '8px',
  },
  variableValue: {
    color: '#6a9955',
    marginTop: '4px',
    fontSize: '12px',
    wordBreak: 'break-all',
    backgroundColor: '#252526',
    padding: '4px',
    borderRadius: '3px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0e639c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'monospace',
  },
};

export default DebugEnv;
