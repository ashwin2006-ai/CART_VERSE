import React, { useState, useEffect } from 'react';
import { Eye, Filter, Search, Download } from 'lucide-react';

export const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      amount: 4599,
      status: 'pending',
      date: '2024-01-15',
      items: 3
    },
    {
      id: 'ORD-002',
      customer: 'Priya Singh',
      email: 'priya@example.com',
      amount: 8999,
      status: 'processing',
      date: '2024-01-14',
      items: 2
    },
    {
      id: 'ORD-003',
      customer: 'Amit Patel',
      email: 'amit@example.com',
      amount: 2499,
      status: 'shipped',
      date: '2024-01-13',
      items: 1
    },
    {
      id: 'ORD-004',
      customer: 'Neha Sharma',
      email: 'neha@example.com',
      amount: 6799,
      status: 'delivered',
      date: '2024-01-12',
      items: 4
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
    processing: { bg: '#dbeafe', text: '#0c4a6e', label: 'Processing' },
    shipped: { bg: '#e9d5ff', text: '#6b21a8', label: 'Shipped' },
    delivered: { bg: '#dcfce7', text: '#166534', label: 'Delivered' },
    cancelled: { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled' }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>
          Order Management
        </h2>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 0' }}>
          {filteredOrders.length} orders found
        </p>
      </div>

      {/* Filters & Search */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#fff',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              fontFamily: 'inherit'
            }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            background: '#fff',
            fontSize: '13px',
            fontFamily: 'inherit',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusInfo = statusColors[order.status] || statusColors.pending;
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb', }}>
                    <td style={{ padding: '12px', color: '#6366f1', fontWeight: '600' }}>{order.id}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ color: '#111827', fontWeight: '500' }}>{order.customer}</div>
                      <div style={{ color: '#9ca3af', fontSize: '12px' }}>{order.email}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#111827', fontWeight: '600' }}>₹{order.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          border: `2px solid ${statusInfo.bg}`,
                          background: statusInfo.bg,
                          color: statusInfo.text,
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        {Object.entries(statusColors).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '12px', color: '#9ca3af', fontSize: '12px' }}>
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#6366f1',
                          fontSize: '18px'
                        }}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>
              Order Details - {selectedOrder.id}
            </h3>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#9ca3af'
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, marginBottom: '4px' }}>Customer</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                {selectedOrder.customer}
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0' }}>
                {selectedOrder.email}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, marginBottom: '4px' }}>Order Amount</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                ₹{selectedOrder.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, marginBottom: '4px' }}>Items</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                {selectedOrder.items} product{selectedOrder.items !== 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, marginBottom: '4px' }}>Order Date</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                {new Date(selectedOrder.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
