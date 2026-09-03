import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, Package, AlertCircle, Clock } from 'lucide-react';
import apiClient from '../utils/apiClient';

export const AdminDashboard = ({ adminUser }) => {
  const [stats, setStats] = useState({
    totalOrders: 156,
    totalCustomers: 45,
    totalProducts: 324,
    lowStockProducts: 8,
    todaysSales: 12500,
    monthlyRevenue: 285400,
    pendingOrders: 5,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch user statistics
        try {
          const userStats = await apiClient.get('/api/auth/stats');
          if (userStats.data) {
            setStats(prev => ({
              ...prev,
              totalCustomers: userStats.data?.totalUsers || prev.totalCustomers
            }));
          }
        } catch (apiErr) {
          console.log('Using default stats:', apiErr.message);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        // Use default stats on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const StatCard = ({ icon: Icon, label, value, trend, color = '#6366f1' }) => (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: isMobile ? '14px' : '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: isMobile ? '12px' : '16px',
      transition: 'all 0.3s'
    }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.borderColor = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }
      }}
    >
      <div style={{
        width: isMobile ? '40px' : '48px',
        height: isMobile ? '40px' : '48px',
        borderRadius: '12px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0
      }}>
        <Icon size={isMobile ? 20 : 24} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: isMobile ? '12px' : '13px',
          color: '#9ca3af',
          margin: 0,
          fontWeight: '500'
        }}>
          {label}
        </p>
        <h3 style={{
          fontSize: isMobile ? '18px' : '24px',
          fontWeight: '800',
          color: '#111827',
          margin: '6px 0 0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {typeof value === 'number' && value > 999 
            ? (value / 1000).toFixed(1) + 'k' 
            : value}
        </h3>
        {trend && (
          <span style={{
            fontSize: '11px',
            color: trend > 0 ? '#059669' : '#dc2626',
            fontWeight: '600',
            marginTop: '4px',
            display: 'inline-block'
          }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );

  const QuickAction = ({ label, icon: Icon, onClick, color = '#6366f1' }) => (
    <button
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: isMobile ? '12px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontSize: isMobile ? '12px' : '13px',
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center'
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.background = `${color}10`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.background = '#fff';
        }
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <Icon size={18} />
      </div>
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        color: '#9ca3af'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #6366f1',
            borderRadius: '50%',
            margin: '0 auto 12px',
            animation: 'spin 0.8s linear infinite'
          }} />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '12px 16px',
          color: '#dc2626',
          fontSize: '13px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: isMobile ? '12px' : '16px'
      }}>
        <StatCard 
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.totalOrders}
          trend={12}
          color="#6366f1"
        />
        <StatCard 
          icon={Users}
          label="Total Customers"
          value={stats.totalCustomers}
          trend={8}
          color="#ec4899"
        />
        <StatCard 
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          trend={-2}
          color="#f59e0b"
        />
        <StatCard 
          icon={TrendingUp}
          label="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString()}`}
          trend={15}
          color="#10b981"
        />
      </div>

      {/* Alerts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: isMobile ? '10px' : '16px'
      }}>
        {stats.pendingOrders > 0 && (
          <div style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={20} color="#ea580c" style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#ea580c',
                margin: 0
              }}>
                {stats.pendingOrders} Pending
              </p>
              <p style={{
                fontSize: '12px',
                color: '#b45309',
                margin: '3px 0 0'
              }}>
                Orders awaiting update
              </p>
            </div>
          </div>
        )}

        {stats.lowStockProducts > 0 && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#dc2626',
                margin: 0
              }}>
                {stats.lowStockProducts} Low Stock
              </p>
              <p style={{
                fontSize: '12px',
                color: '#991b1b',
                margin: '3px 0 0'
              }}>
                Need replenishment
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 12px'
        }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: isMobile ? '10px' : '12px'
        }}>
          <QuickAction label="New Order" icon={ShoppingCart} color="#6366f1" />
          <QuickAction label="Add Product" icon={Package} color="#10b981" />
          <QuickAction label="Reports" icon={TrendingUp} color="#f59e0b" />
          <QuickAction label="Users" icon={Users} color="#ec4899" />
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: isMobile ? '14px' : '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <h3 style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            Recent Activity
          </h3>
          <span style={{
            fontSize: '12px',
            color: '#6366f1',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            View All →
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '8px' : '12px'
        }}>
          {[
            { action: 'Order #12345 completed', time: '2h ago', color: '#10b981' },
            { action: 'New customer registered', time: '4h ago', color: '#ec4899' },
            { action: 'Product inventory updated', time: '6h ago', color: '#f59e0b' },
            { action: 'Review moderated', time: '1d ago', color: '#6366f1' },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isMobile ? '8px' : '12px',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: item.color,
                flexShrink: 0
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: isMobile ? '12px' : '13px',
                  fontWeight: '500',
                  color: '#111827',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.action}
                </p>
              </div>
              <span style={{
                fontSize: '11px',
                color: '#9ca3af',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
