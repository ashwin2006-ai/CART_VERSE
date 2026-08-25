import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  BarChart3,
  RotateCcw,
  ShieldCheck,
  LogOut,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  DollarSign,
  Truck,
  Eye,
  Star,
  Lock,
  KeyRound,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  CheckCircle2,
  Calendar,
  CreditCard
} from 'lucide-react';

export const AdminPanel = () => {
  const {
    products,
    orders,
    coupons,
    categories,
    reviews,
    user,
    theme,
    toggleTheme,
    adminAuth,
    adminLogout,
    changeAdminPassword,
    updateAdminProfile,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateInventory,
    adminAddCategory,
    adminDeleteCategory,
    adminUpdateOrderStatus,
    adminProcessReturn,
    adminDeleteReview,
    adminReplyReview,
    adminAddCoupon,
    adminToggleCoupon,
    adminDeleteCoupon,
    setCurrentView,
    flipkartProducts,
    flipkartConfig,
    syncFlipkartCategory,
    updateFlipkartKeys
  } = useShop();

  // Navigation Subsections
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Search & Filter within Admin tables
  const [adminSearch, setAdminSearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('all'); // 'all', 'low', 'out'
  const [orderFilter, setOrderFilter] = useState('all');

  // Modals inside Admin
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'electronics',
    price: '',
    originalPrice: '',
    discount: 0,
    stock: 20,
    description: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    featured: false,
    bestSeller: false,
    isNew: true
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'Sparkles' });

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percent',
    discount: 15,
    minSpend: 50,
    description: '15% discount for members',
    active: true
  });

  const [replyingReview, setReplyingReview] = useState(null); // { prodId, revId }
  const [replyText, setReplyText] = useState('');

  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [profileForm, setProfileForm] = useState({
    name: adminAuth.adminUser.name,
    email: adminAuth.adminUser.email
  });

  // Flipkart API Hub States
  const [fkSyncCategory, setFkSyncCategory] = useState('all');
  const [fkSyncKeyword, setFkSyncKeyword] = useState('');
  const [isFkSyncing, setIsFkSyncing] = useState(false);
  const [fkTrackingId, setFkTrackingId] = useState('cartvers01');
  const [fkToken, setFkToken] = useState('fk_aff_tok_998a4e12e345b801a6bc');

  // KPI Computations
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockItems = products.filter(p => p.stock <= 0);
  const pendingReturns = orders.filter(o => o.returnRequested && !o.returnStatus?.includes('Approved') && !o.returnStatus?.includes('Rejected'));
  const allReviewsList = Object.entries(reviews).flatMap(([prodId, revs]) => {
    const prod = products.find(p => p.id === prodId);
    return revs.map(r => ({ ...r, productId: prodId, productName: prod ? prod.name : prodId }));
  });

  // Handlers
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        category: prod.category,
        price: prod.price,
        originalPrice: prod.originalPrice || '',
        discount: prod.discount || 0,
        stock: prod.stock,
        description: prod.description || '',
        images: prod.images || [],
        featured: !!prod.featured,
        bestSeller: !!prod.bestSeller,
        isNew: !!prod.isNew
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: 'electronics',
        price: '',
        originalPrice: '',
        discount: 0,
        stock: 20,
        description: '',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        bestSeller: false,
        isNew: true
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
      discount: Number(productForm.discount) || 0,
      stock: Number(productForm.stock) || 0
    };

    if (editingProduct) {
      adminUpdateProduct(editingProduct.id, payload);
    } else {
      adminAddProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;
    adminAddCategory(categoryForm);
    setIsCategoryModalOpen(false);
    setCategoryForm({ name: '', icon: 'Sparkles' });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    adminAddCoupon({
      ...couponForm,
      code: couponForm.code.trim().toUpperCase(),
      discount: Number(couponForm.discount),
      minSpend: Number(couponForm.minSpend) || 0
    });
    setIsCouponModalOpen(false);
    setCouponForm({
      code: '',
      type: 'percent',
      discount: 15,
      minSpend: 50,
      description: '',
      active: true
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert('New password and confirmation do not match.');
      return;
    }
    const ok = changeAdminPassword(passwordForm.current, passwordForm.newPass);
    if (ok) setPasswordForm({ current: '', newPass: '', confirm: '' });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateAdminProfile(profileForm);
  };

  const handleSendReply = (prodId, revId) => {
    if (!replyText.trim()) return;
    adminReplyReview(prodId, revId, replyText.trim());
    setReplyingReview(null);
    setReplyText('');
  };

  // Nav Items definition
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Product Management', icon: Package, badge: products.length },
    { id: 'categories', label: 'Category Management', icon: Layers, badge: categories.length },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes, badge: lowStockItems.length + outOfStockItems.length > 0 ? `${lowStockItems.length + outOfStockItems.length} alert` : null, badgeColor: 'rose' },
    { id: 'orders', label: 'Order Management', icon: ShoppingBag, badge: orders.length },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag, badge: coupons.length },
    { id: 'reviews', label: 'Reviews Management', icon: MessageSquare, badge: allReviewsList.length },
    { id: 'analytics', label: 'Sales & Analytics', icon: BarChart3 },
    { id: 'returns', label: 'Return & Refunds', icon: RotateCcw, badge: pendingReturns.length > 0 ? `${pendingReturns.length} pending` : null, badgeColor: 'gold' },
    { id: 'flipkart', label: 'Flipkart API Hub', icon: Zap, badge: 'API Active', badgeColor: 'emerald' },
    { id: 'security', label: 'Profile & Security', icon: ShieldCheck }
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-main)',
      color: 'var(--text-primary)'
    }}>
      {/* Standalone Admin Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? '76px' : '280px',
        background: 'var(--bg-card-solid)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'width var(--transition-smooth)',
        zIndex: 100
      }}>
        {/* Sidebar Header / Brand */}
        <div style={{
          padding: '20px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  CART<span className="gradient-text">VERSE</span> <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800 }}>ADMIN</span>
                </span>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Enterprise Suite
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '6px',
              background: 'var(--bg-surface)'
            }}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronRight size={16} style={{ transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--primary-gradient)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '0.86rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  position: 'relative'
                }}
                title={sidebarCollapsed ? item.label : undefined}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon size={18} style={{ flexShrink: 0, color: isSelected ? '#fff' : 'inherit' }} />
                {!sidebarCollapsed && (
                  <>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '10px',
                        background: item.badgeColor === 'rose' ? 'var(--accent-rose)' : item.badgeColor === 'gold' ? 'var(--accent-gold)' : isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-surface)',
                        color: '#fff'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info & Sign Out */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)'
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img
                src={adminAuth.adminUser.avatar}
                alt="admin"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {adminAuth.adminUser.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)' }}>
                  {adminAuth.adminUser.role}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={adminLogout}
            className="btn btn-outline btn-sm"
            style={{
              width: '100%',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--accent-rose)',
              borderColor: 'rgba(244, 63, 94, 0.3)'
            }}
            title="Terminate Admin Session"
          >
            <LogOut size={15} />
            {!sidebarCollapsed && <span>Sign Out Admin</span>}
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Admin Top Navbar */}
        <header style={{
          height: '70px',
          padding: '0 32px',
          background: 'var(--bg-card-solid)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          {/* Breadcrumb & Section Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Admin Workspace</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
              {activeTab}
            </span>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => {
                setCurrentView('store');
                window.location.hash = '';
              }}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px', fontSize: '0.8rem' }}
            >
              <ExternalLink size={14} /> View Storefront
            </button>

            <button
              onClick={toggleTheme}
              className="btn-icon btn-secondary"
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={16} style={{ color: '#fbbf24' }} /> : <Moon size={16} style={{ color: '#6366f1' }} />}
            </button>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Executive Business Dashboard</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Real-time telemetry of sales, fulfillment, customers, and inventory health.
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="glass-panel" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Gross Revenue</span>
                    <DollarSign size={18} style={{ color: 'var(--accent-emerald)' }} />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +24.8% growth this period
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Orders</span>
                    <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {totalOrders}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    100% processed without delay
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Active Catalog</span>
                    <Package size={18} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {totalProducts} Items
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Across {categories.length - 1} categories
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Inventory Attention</span>
                    <AlertTriangle size={18} style={{ color: lowStockItems.length > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }} />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {lowStockItems.length + outOfStockItems.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '4px', fontWeight: 700 }}>
                    {lowStockItems.length} low stock, {outOfStockItems.length} out of stock
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Sales Graph & Recent Orders */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Revenue Graph */}
                <div className="glass-panel" style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Weekly Sales Performance</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Revenue aggregated daily</span>
                    </div>
                    <span className="badge badge-primary">Live Data</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '10px', gap: '12px' }}>
                    {[
                      { day: 'Mon', val: 420, h: '45%' },
                      { day: 'Tue', val: 680, h: '65%' },
                      { day: 'Wed', val: 510, h: '52%' },
                      { day: 'Thu', val: 920, h: '88%' },
                      { day: 'Fri', val: 1150, h: '100%' },
                      { day: 'Sat', val: 840, h: '78%' },
                      { day: 'Sun', val: 630, h: '60%' }
                    ].map((bar, idx) => (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>₹{bar.val}</span>
                        <div style={{
                          width: '100%',
                          maxWidth: '42px',
                          height: bar.h,
                          borderRadius: '6px 6px 0 0',
                          background: idx === 4 ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)'
                        }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders Pipeline Feed */}
                <div className="glass-panel" style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Recent Order Stream</h3>
                    <button onClick={() => setActiveTab('orders')} style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orders.slice(0, 4).map(o => (
                      <div
                        key={o.id}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-surface)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>#{o.id} • {o.shippingAddress.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.items.length} items • {o.paymentMethod}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{o.total.toLocaleString('en-IN')}</div>
                          <span className={o.status === 'Delivered' ? 'badge badge-emerald' : 'badge badge-primary'} style={{ fontSize: '0.68rem' }}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Product Catalog Management</h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Add, edit pricing, update product descriptions, images, and category classifications.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenProductModal(null)}
                  className="btn btn-primary"
                  style={{ gap: '8px' }}
                >
                  <Plus size={18} /> Add New Product
                </button>
              </div>

              {/* Product Table */}
              <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '16px' }}>Product</th>
                      <th style={{ padding: '16px' }}>Category</th>
                      <th style={{ padding: '16px' }}>Price / Discount</th>
                      <th style={{ padding: '16px' }}>Stock Units</th>
                      <th style={{ padding: '16px' }}>Tags</th>
                      <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ID: {prod.id}</div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <span className="badge badge-primary">{prod.category}</span>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800 }}>₹{prod.price.toLocaleString('en-IN')}</div>
                          {prod.discount > 0 && (
                            <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                              -{prod.discount}% off
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontWeight: 700,
                            color: prod.stock <= 0 ? 'var(--accent-rose)' : prod.stock <= 5 ? 'var(--accent-gold)' : 'var(--accent-emerald)'
                          }}>
                            {prod.stock} units
                          </span>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {prod.featured && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Featured</span>}
                            {prod.bestSeller && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Best Seller</span>}
                            {prod.isNew && <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>New</span>}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenProductModal(prod)}
                              className="btn-icon btn-secondary"
                              style={{ width: '34px', height: '34px' }}
                              title="Edit Product"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              onClick={() => adminDeleteProduct(prod.id)}
                              className="btn-icon btn-secondary"
                              style={{ width: '34px', height: '34px', color: 'var(--accent-rose)' }}
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. CATEGORY MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Category Management</h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Organize product classifications and navigation structures.
                  </p>
                </div>

                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="btn btn-primary"
                  style={{ gap: '8px' }}
                >
                  <Plus size={18} /> Add Category
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {categories.map((cat) => {
                  const productCount = cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length;

                  return (
                    <div
                      key={cat.id}
                      className="glass-panel"
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span className="badge badge-primary">{cat.id}</span>
                          {cat.id !== 'all' && (
                            <button
                              onClick={() => adminDeleteCategory(cat.id)}
                              style={{ color: 'var(--accent-rose)', cursor: 'pointer' }}
                              title="Delete Category"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>{cat.name}</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          Contains <strong>{productCount}</strong> live active products in storefront.
                        </p>
                      </div>

                      <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>Status: Active</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Published</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. INVENTORY & STOCK MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Inventory & Stock Control</h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Monitor fulfillment levels, prevent stockouts, and adjust live warehouse units.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'low', 'out'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setInventoryFilter(st)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: inventoryFilter === st ? 'var(--primary)' : 'var(--bg-surface)',
                        color: inventoryFilter === st ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {st === 'all' ? 'All Items' : st === 'low' ? 'Low Stock (<5)' : 'Out of Stock'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '16px' }}>Product</th>
                      <th style={{ padding: '16px' }}>Category</th>
                      <th style={{ padding: '16px' }}>Current Stock</th>
                      <th style={{ padding: '16px' }}>Status Indicator</th>
                      <th style={{ padding: '16px', textAlign: 'right' }}>Quick Adjust (+/-)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => {
                        if (inventoryFilter === 'low') return p.stock > 0 && p.stock <= 5;
                        if (inventoryFilter === 'out') return p.stock <= 0;
                        return true;
                      })
                      .map((prod) => (
                        <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={prod.images[0]} alt={prod.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div style={{ fontWeight: 800, maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.name}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <span className="badge badge-primary">{prod.category}</span>
                          </td>

                          <td style={{ padding: '14px 16px', fontWeight: 800, fontSize: '1rem' }}>
                            {prod.stock} units
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            {prod.stock <= 0 ? (
                              <span className="badge badge-rose">Out of Stock</span>
                            ) : prod.stock <= 5 ? (
                              <span className="badge badge-gold">Low Stock Warning</span>
                            ) : (
                              <span className="badge badge-emerald">Healthy Stock</span>
                            )}
                          </td>

                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => adminUpdateInventory(prod.id, Math.max(0, prod.stock - 5))}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                -5
                              </button>
                              <button
                                onClick={() => adminUpdateInventory(prod.id, Math.max(0, prod.stock - 1))}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                -1
                              </button>
                              <button
                                onClick={() => adminUpdateInventory(prod.id, prod.stock + 1)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                +1
                              </button>
                              <button
                                onClick={() => adminUpdateInventory(prod.id, prod.stock + 10)}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Customer Orders & Fulfillment</h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Update fulfillment stages, courier carriers, and tracking milestones in real time.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'confirmed', 'packed', 'shipped', 'delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        background: orderFilter === st ? 'var(--primary)' : 'var(--bg-surface)',
                        color: orderFilter === st ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '16px' }}>Order ID & Date</th>
                      <th style={{ padding: '16px' }}>Customer / Destination</th>
                      <th style={{ padding: '16px' }}>Items Summary</th>
                      <th style={{ padding: '16px' }}>Total Amount</th>
                      <th style={{ padding: '16px' }}>Status Progression</th>
                      <th style={{ padding: '16px', textAlign: 'right' }}>Advance State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => orderFilter === 'all' || o.status.toLowerCase() === orderFilter.toLowerCase())
                      .map((ord) => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary)' }}>#{ord.id}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{ord.date.split('T')[0]}</div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800 }}>{ord.shippingAddress.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ord.shippingAddress.city}, {ord.shippingAddress.state}</div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontSize: '0.82rem' }}>{ord.items.length} item(s)</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {ord.items.map(i => i.name).join(', ')}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px', fontWeight: 900, color: 'var(--text-primary)' }}>
                            ₹{ord.total.toLocaleString('en-IN')}
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{ord.paymentMethod}</div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <span className={
                              ord.status === 'Delivered' ? 'badge badge-emerald' : ord.status === 'Shipped' ? 'badge badge-primary' : 'badge badge-gold'
                            }>
                              {ord.status} (Stage {ord.statusStep}/5)
                            </span>
                          </td>

                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <select
                              value={ord.status}
                              onChange={(e) => {
                                const val = e.target.value;
                                let stepNum = 2;
                                if (val === 'Confirmed') stepNum = 2;
                                if (val === 'Packed') stepNum = 3;
                                if (val === 'Shipped') stepNum = 4;
                                if (val === 'Delivered') stepNum = 5;
                                adminUpdateOrderStatus(ord.id, val, stepNum);
                              }}
                              style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                background: 'var(--bg-surface)'
                              }}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. CUSTOMER MANAGEMENT */}
          {activeTab === 'customers' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Customer Directory & Accounts</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  View authenticated buyer profiles, lifetime spend, reward points, and order records.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <img src={user.avatar} alt={user.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user.name}</h3>
                      <span className="badge badge-gold">{user.tier}</span>
                      <span className="badge badge-emerald">Active Account</span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {user.email} • {user.phone} • Member since {user.memberSince}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Primary Address: {user.addresses[0]?.street}, {user.addresses[0]?.city}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', paddingLeft: '20px', borderLeft: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lifetime Spend ({orders.length} orders)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, marginTop: '2px' }}>
                      {user.rewardPoints} Loyalty Points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. COUPONS & OFFERS */}
          {activeTab === 'coupons' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Discount Codes & Promotion Engine</h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Configure promotional campaigns, percentage/fixed discounts, and minimum cart spends.
                  </p>
                </div>

                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="btn btn-primary"
                  style={{ gap: '8px' }}
                >
                  <Plus size={18} /> Create Promo Code
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      border: c.active ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                      opacity: c.active ? 1 : 0.65
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        {c.code}
                      </span>
                      <button
                        onClick={() => adminToggleCoupon(c.code)}
                        className={c.active ? 'badge badge-emerald' : 'badge badge-rose'}
                        style={{ cursor: 'pointer' }}
                      >
                        {c.active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      {c.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Min Spend: <strong>₹{c.minSpend}</strong></span>
                      <button
                        onClick={() => adminDeleteCoupon(c.code)}
                        style={{ color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px' }}
                        title="Delete coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. REVIEWS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Customer Reviews Moderation</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Monitor verified feedback, respond with merchant notes, and moderate customer sentiments.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allReviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="glass-panel"
                    style={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={rev.avatar} alt={rev.userName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{rev.userName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Reviewed on <strong>{rev.productName}</strong> • {rev.date}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} color={i < rev.rating ? '#f59e0b' : '#64748b'} />
                          ))}
                        </div>
                        <button
                          onClick={() => adminDeleteReview(rev.productId, rev.id)}
                          style={{ color: 'var(--accent-rose)', padding: '4px', cursor: 'pointer' }}
                          title="Delete Review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                      "{rev.comment}"
                    </p>

                    {rev.adminReply ? (
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-light)',
                        border: '1px solid var(--border-active)',
                        fontSize: '0.8rem',
                        color: 'var(--primary)'
                      }}>
                        <strong>Merchant Response:</strong> {rev.adminReply}
                      </div>
                    ) : (
                      replyingReview?.revId === rev.id ? (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Write an official merchant reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}
                          />
                          <button onClick={() => handleSendReply(rev.productId, rev.id)} className="btn btn-primary btn-sm">
                            Publish Reply
                          </button>
                          <button onClick={() => setReplyingReview(null)} className="btn btn-secondary btn-sm">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingReview({ prodId: rev.productId, revId: rev.id })}
                          style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                        >
                          + Reply as Official Store Manager
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. SALES & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Sales Analytics & Revenue Reports</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Detailed breakdown of transaction volumes, best-selling models, and revenue streams.
                </p>
              </div>

              {/* Best Selling Products Leaderboard */}
              <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
                  Best Selling Catalog Leaderboard
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products.slice(0, 5).map((p, idx) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', width: '20px' }}>
                          #{idx + 1}
                        </span>
                        <img src={p.images[0]} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.reviewCount} reviews • {p.rating}★</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, color: 'var(--accent-emerald)' }}>
                          ₹{(p.price * (idx + 3)).toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{idx + 3} units moved</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 10. RETURN & REFUND MANAGEMENT */}
          {activeTab === 'returns' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Customer Return & Refund Portal</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Review customer return claims, inspect declared reasons, and approve or reject doorstep refund pickups.
                </p>
              </div>

              {orders.filter(o => o.returnRequested).length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                  <CheckCircle2 size={48} style={{ color: 'var(--accent-emerald)', margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>All Return Queues are Clear!</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No active return claims awaiting merchant review.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.filter(o => o.returnRequested).map((ord) => (
                    <div key={ord.id} className="glass-panel" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>Order #{ord.id}</span>
                          <span className="badge badge-gold">{ord.returnStatus || 'Pending Review'}</span>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                          Refund: ₹{ord.total.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                          REASON SPECIFIED BY BUYER:
                        </div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                          "{ord.returnReason || 'No specific explanation provided'}"
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                          onClick={() => adminProcessReturn(ord.id, 'rejected', 'Inspection failed / return window expired')}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.4)' }}
                        >
                          Reject Claim
                        </button>
                        <button
                          onClick={() => adminProcessReturn(ord.id, 'approved', 'Refund verified and processed')}
                          className="btn btn-primary btn-sm"
                        >
                          Approve & Issue Doorstep Refund
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 11. FLIPKART API INTEGRATION HUB */}
          {activeTab === 'flipkart' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#2874f0' }}>🛍️ Flipkart</span> Affiliate & Catalog Engine
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Backend Proxy: Customer → Website → Backend → Flipkart API → MySQL Cache → Storefront
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href="https://affiliate.flipkart.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <span>Affiliate Portal</span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href="https://seller.flipkart.com/api-docs"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <span>Seller API Docs</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Status & KPI Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '28px'
              }}>
                <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    API Connection Status
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={20} /> CONNECTED
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Flipkart Affiliate API v1.0 Proxy Active
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #2874f0' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Active Tracking ID
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2874f0', marginTop: '4px' }}>
                    {flipkartConfig?.trackingId || 'cartvers01'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Embedded in all outbound buy links
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-gold)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    MySQL Cached Products
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '4px' }}>
                    {flipkartProducts ? flipkartProducts.length : 6} Live Deals
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Cached in `flipkart_products` table
                  </div>
                </div>
              </div>

              {/* Two Column Section: On-demand Sync & Credential Config */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px',
                marginBottom: '28px'
              }}>
                {/* On-Demand Catalog Sync Trigger */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} style={{ color: '#2874f0' }} /> Synchronize Flipkart Products
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Fetch latest prices, offers, and in-stock inventory directly from Flipkart's affiliate catalog.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Target Category</label>
                      <select
                        value={fkSyncCategory}
                        onChange={(e) => setFkSyncCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)' }}
                      >
                        <option value="all">All Flipkart Categories</option>
                        <option value="electronics">Mobiles, Laptops & Audio</option>
                        <option value="fashion">Fashion & Apparel</option>
                        <option value="footwear">Running & Sports Footwear</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Keyword Filter (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Samsung Mobile, Sony Headphones"
                        value={fkSyncKeyword}
                        onChange={(e) => setFkSyncKeyword(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <button
                      disabled={isFkSyncing}
                      onClick={async () => {
                        setIsFkSyncing(true);
                        await syncFlipkartCategory(fkSyncCategory, fkSyncKeyword);
                        setIsFkSyncing(false);
                      }}
                      className="btn btn-primary"
                      style={{ marginTop: '8px', background: 'linear-gradient(135deg, #2874f0 0%, #0c4a6e 100%)', borderColor: '#2874f0', gap: '8px' }}
                    >
                      {isFkSyncing ? (
                        <span>Syncing Flipkart API...</span>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Run Sync Pipeline Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* API Credentials Configuration */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={18} style={{ color: 'var(--accent-gold)' }} /> Backend API Credentials
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Stored securely on the backend. Never exposed to customer browser clients.
                  </p>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateFlipkartKeys(fkTrackingId, fkToken);
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Flipkart Affiliate Tracking ID</label>
                      <input
                        type="text"
                        value={fkTrackingId}
                        onChange={(e) => setFkTrackingId(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Affiliate Token / Secret Key</label>
                      <input
                        type="password"
                        value={fkToken}
                        onChange={(e) => setFkToken(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '8px', gap: '6px' }}
                    >
                      <span>Update Backend Secrets</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Synced Flipkart Products Table */}
              <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>
                  Currently Synced Flipkart Products ({flipkartProducts ? flipkartProducts.length : 0})
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>Brand / Category</th>
                      <th style={{ padding: '12px 16px' }}>Price (₹)</th>
                      <th style={{ padding: '12px 16px' }}>Offers</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Affiliate Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(flipkartProducts || []).map((fk) => (
                      <tr key={fk.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={fk.imageUrl || fk.images?.[0]} alt={fk.title || fk.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 800, maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {fk.title || fk.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {fk.id}</div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className="badge badge-primary">{fk.brand || fk.category}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 800 }}>
                          ₹{Number(fk.price).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                          {fk.offers ? fk.offers.length : 2} Active Bank Offers
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <a
                            href={fk.affiliateUrl || fk.productUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#2874f0', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <span>Open in Flipkart</span>
                            <ExternalLink size={13} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 12. PROFILE & SECURITY */}
          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Admin Security & Credentials</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Manage session credentials, change master password, and update profile security.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {/* Profile update form */}
                <div className="glass-panel" style={{ padding: '26px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Administrator Profile</h3>
                  <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Display Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Admin Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '6px' }}>
                      Save Profile
                    </button>
                  </form>
                </div>

                {/* Password Change Form */}
                <div className="glass-panel" style={{ padding: '26px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Update Security Password</h3>
                  <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>New Security Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPass}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-gold btn-sm" style={{ marginTop: '6px' }}>
                      Update Master Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 8, 15, 0.85)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="glass-panel animate-scale-in"
            style={{
              background: 'var(--bg-card-solid)',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-highlight)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
            </h3>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Product Title</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Stock Inventory Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Discount %</label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>High-Res Image URL</label>
                <input
                  type="url"
                  value={productForm.images[0] || ''}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', margin: '6px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} />
                  <span>Featured Collection</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={productForm.bestSeller} onChange={(e) => setProductForm({ ...productForm, bestSeller: e.target.checked })} />
                  <span>Best Seller</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={productForm.isNew} onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })} />
                  <span>New Arrival</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 8, 15, 0.85)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            className="glass-panel animate-scale-in"
            style={{ background: 'var(--bg-card-solid)', width: '100%', maxWidth: '440px', padding: '28px', borderRadius: 'var(--radius-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Add New Product Category</h3>
            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wellness & Health"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isCouponModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 8, 15, 0.85)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsCouponModalOpen(false)}
        >
          <div
            className="glass-panel animate-scale-in"
            style={{ background: 'var(--bg-card-solid)', width: '100%', maxWidth: '480px', padding: '28px', borderRadius: 'var(--radius-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Create Promotional Discount Code</h3>
            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Promo Code</label>
                <input
                  type="text"
                  placeholder="e.g. VIPEXCLUSIVE"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Discount Value (% or $)</label>
                  <input
                    type="number"
                    value={couponForm.discount}
                    onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Min Spend ($)</label>
                  <input
                    type="number"
                    value={couponForm.minSpend}
                    onChange={(e) => setCouponForm({ ...couponForm, minSpend: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Description</label>
                <input
                  type="text"
                  placeholder="e.g. 20% off all footwear"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>Create Promo Code</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
