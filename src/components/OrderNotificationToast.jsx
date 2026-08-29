import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, X, Clock, ChefHat, ExternalLink } from 'lucide-react';

export default function OrderNotificationToast({ order, onClose, onTrackOrder }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!order) return;

    // Progress bar Countdown (10 seconds)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [order, onClose]);

  if (!order) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 300,
      maxWidth: '440px',
      width: 'calc(100% - 48px)',
      backgroundColor: '#2A1B17',
      color: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 16px 40px rgba(42, 27, 23, 0.35)',
      border: '1.5px solid #D4AF37',
      overflow: 'hidden',
      animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      
      {/* Top Banner Accent */}
      <div style={{
        background: 'linear-gradient(90deg, var(--color-caramel) 0%, #D4AF37 100%)',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: '#2A1B17'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bell size={14} />
          <span>INSTANT ORDER CONFIRMATION</span>
        </div>
        <span>Self-Made Sweet Co.</span>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#2D7A42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              flexShrink: 0
            }}>
              <CheckCircle2 size={22} />
            </div>

            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0, fontWeight: 800 }}>
                Order #{order.id} Placed!
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 600 }}>
                Julian received your order in the kitchen!
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Details */}
        <p style={{
          fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.5,
          marginBottom: '16px'
        }}>
          Thank you, <strong>{order.customerName}</strong>! Your order for <strong>{order.items?.length || 1} item(s) (${(order.total || 0).toFixed(2)})</strong> has been confirmed for <strong>{order.fulfillment}</strong> ({order.dateSlot}).
        </p>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              onTrackOrder(order);
              onClose();
            }}
            style={{
              flex: 1,
              backgroundColor: 'var(--color-caramel)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Clock size={15} />
            <span>Track Status</span>
          </button>

          <a
            href={`mailto:${order.email ? `${order.email},jmedrano707@yahoo.com` : 'jmedrano707@yahoo.com'}?subject=${encodeURIComponent(`Self-Made Sweet Co. Order Receipt #${order.id}`)}&body=${encodeURIComponent(`SELF-MADE SWEET CO. ORDER RECEIPT\nOrder #${order.id}\nCustomer: ${order.customerName}\nFulfillment: ${order.fulfillment} (${order.dateSlot})\nTotal: $${(order.total || 0).toFixed(2)}\n\nItems:\n` + (order.items || []).map(i => `• ${i.qty || 1}x ${i.name} ($${((i.unitPrice || i.price || 0) * (i.qty || 1)).toFixed(2)})`).join('\n') + `\n\nThank you for baking with Julian in Sacramento!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={14} />
            <span>📩 Email Receipt</span>
          </a>
        </div>

      </div>

      {/* Auto-dismiss countdown bar */}
      <div style={{
        height: '4px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: '100%'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: '#D4AF37',
          width: `${progress}%`,
          transition: 'width 0.1s linear'
        }} />
      </div>

    </div>
  );
}
