import React, { useState } from 'react';
import { ChefHat, Flame, Clock, CheckCircle2, DollarSign, Package, AlertCircle, Sparkles, Filter, Trash2, CheckCheck, Camera, Star, Eye, Bot, ShoppingBag, X, Check, Store, TrendingUp } from 'lucide-react';
import IngredientSourcingAgent from './IngredientSourcingAgent';
import FoodCostingAgent from './FoodCostingAgent';
import { getResendApiKey, saveResendApiKey } from '../services/automatedEmailService';

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
  const [showAIIngredientsModal, setShowAIIngredientsModal] = useState(false);
  const [showAISourcingModal, setShowAISourcingModal] = useState(false);
  const [showAICostingModal, setShowAICostingModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendKeyInput, setResendKeyInput] = useState(() => getResendApiKey());

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

  // AI Ingredient Calculations for Kitchen Queue
  const calculateIngredients = () => {
    let creamCheeseLbs = 0;
    let blueberriesPints = 0;
    let mascarponeLbs = 0;
    let chocolateChunksLbs = 0;
    let farmEggsDozen = 0;
    let butterLbs = 0;
    let flourLbs = 0;

    orders.filter(o => o.status !== 'Completed').forEach(order => {
      order.items.forEach(item => {
        const qty = item.qty || 1;
        const lower = item.name.toLowerCase();
        if (lower.includes('cheesecake')) {
          creamCheeseLbs += (item.price > 25 ? 3.5 : 0.6) * qty;
          farmEggsDozen += 0.4 * qty;
          butterLbs += 0.3 * qty;
        } else if (lower.includes('muffin')) {
          blueberriesPints += 0.8 * qty;
          farmEggsDozen += 0.2 * qty;
          flourLbs += 0.4 * qty;
        } else if (lower.includes('tiramisu')) {
          mascarponeLbs += (item.price > 30 ? 2.5 : 0.5) * qty;
          farmEggsDozen += 0.4 * qty;
        } else if (lower.includes('coffee cake')) {
          butterLbs += 0.4 * qty;
          flourLbs += 0.5 * qty;
        } else if (lower.includes('cookie')) {
          chocolateChunksLbs += 0.5 * qty;
          butterLbs += 0.3 * qty;
          farmEggsDozen += 0.2 * qty;
        }
      });
    });

    return {
      creamCheeseLbs: Math.max(2, Math.ceil(creamCheeseLbs)),
      blueberriesPints: Math.max(1, Math.ceil(blueberriesPints)),
      mascarponeLbs: Math.max(1, Math.ceil(mascarponeLbs)),
      chocolateChunksLbs: Math.max(1, Math.ceil(chocolateChunksLbs)),
      farmEggsDozen: Math.max(1, Math.ceil(farmEggsDozen)),
      butterLbs: Math.max(2, Math.ceil(butterLbs)),
      flourLbs: Math.max(3, Math.ceil(flourLbs))
    };
  };

  const ingredients = calculateIngredients();

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

        {/* Dashboard Sub-Tab Navigation & AI Calculator Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
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

          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAICostingModal(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.92rem',
                backgroundColor: '#F3E8FF',
                color: '#6B21A8',
                border: '1px solid #E9D5FF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <TrendingUp size={17} />
              <span>🏷️ AI Profit Optimizer</span>
            </button>

            <button
              onClick={() => setShowResendModal(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.92rem',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Bot size={17} />
              <span>🔑 24/7 Auto Email Key</span>
            </button>

            <button
              onClick={() => setShowAISourcingModal(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.92rem',
                backgroundColor: '#EBF7EE',
                color: '#2D7A42',
                border: '1px solid #C4EACC',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Store size={17} />
              <span>🛒 AI Sourcing Agent</span>
            </button>

            <button
              onClick={() => setShowAIIngredientsModal(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.92rem',
                backgroundColor: 'var(--color-gold-light)',
                color: '#8A6D0B',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={17} />
              <span>🤖 AI Grocery Prep</span>
            </button>
          </div>
        </div>

        {activeTab === 'reviews' ? (
          /* Customer Photo Reviews Management Section */
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-espresso)', marginBottom: '16px' }}>
              Customer Photo Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No customer reviews submitted yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800 }}>{r.customerName || r.author}</span>
                      <button onClick={() => onDeleteReview(r.id)} style={{ color: '#D96B43', background: 'none' }}><Trash2 size={16} /></button>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Orders Queue Management Section */
          <div>
            {/* Action Bar Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px',
              backgroundColor: '#FFFFFF',
              padding: '16px 24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', marginRight: '6px' }}>Filter:</span>
                {['all', 'active', 'Pending Prep', 'In Oven', 'Decorating', 'Ready for Pickup', 'Completed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: activeFilter === f ? 'var(--color-espresso)' : 'var(--color-cream-light)',
                      color: activeFilter === f ? '#FFF' : 'var(--color-espresso)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer'
                    }}
                  >
                    {f === 'all' ? 'All Orders' : f === 'active' ? 'Active Queue' : f}
                  </button>
                ))}
              </div>

              {completedOrdersCount > 0 && (
                <button
                  onClick={onClearCompletedOrders}
                  style={{
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-espresso)',
                    border: '1px solid var(--color-border)',
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
                  <CheckCheck size={16} color="#2D7A42" />
                  <span>Clear Completed Orders ({completedOrdersCount})</span>
                </button>
              )}
            </div>

            {/* Orders Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', backgroundColor: '#FFF', borderRadius: 'var(--radius-lg)' }}>
                  <Package size={40} color="var(--color-caramel)" style={{ marginBottom: '12px' }} />
                  <h4>No orders found matching this filter</h4>
                </div>
              ) : (
                filteredOrders.map(order => {
                  const currentStatus = STATUS_OPTIONS.find(s => s.id === order.status) || STATUS_OPTIONS[0];

                  return (
                    <div key={order.id} style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px',
                      boxShadow: 'var(--shadow-sm)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-caramel)' }}>{order.id}</span>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-espresso)', margin: '2px 0 0 0' }}>{order.customerName}</h3>
                          </div>
                          
                          <button 
                            onClick={() => onDeleteOrder(order.id)}
                            style={{ background: 'none', color: '#D96B43', cursor: 'pointer', padding: '4px' }}
                            title="Delete Order"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        {/* Status Dropdown */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                            Update Baking Status:
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: `1.5px solid ${currentStatus.color}`,
                              backgroundColor: currentStatus.bg,
                              color: currentStatus.color,
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Contact & Receipt Bar */}
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                          <div><strong>Fulfillment:</strong> {order.fulfillment}</div>
                          <div><strong>Time Slot:</strong> {order.dateSlot}</div>
                          <div><strong>Payment:</strong> {order.paymentMethod}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span><strong>Contact:</strong> {order.email} • {order.phone}</span>
                            <a
                              href={`mailto:${order.email ? `${order.email},jmedrano707@yahoo.com` : 'jmedrano707@yahoo.com'}?subject=${encodeURIComponent(`Self-Made Sweet Co. Order Receipt #${order.id}`)}&body=${encodeURIComponent(`SELF-MADE SWEET CO. ORDER RECEIPT\nOrder #${order.id}\nCustomer: ${order.customerName}\nFulfillment: ${order.fulfillment} (${order.dateSlot})\nTotal: $${(order.total || 0).toFixed(2)}\n\nItems:\n` + (order.items || []).map(i => `• ${i.qty || 1}x ${i.name} ($${((i.unitPrice || i.price || 0) * (i.qty || 1)).toFixed(2)})`).join('\n') + `\n\nThank you for baking with Julian in Sacramento!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--color-caramel)', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none' }}
                            >
                              📩 Send Receipt
                            </a>
                          </div>
                          {order.note && <div style={{ color: 'var(--color-espresso)', fontStyle: 'italic' }}><strong>Note:</strong> "{order.note}"</div>}
                        </div>

                        {/* Items List */}
                        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>Items:</span>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                              <span>{item.qty}x {item.name}</span>
                              <span style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Order Total</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-espresso)' }}>${order.total.toFixed(2)}</span>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 🤖 AI GROCERY PREP CALCULATOR MODAL */}
        {showAIIngredientsModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(42, 27, 23, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 260,
            padding: '24px'
          }} onClick={() => setShowAIIngredientsModal(false)}>

            <div className="animate-fade-in" style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '32px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }} onClick={e => e.stopPropagation()}>

              <button 
                onClick={() => setShowAIIngredientsModal(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Sparkles size={24} color="var(--color-caramel)" />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-espresso)', margin: 0 }}>
                  🤖 AI Weekend Grocery Prep List
                </h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                Calculated live from <strong>{activeOrdersCount} active kitchen queue order(s)</strong>!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[
                  { name: 'Organic Block Cream Cheese', qty: `${ingredients.creamCheeseLbs} lbs`, category: 'Dairy' },
                  { name: 'Fresh Wild Blueberries', qty: `${ingredients.blueberriesPints} pint(s)`, category: 'Produce' },
                  { name: 'Italian Mascarpone Cheese', qty: `${ingredients.mascarponeLbs} lbs`, category: 'Dairy' },
                  { name: 'Gourmet Dark Chocolate Chunks', qty: `${ingredients.chocolateChunksLbs} lbs`, category: 'Pantry' },
                  { name: 'Farm Fresh Eggs', qty: `${ingredients.farmEggsDozen} dozen`, category: 'Dairy' },
                  { name: 'Unsalted Creamery Butter', qty: `${ingredients.butterLbs} lbs`, category: 'Dairy' },
                  { name: 'Unbleached Organic Flour', qty: `${ingredients.flourLbs} lbs`, category: 'Pantry' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-cream-light)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-espresso)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Category: {item.category}</div>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-caramel)' }}>
                      {item.qty}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAIIngredientsModal(false)}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                Close Grocery List
              </button>

            </div>
          </div>
        )}

        {/* 🛒 AI BEST PRICE SOURCING AGENT MODAL */}
        <IngredientSourcingAgent 
          isOpen={showAISourcingModal}
          onClose={() => setShowAISourcingModal(false)}
        />

        {/* 🏷️ AI FOOD COSTING & PROFIT OPTIMIZER MODAL */}
        <FoodCostingAgent 
          isOpen={showAICostingModal}
          onClose={() => setShowAICostingModal(false)}
        />

        {/* 🔑 24/7 AUTO EMAIL API KEY MODAL */}
        {showResendModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(42, 27, 23, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 290,
            padding: '24px'
          }} onClick={() => setShowResendModal(false)}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '32px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }} onClick={(e) => e.stopPropagation()}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-espresso)', margin: 0, fontWeight: 800 }}>
                  🔑 24/7 Auto Email Key Settings
                </h3>
                <button onClick={() => setShowResendModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                Enter your free <strong>Resend.com API Key</strong> (`re_...`) below to enable instant, 100% automated background email receipts sent directly to <strong>jmedrano707@yahoo.com</strong>!
              </p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                  Resend API Key:
                </label>
                <input 
                  type="password"
                  placeholder="re_123456789_abcdefg..."
                  value={resendKeyInput}
                  onChange={(e) => setResendKeyInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => {
                    saveResendApiKey(resendKeyInput);
                    setShowResendModal(false);
                    alert('✅ Resend API Key saved! Automated 24/7 background emails are now ACTIVE!');
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Save API Key
                </button>

                <button 
                  onClick={() => setShowResendModal(false)}
                  className="btn-secondary"
                  style={{ padding: '12px' }}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
