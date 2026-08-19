import React, { useState } from 'react';
import { ChefHat, Flame, Clock, CheckCircle2, DollarSign, Package, AlertCircle, Sparkles, Filter, Trash2, CheckCheck, Camera, Star, Eye } from 'lucide-react';

export default function BakerDashboard({ 
  orders, 
  onUpdateOrderStatus, 
  onDeleteOrder, 
  onClearCompletedOrders,
  products, 
  onToggleProductAvailability,
  reviews = [],
  onDeleteReview,
  onToggleFeatureReview
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'reviews'
  const [activeFilter, setActiveFilter] = useState('all');


  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Completed').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Completed').length;

  const STATUS_OPTIONS = [
    { id: 'Pending Prep', label: '📋 Pending Prep', color: '#D96B43', bg: 'rgba(217,107,67,0.1)' },
    { id: 'Prep In Progress', label: '🥣 Prep In Progress', color: '#B36B00', bg: 'rgba(179,107,0,0.1)' },
    { id: 'In Oven', label: '♨️ In Oven', color: '#D4AF37', bg: 'rgba(212,175,55,0.15)' },
    { id: 'Decorating', label: '🎨 Decorating', color: '#8A4BAF', bg: 'rgba(138,75,175,0.1)' },
    { id: 'Ready for Pickup', label: '🛍️ Ready for Pickup', color: '#2B8A3E', bg: 'rgba(43,138,62,0.1)' },
    { id: 'Completed', label: '✅ Completed', color: '#495057', bg: 'rgba(73,80,87,0.1)' }
  ];

  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return o.status !== 'Completed';
    return o.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section style={{ padding: '40px 0 80px 0', background: 'var(--color-cream-light)' }}>
      <div className="container">
        
        {/* Dashboard Banner */}
        <div style={{
          backgroundColor: 'var(--color-espresso)',
          color: '#FFF',
          padding: '28px 36px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37'
            }}>
              <ChefHat size={28} />
            </div>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '4px' }}>Julian's Kitchen Workspace</span>
              <h2 style={{ color: '#FFF', fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>
                Baking Kitchen Queue & Order Management
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', opacity: 0.8, textTransform: 'uppercase' }}>Active Kitchen Queue</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F9F1D8' }}>{activeOrdersCount}</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
              <span style={{ fontSize: '0.78rem', opacity: 0.8, textTransform: 'uppercase' }}>Customer Reviews</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-gold)' }}>{reviews.length}</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
              <span style={{ fontSize: '0.78rem', opacity: 0.8, textTransform: 'uppercase' }}>Total Revenue</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F9F1D8' }}>${totalRevenue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Dashboard Sub-Tab Navigation (Orders vs Customer Reviews) */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.92rem',
              backgroundColor: activeTab === 'orders' ? 'var(--color-espresso)' : '#FFFFFF',
              color: activeTab === 'orders' ? '#FFFFFF' : 'var(--color-espresso)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'orders' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Package size={17} />
            <span>Orders Queue ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.92rem',
              backgroundColor: activeTab === 'reviews' ? 'var(--color-espresso)' : '#FFFFFF',
              color: activeTab === 'reviews' ? '#FFFFFF' : 'var(--color-espresso)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'reviews' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Camera size={17} color="#D4AF37" />
            <span>Customer Photo Reviews ({reviews.length})</span>
          </button>
        </div>

        {activeTab === 'reviews' ? (
          /* Customer Photo Reviews Management Section */
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--color-espresso)', margin: 0 }}>
                  Customer Reviews & Dish Photos Moderation
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Inspect incoming dish photos, feature top reviews on the main gallery, or delete entries.
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                No customer reviews posted yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: review.featured ? '#FFFDF5' : '#FFFFFF'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-espresso)' }}>{review.customerName}</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {'★'.repeat(review.rating)}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--color-caramel)', fontWeight: 700, marginBottom: '8px' }}>
                        🍰 {review.dishName}
                      </div>

                      <h5 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-espresso)' }}>{review.title}</h5>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.5, marginBottom: '14px' }}>{review.comment}</p>

                      {review.image && (
                        <img 
                          src={review.image} 
                          alt={review.dishName}
                          style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}
                        />
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                      <button
                        onClick={() => onToggleFeatureReview && onToggleFeatureReview(review.id)}
                        style={{
                          backgroundColor: review.featured ? '#D4AF37' : 'transparent',
                          color: review.featured ? '#FFF' : 'var(--color-espresso)',
                          border: '1px solid #D4AF37',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Star size={12} fill={review.featured ? '#FFF' : 'none'} />
                        <span>{review.featured ? 'Featured' : 'Feature'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Delete this customer review?')) {
                            onDeleteReview && onDeleteReview(review.id);
                          }
                        }}
                        style={{
                          backgroundColor: 'rgba(217, 107, 67, 0.1)',
                          color: 'var(--color-terracotta)',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>


        {/* Status Filters & Bulk Clear Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={15} /> Filter Orders:
            </span>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: activeFilter === 'all' ? 'var(--color-espresso)' : '#FFF',
                color: activeFilter === 'all' ? '#FFF' : 'var(--color-espresso)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer'
              }}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: activeFilter === 'active' ? 'var(--color-caramel)' : '#FFF',
                color: activeFilter === 'active' ? '#FFF' : 'var(--color-espresso)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer'
              }}
            >
              In-Progress Queue ({activeOrdersCount})
            </button>
          </div>

          {/* Bulk Clear Completed Button */}
          {completedOrdersCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove all ${completedOrdersCount} completed orders?`)) {
                  onClearCompletedOrders();
                }
              }}
              style={{
                backgroundColor: 'rgba(217, 107, 67, 0.1)',
                color: 'var(--color-terracotta)',
                border: '1px solid rgba(217, 107, 67, 0.3)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trash2 size={14} />
              <span>Clear All {completedOrdersCount} Completed Orders</span>
            </button>
          )}

        </div>

        {/* Orders Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
              No orders found in this category.
            </div>
          ) : (
            filteredOrders.map(order => {
              const currentOption = STATUS_OPTIONS.find(opt => opt.id.toLowerCase() === order.status.toLowerCase()) || {
                label: order.status,
                color: 'var(--color-espresso)',
                bg: 'var(--color-cream-light)'
              };

              return (
                <div key={order.id} style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <div>
                    {/* Card Header & Delete Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-espresso)' }}>{order.id}</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: currentOption.bg,
                          color: currentOption.color,
                          border: `1px solid ${currentOption.color}`
                        }}>
                          {currentOption.label}
                        </span>

                        {/* Individual Delete Order Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order ${order.id} for ${order.customerName}?`)) {
                              onDeleteOrder(order.id);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete / Remove Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-espresso)' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{order.phone} • {order.email}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-caramel)', fontWeight: 700, marginTop: '4px' }}>
                        {order.fulfillment} ({order.dateSlot})
                      </div>
                      {order.paymentMethod && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          Payment: <strong>{order.paymentMethod}</strong>
                        </div>
                      )}
                    </div>

                    {/* Note */}
                    {order.note && (
                      <div style={{
                        backgroundColor: 'var(--color-cream-light)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontStyle: 'italic',
                        marginBottom: '12px',
                        color: 'var(--color-espresso)',
                        borderLeft: '3px solid var(--color-caramel)'
                      }}>
                        Note: "{order.note}"
                      </div>
                    )}

                    {/* Items List */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>Items to Prepare</div>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ fontSize: '0.88rem', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                          • <strong>{item.qty}x</strong> {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Dropdown Controls */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Update Baking Status:</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-espresso)' }}>${order.total.toFixed(2)}</span>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--color-cream-light)',
                        color: 'var(--color-espresso)',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              );
            })
          )}
        </div>
        </>
        )}

      </div>
    </section>
  );
}

