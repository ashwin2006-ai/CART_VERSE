import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, Package, AlertCircle, Clock } from 'lucide-react';
import apiClient from '../utils/apiClient';

export const AdminDashboard = ({ adminUser }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    todaysSales: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
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
        const userStats = await apiClient.get('/api/auth/stats');
        
        // For now, we'll use mock data since full admin stats API might not be fully implemented
        // In production, these would come from dedicated admin endpoints
        setStats({
          totalOrders: 156,
          totalCustomers: userStats.data?.totalUsers || 0,
          totalProducts: 0,
          lowStockProducts: 0,
          todaysSales: 12500,
          monthlyRevenue: 285400,
          pendingOrders: 8,
          recentOrders: []
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, trend, color = '#6366f1' }) => (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      transition: 'all 0.3s'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0
      }}>
        <Icon size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: '13px',
          color: '#9ca3af',
          margin: 0,
          fontWeight: '500'
        }}>
          {label}
        </p>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#111827',
          margin: '8px 0 0',
        }}>
          {typeof value === 'number' && value > 999 
            ? (value / 1000).toFixed(1) + 'k' 
            : value}
        </h3>
        {trend && (
          <span style={{
            fontSize: '12px',
            color: trend > 0 ? '#059669' : '#dc2626',
            fontWeight: '600',
            marginTop: '4px'
          }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
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
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontSize: '13px',
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.background = `${color}10`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.background = '#fff';
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <Icon size={20} />
      </div>
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
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

      {/* Alerts & Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {/* Pending Orders Alert */}
        {stats.pendingOrders > 0 && (
          <div style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={24} color="#ea580c" style={{ flexShrink: 0 }} />
            <div>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#ea580c',
                margin: 0
              }}>
                {stats.pendingOrders} Pending Orders
              </p>
              <p style={{
                fontSize: '12px',
                color: '#b45309',
                margin: '4px 0 0'
              }}>
                Review and update order statuses
              </p>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {stats.lowStockProducts > 0 && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={24} color="#dc2626" style={{ flexShrink: 0 }} />
            <div>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#dc2626',
                margin: 0
              }}>
                {stats.lowStockProducts} Low Stock Items
              </p>
              <p style={{
                fontSize: '12px',
                color: '#991b1b',
                margin: '4px 0 0'
              }}>
                Replenish inventory soon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 16px'
        }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px'
        }}>
          <QuickAction label="New Order" icon={ShoppingCart} color="#6366f1" />
          <QuickAction label="Add Product" icon={Package} color="#10b981" />
          <QuickAction label="View Reports" icon={TrendingUp} color="#f59e0b" />
          <QuickAction label="Manage Users" icon={Users} color="#ec4899" />
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '16px',
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
          gap: '12px'
        }}>
          {[
            { action: 'Order #12345 completed', time: '2 hours ago', color: '#10b981' },
            { action: 'New customer registered', time: '4 hours ago', color: '#ec4899' },
            { action: 'Product inventory updated', time: '6 hours ago', color: '#f59e0b' },
            { action: 'Review moderated', time: '1 day ago', color: '#6366f1' },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
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
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#111827',
                  margin: 0
                }}>
                  {item.action}
                </p>
              </div>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Clock size={14} />
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
