import React from 'react';
import { X, CheckCircle2, Clock, Flame, Sparkles, PackageCheck, UtensilsCrossed } from 'lucide-react';

export default function OrderStatusModal({ order, onClose }) {
  if (!order) return null;

  const STATUS_STEPS = [
    { label: 'Order Confirmed', icon: CheckCircle2, desc: 'Received & scheduled in kitchen queue' },
    { label: 'Prep In Progress', icon: UtensilsCrossed, desc: 'Mixing fresh organic ingredients & dough' },
    { label: 'In Oven', icon: Flame, desc: 'Baking to golden perfection' },
    { label: 'Decorating & Decor', icon: Sparkles, desc: 'Hand-decorating & icing details' },
    { label: 'Ready for You!', icon: PackageCheck, desc: 'Boxed & ready at kitchen counter or delivery' }
  ];

  // Helper to determine current step index from status
  const getCurrentStepIndex = (status) => {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s.includes('pending') || s.includes('confirmed')) return 0;
    if (s.includes('prep')) return 1;
    if (s.includes('oven')) return 2;
    if (s.includes('decorat')) return 3;
    if (s.includes('ready')) return 4;
    if (s.includes('completed')) return 4;
    return 1;
  };

  const currentStepIdx = getCurrentStepIndex(order.status);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(42, 27, 23, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 260,
      padding: '24px'
    }} onClick={onClose}>

      <div className="animate-fade-in" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '620px',
        width: '100%',
        padding: '36px',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-cream)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-espresso)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
            Live Order Tracking • #{order.id}
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-espresso)' }}>Thank You, {order.customerName}!</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Fulfillment: <strong style={{ color: 'var(--color-espresso)' }}>{order.fulfillment}</strong> ({order.dateSlot})
          </p>
        </div>

        {/* Status Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          {STATUS_STEPS.map((step, idx) => {
            const IconComp = step.icon;
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                
                {/* Step Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isDone ? 'var(--color-caramel)' : 'var(--color-cream)',
                  color: isDone ? '#FFF' : 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? 'var(--shadow-gold)' : 'none',
                  zIndex: 2
                }}>
                  <IconComp size={20} />
                </div>

                {/* Vertical Line Connector */}
                {idx < STATUS_STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '19px',
                    width: '2px',
                    height: '24px',
                    backgroundColor: idx < currentStepIdx ? 'var(--color-caramel)' : 'var(--color-border)',
                    zIndex: 1
                  }} />
                )}

                {/* Step Details */}
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    color: isDone ? 'var(--color-espresso)' : 'var(--color-text-muted)',
                    fontWeight: isCurrent ? 800 : 600
                  }}>
                    {step.label} {isCurrent && <span style={{ color: 'var(--color-caramel)', fontSize: '0.8rem', marginLeft: '6px' }}>(Current Status: {order.status})</span>}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{step.desc}</p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Summary of Items */}
        <div style={{
          backgroundColor: 'var(--color-cream-light)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-border)'
        }}>
          <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            Reserved Items ({order.items.length})
          </h4>
          {order.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
              <span>{it.qty}x {it.name}</span>
              <span style={{ fontWeight: 700 }}>${it.price.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-espresso)', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '8px' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--color-caramel)' }}>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
            Done / Return to Bakery
          </button>
        </div>

      </div>
    </div>
  );
}
