import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f7f8fa',
          padding: '20px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#ef4444', marginBottom: '10px' }}>
              ⚠️ Something Went Wrong
            </h1>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
              The app encountered an error. Please try refreshing the page.
            </p>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>
              Error: {this.state.error?.message}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                background: '#6C63FF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
