import React, { useState } from 'react';
import { Menu, X, LogOut, LayoutGrid, Package, ShoppingCart, Users, BarChart3, Settings, ChevronRight } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductManagement } from './AdminProductManagement';
import { AdminOrderManagement } from './AdminOrderManagement';
import { AdminCustomerManagement } from './AdminCustomerManagement';

export const AdminPanel = ({ adminUser, onLogout }) => {
  const [sidebarOpen, setSearchOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    onLogout();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: isMobile ? (sidebarOpen ? '70px' : '0px') : (sidebarOpen ? '280px' : '80px'),
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'relative',
        height: '100vh',
        zIndex: 100,
        overflowY: 'auto'
      }}>
        {/* Logo Area */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '60px'
        }}>
          {(sidebarOpen || !isMobile) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                ⚙️
              </div>
              {!isMobile && sidebarOpen && (
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ color: '#fff', fontSize: '13px', fontWeight: '700', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    ADMIN
                  </h2>
                  <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>CartVerse</p>
                </div>
              )}
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setSearchOpen(!sidebarOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                opacity: 0.7,
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setSearchOpen(false);
                }}
                title={!sidebarOpen || isMobile ? item.label : ''}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: !sidebarOpen && !isMobile ? 'center' : 'flex-start',
                  gap: '12px',
                  padding: '11px',
                  marginBottom: '6px',
                  background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                  border: '1px solid ' + (isActive ? 'rgba(99, 102, 241, 0.5)' : 'transparent'),
                  borderRadius: '8px',
                  color: isActive ? '#6C63FF' : '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  minHeight: '40px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {(sidebarOpen || !isMobile) && item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {(sidebarOpen || !isMobile) && (
            <div style={{
              padding: '10px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px'
            }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Admin:</p>
              <p style={{ fontSize: '13px', fontWeight: '600', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {adminUser?.name || 'Administrator'}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: !sidebarOpen && !isMobile ? 'center' : 'flex-start',
              gap: '12px',
              padding: '11px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s',
              minHeight: '40px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {(sidebarOpen || !isMobile) && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: isMobile && sidebarOpen ? '70px' : '0' }}>
        {/* Top Bar */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: isMobile ? '12px 16px' : '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '60px'
        }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '800', color: '#111827', margin: 0 }}>
              {menuItems.find(m => m.id === activeSection)?.label || 'Dashboard'}
            </h1>
            <p style={{ fontSize: isMobile ? '11px' : '13px', color: '#9ca3af', margin: '3px 0 0' }}>
              Manage your CartVerse store
            </p>
          </div>
          {!isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: '#9ca3af',
              fontSize: '13px'
            }}>
              <span>👤 {adminUser?.email}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: isMobile ? '12px' : '20px', overflowY: 'auto' }}>
          {activeSection === 'dashboard' && <AdminDashboard adminUser={adminUser} />}
          {activeSection === 'products' && <AdminProductManagement />}
          {activeSection === 'orders' && <AdminOrderManagement />}
          {activeSection === 'customers' && <AdminCustomerManagement />}
          {activeSection === 'analytics' && <AdminAnalyticsView />}
          {activeSection === 'settings' && <AdminSettingsView />}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50
          }}
        />
      )}
    </div>
  );
};

// Placeholder components for remaining sections
const AdminAnalyticsView = () => (
  <div style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
    <h2 style={{ margin: 0, marginBottom: '16px' }}>Analytics & Reports</h2>
    <p style={{ color: '#9ca3af' }}>Analytics and reporting interface will be loaded here</p>
  </div>
);

const AdminSettingsView = () => (
  <div style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
    <h2 style={{ margin: 0, marginBottom: '16px' }}>Settings</h2>
    <p style={{ color: '#9ca3af' }}>Admin settings interface will be loaded here</p>
  </div>
);
