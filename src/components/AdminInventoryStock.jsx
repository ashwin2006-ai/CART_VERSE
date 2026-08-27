import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, RefreshCw, Search, Package, AlertCircle } from 'lucide-react';

export const AdminInventoryStock = ({ products, isDark }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, low, out, high

  const bg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  const lowStockItems = (products || []).filter(p => (p?.stock || 0) > 0 && (p?.stock || 0) <= 5);
  const outOfStockItems = (products || []).filter(p => (p?.stock || 0) === 0);
  const highStockItems = (products || []).filter(p => (p?.stock || 0) > 20);
  const normalStockItems = (products || []).filter(p => (p?.stock || 0) > 5 && (p?.stock || 0) <= 20);

  let filtered = products || [];
  if (filterBy === 'low') filtered = lowStockItems;
  else if (filterBy === 'out') filtered = outOfStockItems;
  else if (filterBy === 'high') filtered = highStockItems;

  const searched = filtered.filter(p => (p?.name || '').toLowerCase().includes(searchQuery.toLowerCase()));

  const totalStock = (products || []).reduce((sum, p) => sum + (p?.stock || 0), 0);
  const totalValue = (products || []).reduce((sum, p) => sum + ((p?.price || 0) * (p?.stock || 0)), 0);

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
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: text }}>{(totalStock || 0).toLocaleString()}</div>
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
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: text }}>₹{((totalValue || 0) / 100000).toFixed(1)}L</div>
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
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b' }}>{(lowStockItems?.length || 0)}</div>
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
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444' }}>{(outOfStockItems?.length || 0)}</div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '8px', fontWeight: 600 }}>
            ❌ Urgent action needed
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px' }}>
          <Search size={18} style={{ color: muted }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '8px',
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
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${border}`,
            background: bg,
            color: text,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <option value="all">All Items ({(products || []).length})</option>
          <option value="high">High Stock ({highStockItems.length})</option>
          <option value="normal">Normal Stock ({normalStockItems.length})</option>
          <option value="low">Low Stock ({lowStockItems.length})</option>
          <option value="out">Out of Stock ({outOfStockItems.length})</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '12px',
        overflow: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: isDark ? '#1e293b' : '#f9fafb', borderBottom: `1px solid ${border}` }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 800, color: text }}>Product Name</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 800, color: text }}>Current Stock</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 800, color: text }}>Unit Price</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 800, color: text }}>Total Value</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 800, color: text }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {searched.length > 0 ? searched.map((p, idx) => {
              const stock = p?.stock || 0;
              let status = '✓ Optimal';
              let statusColor = '#10b981';
              if (stock === 0) { status = '✗ Out'; statusColor = '#ef4444'; }
              else if (stock <= 5) { status = '⚠ Low'; statusColor = '#f59e0b'; }
              
              return (
                <tr key={idx} style={{ borderBottom: `1px solid ${border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', color: text, fontWeight: 600 }}>{p?.name || 'Unknown'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: text, fontWeight: 800 }}>{stock}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: text }}>₹{(p?.price || 0).toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>₹{((p?.price || 0) * stock).toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: `${statusColor}20`,
                      color: statusColor,
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: muted }}>
                  <Package size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <div>No products found</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: isDark ? '#1e293b' : '#f0f9ff',
        border: `1px solid ${border}`,
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '0.9rem', color: muted }}>
          Showing <strong style={{ color: text }}>{searched.length}</strong> of <strong style={{ color: text }}>{(products || []).length}</strong> items
        </div>
      </div>
    </div>
  );
};

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
