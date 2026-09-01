import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Calendar, Download, Filter, Package, ShoppingCart, DollarSign } from 'lucide-react';

export const AdminSalesAnalytics = ({ orders = [], products = [], categories = [], theme = 'light' }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const isDark = theme === 'dark';
  const bg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  // Calculate analytics
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o?.total || 0), 0);
  const totalOrders = (orders || []).length;
  const avgOrderValue = totalOrders > 0 ? ((totalRevenue / totalOrders) || 0).toFixed(2) : 0;
  const topProduct = (products || []).reduce((max, p) => !max || ((p?.rating || 0) * (p?.stock || 0)) > ((max?.rating || 0) * (max?.stock || 0)) ? p : max, null);
  
  // Category breakdown with safe access
  const categoryRevenue = {};
  (products || []).forEach(p => {
    const cat = p?.category || 'uncategorized';
    if (!categoryRevenue[cat]) categoryRevenue[cat] = { count: 0, revenue: 0 };
    categoryRevenue[cat].count += 1;
    categoryRevenue[cat].revenue += (p?.price || 0) * (p?.stock || 0);
  });

  const sortedCategories = Object.entries(categoryRevenue)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => (b?.revenue || 0) - (a?.revenue || 0));

  // Top selling products - calculate from orders instead of random
  const productSales = {};
  (orders || []).forEach(order => {
    (order.items || []).forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = { count: 0, revenue: 0, product: item };
      }
      productSales[item.id].count += item.quantity || 1;
      productSales[item.id].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([id, data]) => ({
      id,
      name: data.product.name || 'Unknown Product',
      salesCount: data.count,
      revenue: data.revenue,
      price: data.product.price
    }))
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5);

  return (
    <div>
      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${accent}15 0%, ${accent}05 100%)`,
          border: `2px solid ${accent}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Total Revenue</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: text }}>₹{(totalRevenue / 100000).toFixed(1)}L</div>
          <div style={{ fontSize: '0.75rem', color: accent, marginTop: '8px', fontWeight: 600 }}>
            📈 All-time revenue
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #10b98115 0%, #10b98105 100%)',
          border: '2px solid #10b981',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Total Orders</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: text }}>{totalOrders}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '8px', fontWeight: 600 }}>
            ✓ Completed orders
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b15 0%, #f59e0b05 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Avg Order Value</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: text }}>₹{avgOrderValue.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '8px', fontWeight: 600 }}>
            💰 Average value
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #06b6d415 0%, #06b6d405 100%)',
          border: '2px solid #06b6d4',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Total Products</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: text }}>{products.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '8px', fontWeight: 600 }}>
            📦 Active SKUs
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '10px 12px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            border: `1px solid ${border}`,
            borderRadius: '8px',
            color: text,
            cursor: 'pointer'
          }}
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '10px 12px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            border: `1px solid ${border}`,
            borderRadius: '8px',
            color: text,
            cursor: 'pointer'
          }}
        >
          <option value="all">All Categories</option>
          {Object.keys(categoryRevenue).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: accent,
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 700,
          marginLeft: 'auto'
        }}>
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Category Breakdown */}
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: text, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} /> Revenue by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedCategories.slice(0, 5).map((cat, idx) => {
              const maxRevenue = Math.max(...sortedCategories.map(c => c.revenue));
              const percentage = (cat.revenue / maxRevenue) * 100;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ color: text, fontWeight: 600 }}>{cat.name}</span>
                    <span style={{ color: muted }}>₹{(cat.revenue / 100000).toFixed(1)}L</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: isDark ? '#1e293b' : '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: accent,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: text, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} /> Top Performing Products
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topProducts.slice(0, 5).map((prod, idx) => (
              <div key={idx} style={{
                background: isDark ? '#1e293b' : '#f9fafb',
                padding: '12px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: text, fontWeight: 700, fontSize: '0.9rem' }}>{prod.name}</div>
                  <div style={{ color: muted, fontSize: '0.8rem', marginTop: '4px' }}>{prod.salesCount} sales</div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 700, color: accent }}>₹{(prod.revenue / 1000).toFixed(1)}K</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: text, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} /> Category Performance
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{ background: isDark ? '#1e293b' : '#f9fafb', borderBottom: `1px solid ${border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Products</th>
                <th style={{ padding: '12px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Revenue</th>
                <th style={{ padding: '12px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.map((cat, idx) => {
                const percentage = ((cat.revenue / sortedCategories.reduce((sum, c) => sum + c.revenue, 0)) * 100).toFixed(1);
                return (
                  <tr key={idx} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '12px', color: text, fontWeight: 700 }}>{cat.name}</td>
                    <td style={{ padding: '12px', color: muted }}>{cat.count} items</td>
                    <td style={{ padding: '12px', color: text, fontWeight: 700 }}>₹{(cat.revenue / 100000).toFixed(1)}L</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: accent, fontWeight: 700 }}>{percentage}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
