"""Product Management section for Admin Panel"""
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, TrendingUp, BarChart3 } from 'lucide-react';

export const AdminProductManagement = ({ products, isDark, onAdd, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const bg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div>
      {/* Stats Bar */}
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
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Total Products</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: text }}>{products.length}</div>
          <div style={{ fontSize: '0.75rem', color: accent, marginTop: '8px', fontWeight: 600 }}>
            📦 {filteredProducts.length} displayed
          </div>
        </div>
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Inventory Value</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: text }}>₹{(totalValue / 100000).toFixed(1)}L</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '8px', fontWeight: 600 }}>
            💰 Total stock value
          </div>
        </div>
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '8px' }}>Low Stock Items</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: text }}>
            {products.filter(p => p.stock > 0 && p.stock <= 5).length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '8px', fontWeight: 600 }}>
            ⚠️ Needs restock
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
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '10px 12px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            border: `1px solid ${border}`,
            borderRadius: '8px',
            color: text,
            fontSize: '0.9rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={onAdd}
          style={{
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
            fontSize: '0.9rem'
          }}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Products Table */}
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
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Price</th>
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Stock</th>
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Category</th>
              <th style={{ padding: '16px', textAlign: 'left', color: muted, fontWeight: 700, fontSize: '0.85rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: muted }}>
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: '16px', color: text }}>
                    <div style={{ fontWeight: 700 }}>{product.name}</div>
                    <div style={{ fontSize: '0.8rem', color: muted, marginTop: '4px' }}>ID: {product.id}</div>
                  </td>
                  <td style={{ padding: '16px', color: text, fontWeight: 700 }}>₹{product.price}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: product.stock > 10 ? '#d1fae5' : product.stock > 0 ? '#fef3c7' : '#fee2e2',
                      color: product.stock > 10 ? '#065f46' : product.stock > 0 ? '#92400e' : '#991b1b'
                    }}>
                      {product.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: text }}>{product.category}</td>
                  <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onEdit(product)}
                      style={{
                        padding: '8px 12px',
                        background: accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem'
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      style={{
                        padding: '8px 12px',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
