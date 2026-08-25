import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import {
  LayoutDashboard, TrendingUp, Package, Users, ShoppingBag, DollarSign,
  AlertTriangle, Eye, ArrowUpRight, ArrowDownRight, Calendar, Filter,
  BarChart3, PieChart, LineChart, Activity, Zap, RefreshCw, Download
} from 'lucide-react';

export const AdminDashboard = () => {
  const { products, orders, users, cart, theme } = useShop();
  const [timeRange, setTimeRange] = useState('7days'); // '7days', '30days', '90days', 'all'
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const isDark = theme === 'dark';
  const bg = isDark ? '#0b0f1a' : '#f7f8fa';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  // KPI Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users?.length || 0;
  const activeCartItems = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockItems = products.filter(p => p.stock <= 0).length;
  
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0';
  const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : '0';

  // Recent Orders
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 5);
  }, [orders]);

  // Top Products
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);
  }, [products]);

  // Top Categories
  const categoryStats = useMemo(() => {
    const stats = {};
    products.forEach(p => {
      const cat = p.category || 'uncategorized';
      stats[cat] = (stats[cat] || 0) + (p.sold || 1);
    });
    return Object.entries(stats)
      .map(([cat, count]) => ({ category: cat, count, percentage: ((count / products.length) * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [products]);

  const KPICard = ({ title, value, icon: Icon, change, changeType = 'up' }) => (
    <div style={{
      background: cardBg,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: text, marginBottom: '8px' }}>
          {value}
        </div>
        {change && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: changeType === 'up' ? '#10b981' : '#ef4444'
          }}>
            {changeType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}% this month
          </div>
        )}
      </div>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        background: `${accent}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: accent,
        flexShrink: 0,
      }}>
        <Icon size={24} />
      </div>
    </div>
  );

  const DataTable = ({ title, headers, rows, actions }) => (
    <div style={{
      background: cardBg,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ padding: '16px', borderBottom: `1px solid ${border}` }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: 0 }}>
          {title}
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
        }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}`, background: isDark ? '#1e293b' : '#f9fafb' }}>
              {headers.map((h, i) => (
                <th key={i} style={{
                  padding: '12px 14px',
                  textAlign: 'left',
                  fontWeight: 700,
                  color: muted,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{
                borderBottom: `1px solid ${border}`,
                '&:hover': { background: isDark ? '#1e293b20' : '#f9fafb' }
              }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: '12px 14px',
                    color: text,
                    fontWeight: j === 0 ? 600 : 400,
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {actions && (
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${border}`, textAlign: 'right' }}>
          {actions}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '24px', background: bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: text, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LayoutDashboard size={28} color={accent} /> Admin Dashboard
            </h1>
            <p style={{ fontSize: '0.85rem', color: muted, margin: '4px 0 0', fontWeight: 400 }}>
              Overall website performance & management
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['7days', '30days', '90days', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: `1px solid ${border}`,
                  background: timeRange === range ? accent : 'transparent',
                  color: timeRange === range ? '#fff' : text,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {range === '7days' ? 'Week' : range === '30days' ? 'Month' : range === '90days' ? 'Quarter' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}>
          <KPICard title="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} icon={DollarSign} change="12.5" />
          <KPICard title="Total Orders" value={totalOrders.toLocaleString()} icon={ShoppingBag} change="8.2" />
          <KPICard title="Total Products" value={totalProducts.toLocaleString()} icon={Package} change="5.1" />
          <KPICard title="Registered Users" value={totalUsers.toLocaleString()} icon={Users} change="15.3" />
        </div>

        {/* Secondary Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}>
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, textTransform: 'uppercase', marginBottom: '8px' }}>
              Avg Order Value
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: text }}>
              ₹{avgOrderValue}
            </div>
          </div>
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, textTransform: 'uppercase', marginBottom: '8px' }}>
              Conversion Rate
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: text }}>
              {conversionRate}%
            </div>
          </div>
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, textTransform: 'uppercase', marginBottom: '8px' }}>
              Cart Items (Active)
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: text }}>
              {activeCartItems}
            </div>
          </div>
        </div>

        {/* Alerts & Warnings */}
        {(lowStockItems > 0 || outOfStockItems > 0) && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}>
            {lowStockItems > 0 && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ color: '#f59e0b', flexShrink: 0 }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', marginBottom: '2px' }}>
                    Low Stock Alert
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#b45309' }}>
                    {lowStockItems} product(s) running low
                  </div>
                </div>
              </div>
            )}
            {outOfStockItems > 0 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ color: '#ef4444', flexShrink: 0 }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', marginBottom: '2px' }}>
                    Out of Stock
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
                    {outOfStockItems} product(s) unavailable
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Tables */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '28px',
          '@media (max-width: 1024px)': {
            gridTemplateColumns: '1fr',
          }
        }}>
          {/* Recent Orders */}
          <DataTable
            title="Recent Orders"
            headers={['Order ID', 'Customer', 'Amount', 'Status']}
            rows={recentOrders.map(o => [
              `#${o.id?.slice(-6) || 'N/A'}`,
              o.customerName || 'Guest',
              `₹${(o.total || 0).toLocaleString()}`,
              <span style={{
                background: o.status === 'Confirmed' ? '#10b98120' : o.status === 'Shipped' ? '#0ea5e920' : '#f5941120',
                color: o.status === 'Confirmed' ? '#10b981' : o.status === 'Shipped' ? '#0ea5e9' : '#f59e0b',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {o.status || 'Pending'}
              </span>,
            ])}
          />

          {/* Top Products */}
          <DataTable
            title="Top Selling Products"
            headers={['Product Name', 'Sales', 'Stock', 'Price']}
            rows={topProducts.map(p => [
              p.name?.substring(0, 20) + (p.name?.length > 20 ? '...' : ''),
              p.sold || 0,
              <span style={{ color: p.stock <= 5 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                {p.stock}
              </span>,
              `₹${p.price?.toLocaleString()}`,
            ])}
          />
        </div>

        {/* Category Distribution */}
        <div style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color={accent} /> Category Distribution
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {categoryStats.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: text, textTransform: 'capitalize' }}>
                  {cat.category}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '100px',
                    height: '6px',
                    background: isDark ? '#1e293b' : '#f3f4f6',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${cat.percentage}%`,
                      background: accent,
                    }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: muted, minWidth: '35px' }}>
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
