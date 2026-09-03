import React, { useState } from 'react';
import { Menu, X, LogOut, LayoutGrid, Package, ShoppingCart, Users, BarChart3, Settings, ChevronRight } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductManagement } from './AdminProductManagement';
import { AdminOrderManagement } from './AdminOrderManagement';
import { AdminCustomerManagement } from './AdminCustomerManagement';

export const AdminPanel = ({ adminUser, onLogout }) => {
  const [sidebarOpen, setSearchOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '80px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo Area */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                ⚙️
              </div>
              <div>
                <h2 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: 0 }}>
                  CARTVERSE
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSearchOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  marginBottom: '8px',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  border: '1px solid ' + (isActive ? 'rgba(99, 102, 241, 0.5)' : 'transparent'),
                  borderRadius: '8px',
                  color: isActive ? '#6C63FF' : '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.3s'
                }}
              >
                <Icon size={20} />
                {sidebarOpen && item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          {sidebarOpen && (
            <div style={{
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              marginBottom: '12px',
              color: '#fff'
            }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Logged in as:</p>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: '4px 0 0' }}>
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
              gap: '12px',
              padding: '12px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s'
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
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>
              {menuItems.find(m => m.id === activeSection)?.label || 'Dashboard'}
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 0' }}>
              Manage your CartVerse store
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#9ca3af',
            fontSize: '13px'
          }}>
            <span>👤 {adminUser?.email}</span>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {activeSection === 'dashboard' && <AdminDashboard adminUser={adminUser} />}
          {activeSection === 'products' && <AdminProductManagement />}
          {activeSection === 'orders' && <AdminOrderManagement />}
          {activeSection === 'customers' && <AdminCustomerManagement />}
          {activeSection === 'analytics' && <AdminAnalyticsView />}
          {activeSection === 'settings' && <AdminSettingsView />}
        </div>
      </div>
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
