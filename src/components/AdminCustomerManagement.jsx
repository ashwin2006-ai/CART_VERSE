import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, ShoppingCart, User } from 'lucide-react';
import apiClient from '../utils/apiClient';

export const AdminCustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/auth/users');
      setCustomers(response.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>
          Customer Management
        </h2>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 0' }}>
          {filteredCustomers.length} customers found
        </p>
      </div>

      {/* Search Bar */}
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
          placeholder="Search by name or email..."
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

      {/* Customers Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          Loading customers...
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          No customers found
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {customer.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '2px'
                  }}>
                    {customer.name}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Mail size={12} />
                    {customer.email}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div>
                  <p style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    margin: 0,
                    marginBottom: '4px',
                    fontWeight: '600'
                  }}>
                    Tier
                  </p>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6366f1',
                    margin: 0
                  }}>
                    {customer.tier || 'Standard'}
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    margin: 0,
                    marginBottom: '4px',
                    fontWeight: '600'
                  }}>
                    Reward Points
                  </p>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#10b981',
                    margin: 0
                  }}>
                    {customer.rewardPoints || 0}
                  </p>
                </div>
              </div>

              {customer.phone && (
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  margin: '8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Phone size={12} />
                  {customer.phone}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '28px',
                fontWeight: 'bold'
              }}>
                {selectedCustomer.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>
                  {selectedCustomer.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 0' }}>
                  Customer ID: {selectedCustomer.id}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                color: '#9ca3af'
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, marginBottom: '8px', fontWeight: '600' }}>
                Contact Information
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#111827' }}>
                  <Mail size={16} />
                  {selectedCustomer.email}
                </div>
                {selectedCustomer.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#111827' }}>
                    <Phone size={16} />
                    {selectedCustomer.phone}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, marginBottom: '8px', fontWeight: '600' }}>
                Account Information
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#9ca3af' }}>Tier:</span>
                  <span style={{ color: '#111827', marginLeft: '8px', fontWeight: '600' }}>
                    {selectedCustomer.tier || 'Standard'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af' }}>Reward Points:</span>
                  <span style={{ color: '#10b981', marginLeft: '8px', fontWeight: '600' }}>
                    {selectedCustomer.rewardPoints || 0}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af' }}>Joined:</span>
                  <span style={{ color: '#111827', marginLeft: '8px', fontWeight: '600' }}>
                    {selectedCustomer.createdAt 
                      ? new Date(selectedCustomer.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, marginBottom: '8px', fontWeight: '600' }}>
                Activity
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={16} color="#6366f1" />
                  <span style={{ color: '#111827' }}>Active Customer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="#6366f1" />
                  <span style={{ color: '#111827' }}>Profile Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
