import React, { useState } from 'react';
import { ChefHat, Flame, Clock, CheckCircle2, DollarSign, Package, AlertCircle, Sparkles, Filter, Trash2, CheckCheck } from 'lucide-react';

export default function BakerDashboard({ 
  orders, 
  onUpdateOrderStatus, 
  onDeleteOrder, 
  onClearCompletedOrders,
  products, 
  onToggleProductAvailability 
}) {
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
              <span style={{ fontSize: '0.78rem', opacity: 0.8, textTransform: 'uppercase' }}>Completed Orders</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-gold)' }}>{completedOrdersCount}</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
              <span style={{ fontSize: '0.78rem', opacity: 0.8, textTransform: 'uppercase' }}>Total Revenue</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F9F1D8' }}>${totalRevenue.toFixed(2)}</div>
            </div>
          </div>
        </div>

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

      </div>
    </section>
  );
}
