import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, RefreshCw, Search } from 'lucide-react';

export const AdminInventoryStock = ({ products, isDark }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, low, out, high

  const bg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockItems = products.filter(p => p.stock === 0);
  const highStockItems = products.filter(p => p.stock > 20);
  const normalStockItems = products.filter(p => p.stock > 5 && p.stock <= 20);

  let filtered = products;
  if (filterBy === 'low') filtered = lowStockItems;
  else if (filterBy === 'out') filtered = outOfStockItems;
  else if (filterBy === 'high') filtered = highStockItems;

  const searched = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

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
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Total Stock Units</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: text }}>{totalStock.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '8px', fontWeight: 600 }}>
            ✓ Inventory tracked
          </div>
        </div>
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Stock Value</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: text }}>₹{(totalValue / 100000).toFixed(1)}L</div>
          <div style={{ fontSize: '0.75rem', color: accent, marginTop: '8px', fontWeight: 600 }}>
            💰 Total value
          </div>
        </div>
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Low Stock Items</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b' }}>{lowStockItems.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '8px', fontWeight: 600 }}>
            ⚠️ Needs restock soon
          </div>
        </div>
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Out of Stock</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444' }}>{outOfStockItems.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '8px', fontWeight: 600 }}>
            ❌ Requires action
          </div>
        </div>
      </div>

      {/* Search & Filter */}
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
        <div style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', background: isDark ? '#1e293b' : '#f3f4f6', borderRadius: '8px', padding: '0 12px' }}>
          <Search size={18} style={{ color: muted }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: '10px 12px',
              fontSize: '0.9rem',
              color: text,
              outline: 'none'
            }}
          />
        </div>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          style={{
            padding: '10px 12px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            border: `1px solid ${border}`,
            borderRadius: '8px',
            color: text,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Stock</option>
          <option value="high">High Stock ({highStockItems.length})</option>
          <option value="low">Low Stock ({lowStockItems.length})</option>
          <option value="out">Out of Stock ({outOfStockItems.length})</option>
        </select>
      </div>

      {/* Stock Table */}
      <div style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr style={{ background: isDark ? '#1e293b' : '#f9fafb', borderBottom: `1px solid ${border}` }}>
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Product</th>
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Stock Level</th>
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Unit Price</th>
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Total Value</th>
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {searched.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: muted }}>
                  No inventory items found
                </td>
              </tr>
            ) : (
              searched.map(product => {
                const value = product.price * product.stock;
                let status = 'Normal';
                let statusColor = '#10b981';
                let statusBg = '#d1fae5';

                if (product.stock === 0) {
                  status = 'Out of Stock';
                  statusColor = '#991b1b';
                  statusBg = '#fee2e2';
                } else if (product.stock > 0 && product.stock <= 5) {
                  status = 'Low Stock';
                  statusColor = '#92400e';
                  statusBg = '#fef3c7';
                } else if (product.stock > 20) {
                  status = 'Healthy';
                  statusColor = '#065f46';
                  statusBg = '#d1fae5';
                }

                return (
                  <tr key={product.id} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '16px', color: text }}>
                      <div style={{ fontWeight: 700 }}>{product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: muted, marginTop: '4px' }}>{product.category}</div>
                    </td>
                    <td style={{ padding: '16px', color: text }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{product.stock}</div>
                      <div style={{ fontSize: '0.75rem', color: muted }}>units</div>
                    </td>
                    <td style={{ padding: '16px', color: text, fontWeight: 700 }}>₹{product.price}</td>
                    <td style={{ padding: '16px', color: text, fontWeight: 700 }}>₹{value.toLocaleString()}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: statusBg,
                        color: statusColor
                      }}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
