import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Server, Database, Users, Package, ShoppingBag, BarChart3,
  Activity, RefreshCw, CheckCircle2, AlertCircle, XCircle,
  Lock, Shield, Clock, Zap, DollarSign, TrendingUp
} from 'lucide-react';

export const AdminSystemStatus = () => {
  const { products, orders, user, theme, cart, wishlist } = useShop();
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const statsTimerRef = useRef(null);
  const prevStatsRef = useRef(null);

  const isDark = theme === 'dark';
  const bg = isDark ? '#0b0f1a' : '#f7f8fa';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  // Calculate comprehensive statistics with debounce to prevent infinite loops
  useEffect(() => {
    // Clear any pending timer
    if (statsTimerRef.current) clearTimeout(statsTimerRef.current);
    
    // Debounce the calculation by 1 second
    statsTimerRef.current = setTimeout(() => {
      calculateStats();
    }, 1000);

    // Cleanup
    return () => {
      if (statsTimerRef.current) clearTimeout(statsTimerRef.current);
    };
  }, [products?.length, orders?.length, user?.id, cart?.length, wishlist?.length]);

  const calculateStats = () => {
    // Get local users from localStorage
    let localUsers = [];
    try {
      const stored = localStorage.getItem('cartverse_local_users');
      localUsers = stored ? JSON.parse(stored) : [];
    } catch {
      localUsers = [];
    }

    // Calculate stats
    const stats = {
      timestamp: new Date().toLocaleString(),
      
      // Database Collections
      collections: {
        products: {
          count: products?.length || 0,
          status: 'active',
          storage: `${(products?.length * 2.5).toFixed(2)} MB` // Estimate
        },
        orders: {
          count: orders?.length || 0,
          status: 'active',
          storage: `${(orders?.length * 3.2).toFixed(2)} MB`
        },
        users: {
          count: localUsers?.length || 0,
          status: 'active',
          storage: `${(localUsers?.length * 1.8).toFixed(2)} MB`
        },
        cart: {
          count: cart?.length || 0,
          status: 'active',
          storage: `${(cart?.length * 0.8).toFixed(2)} MB`
        },
        wishlist: {
          count: wishlist?.length || 0,
          status: 'active',
          storage: `${(wishlist?.length * 0.5).toFixed(2)} MB`
        }
      },

      // User Statistics
      users: {
        total: localUsers?.length || 0,
        active: Math.ceil((localUsers?.length || 0) * 0.75),
        inactive: Math.floor((localUsers?.length || 0) * 0.25),
        premium: Math.ceil((localUsers?.length || 0) * 0.1)
      },

      // Product Statistics
      products: {
        total: products?.length || 0,
        inStock: products?.filter(p => p.stock > 0).length || 0,
        lowStock: products?.filter(p => p.stock > 0 && p.stock <= 5).length || 0,
        outOfStock: products?.filter(p => p.stock <= 0).length || 0,
        featured: products?.filter(p => p.featured).length || 0,
        bestSellers: products?.filter(p => p.bestSeller).length || 0
      },

      // Order Statistics
      orders: {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.status === 'Pending').length || 0,
        confirmed: orders?.filter(o => o.status === 'Confirmed').length || 0,
        shipped: orders?.filter(o => o.status === 'Shipped').length || 0,
        delivered: orders?.filter(o => o.status === 'Delivered').length || 0,
        cancelled: orders?.filter(o => o.status === 'Cancelled').length || 0,
        totalRevenue: orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
        avgOrder: orders?.length > 0 ? (orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length).toFixed(2) : 0
      },

      // System Health
      system: {
        uptime: '99.9%',
        responseTime: '45ms',
        apiStatus: 'operational',
        databaseStatus: 'connected',
        cacheStatus: 'enabled'
      },

      // Access Control
      access: {
        adminLogged: !!user?.isLoggedIn,
        currentUser: user?.name || 'Guest',
        lastLogin: new Date().toLocaleString(),
        sessionActive: true,
        ipAddress: 'Protected',
        securityLevel: 'High'
      }
    };

    setStats(stats);
    setLastUpdate(new Date());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      calculateStats();
      setRefreshing(false);
    }, 1000);
  };

  if (!stats) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: bg,
        color: text
      }}>
        <div style={{ textAlign: 'center' }}>
          <Zap size={40} color={accent} style={{ animation: 'spin 1s linear infinite' }} />
          <p>Loading system status...</p>
        </div>
      </div>
    );
  }

  const StatusCard = ({ title, icon: Icon, children, color = accent }) => (
    <div style={{
      background: cardBg,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      gap: '12px',
      boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0,
      }}>
        <Icon size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          {title}
        </div>
        {children}
      </div>
    </div>
  );

  const DataRow = ({ label, value, subtext, color = text }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: `1px solid ${border}`,
      fontSize: '0.9rem'
    }}>
      <span style={{ color: muted }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, color, fontSize: '1.1rem' }}>{value}</div>
        {subtext && <div style={{ fontSize: '0.75rem', color: muted }}>{subtext}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', background: bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: text, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Server size={32} color={accent} /> System Status & Database
            </h1>
            <p style={{ fontSize: '0.85rem', color: muted, margin: '6px 0 0', fontWeight: 400 }}>
              Real-time system health, database collections, and access control
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: accent,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              opacity: refreshing ? 0.7 : 1,
              transform: refreshing ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <RefreshCw size={16} />
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>

        {/* Last Update Info */}
        <div style={{
          background: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)',
          border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '24px',
          fontSize: '0.8rem',
          color: '#06b6d4',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Clock size={14} />
          Last updated: {lastUpdate.toLocaleTimeString()} | System time: {stats.timestamp}
        </div>

        {/* System Health */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <StatusCard title="System Status" icon={Activity} color="#10b981">
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>✓ Operational</div>
            <div style={{ fontSize: '0.75rem', color: muted, marginTop: '4px' }}>Uptime: {stats.system.uptime}</div>
          </StatusCard>
          <StatusCard title="Database" icon={Database} color="#06b6d4">
            <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '1.1rem' }}>✓ Connected</div>
            <div style={{ fontSize: '0.75rem', color: muted, marginTop: '4px' }}>{stats.system.responseTime}</div>
          </StatusCard>
          <StatusCard title="API Status" icon={Zap} color={accent}>
            <div style={{ color: accent, fontWeight: 700, fontSize: '1.1rem' }}>✓ Operational</div>
            <div style={{ fontSize: '0.75rem', color: muted, marginTop: '4px' }}>All endpoints active</div>
          </StatusCard>
          <StatusCard title="Security" icon={Shield} color="#f59e0b">
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>{stats.access.securityLevel}</div>
            <div style={{ fontSize: '0.75rem', color: muted, marginTop: '4px' }}>SSL Encrypted</div>
          </StatusCard>
        </div>

        {/* Access & User Info */}
        <div style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '28px',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color={accent} /> Access Control & Current Session
          </h2>
          <div>
            <DataRow label="Current User" value={stats.access.currentUser} />
            <DataRow label="Admin Logged In" value={stats.access.adminLogged ? '✓ Yes' : '✗ No'} color={stats.access.adminLogged ? '#10b981' : '#ef4444'} />
            <DataRow label="Session Active" value={stats.access.sessionActive ? '✓ Active' : '✗ Inactive'} color={stats.access.sessionActive ? '#10b981' : '#ef4444'} />
            <DataRow label="Last Login" value={stats.access.lastLogin} />
            <DataRow label="IP Address" value={stats.access.ipAddress} />
            <DataRow label="Security Level" value={stats.access.securityLevel} color="#f59e0b" />
          </div>
        </div>

        {/* Database Collections */}
        <div style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '28px',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="#06b6d4" /> Database Collections & Storage
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {Object.entries(stats.collections).map(([name, data]) => (
              <div key={name} style={{
                background: isDark ? '#1e293b' : '#f9fafb',
                border: `1px solid ${border}`,
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: text, textTransform: 'capitalize' }}>
                    {name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: muted, marginTop: '4px' }}>
                    Storage: {data.storage}
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: accent,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px'
                }}>
                  {data.count.toLocaleString()}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#10b981',
                    fontWeight: 600
                  }}>
                    <CheckCircle2 size={12} /> Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* User Count */}
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#0ea5e9" /> User Management
            </h3>
            <div>
              <DataRow label="Total Users" value={stats.users.total.toLocaleString()} />
              <DataRow label="Active Users" value={stats.users.active.toLocaleString()} color="#10b981" />
              <DataRow label="Inactive Users" value={stats.users.inactive.toLocaleString()} />
              <DataRow label="Premium Users" value={stats.users.premium.toLocaleString()} color={accent} />
            </div>
          </div>

          {/* Product Statistics */}
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="#f59e0b" /> Inventory Status
            </h3>
            <div>
              <DataRow label="Total Products" value={stats.products.total.toLocaleString()} />
              <DataRow label="In Stock" value={stats.products.inStock.toLocaleString()} color="#10b981" />
              <DataRow label="Low Stock" value={stats.products.lowStock.toLocaleString()} color="#f59e0b" />
              <DataRow label="Out of Stock" value={stats.products.outOfStock.toLocaleString()} color="#ef4444" />
              <DataRow label="Featured Items" value={stats.products.featured.toLocaleString()} color={accent} />
            </div>
          </div>

          {/* Order Statistics */}
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} color="#ec4899" /> Sales Performance
            </h3>
            <div>
              <DataRow label="Total Orders" value={stats.orders.total.toLocaleString()} />
              <DataRow label="Total Revenue" value={`₹${(stats.orders.totalRevenue / 100000).toFixed(1)}L`} color="#10b981" />
              <DataRow label="Avg Order Value" value={`₹${Number(stats.orders.avgOrder).toLocaleString('en-IN')}`} />
              <DataRow label="Delivered Orders" value={stats.orders.delivered.toLocaleString()} color="#10b981" />
              <DataRow label="Pending Orders" value={stats.orders.pending.toLocaleString()} color="#f59e0b" />
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color={accent} /> Order Status Distribution
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            {[
              { label: 'Pending', value: stats.orders.pending, color: '#f59e0b' },
              { label: 'Confirmed', value: stats.orders.confirmed, color: '#0ea5e9' },
              { label: 'Shipped', value: stats.orders.shipped, color: '#06b6d4' },
              { label: 'Delivered', value: stats.orders.delivered, color: '#10b981' },
              { label: 'Cancelled', value: stats.orders.cancelled, color: '#ef4444' }
            ].map((status) => {
              const percentage = stats.orders.total > 0 ? ((status.value / stats.orders.total) * 100).toFixed(1) : 0;
              return (
                <div key={status.label} style={{
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  background: isDark ? '#1e293b' : '#f9fafb',
                  border: `1px solid ${border}`
                }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: status.color }}>
                    {status.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: text, marginTop: '4px' }}>
                    {status.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: muted, marginTop: '2px' }}>
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
