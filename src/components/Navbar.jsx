import React from 'react';
import { ShoppingBag, Sparkles, Heart, Star, Bot } from 'lucide-react';
import CookieLogoIcon from './CookieLogoIcon';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  onOpenQuiz, 
  onOpenAbout,
  onOpenAIChat,
  activeTab, 
  setActiveTab,
  reviewsCount = 0,
  activeOrderTrack,
  onTrackOrder
}) {
  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--color-border)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        
        {/* Brand Logo (Front Left Corner) */}
        <div 
          onClick={() => setActiveTab('menu')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <CookieLogoIcon size={44} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-espresso)', letterSpacing: '-0.3px', display: 'block', lineHeight: 1 }}>
              Self-Made Sweet Co.
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-caramel)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Handcrafted Bakes • Vallejo Roots • UC Santa Cruz & SDSU MBA
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'menu' ? 'var(--color-cream)' : 'transparent',
              color: activeTab === 'menu' ? 'var(--color-espresso)' : 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            Signature Menu
          </button>

          <button 
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'reviews' ? 'var(--color-cream)' : 'transparent',
              color: activeTab === 'reviews' ? 'var(--color-espresso)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Star size={16} color="var(--color-gold)" fill="var(--color-gold)" />
            <span>Customer Reviews</span>
          </button>

          <button 
            onClick={onOpenAbout}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: 'transparent',
              color: 'var(--color-espresso)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Heart size={16} color="var(--color-terracotta)" fill="var(--color-terracotta)" />
            Meet Julian
          </button>

          <button 
            onClick={onOpenAIChat}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: 'transparent',
              color: 'var(--color-espresso)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Bot size={16} color="var(--color-caramel)" />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Persistent Order Tracking Button */}
          {activeOrderTrack && (
            <button 
              onClick={onTrackOrder}
              className="badge badge-gold animate-bounce-short"
              style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', border: '1px solid #D4AF37' }}
            >
              <Sparkles size={14} color="#D4AF37" />
              <span>🔎 Track Order #{activeOrderTrack.id}</span>
            </button>
          )}

          {/* Flavor Quiz Button */}
          <button 
            onClick={onOpenQuiz}
            className="badge badge-gold"
            style={{ padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
          >
            <Sparkles size={15} />
            <span>Match My Cravings</span>
          </button>

          {/* Shopping Cart Drawer Trigger */}
          <button 
            onClick={onOpenCart}
            className="btn-primary"
            style={{ padding: '10px 18px', position: 'relative' }}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--color-terracotta)',
                color: '#FFF',
                fontSize: '0.75rem',
                fontWeight: 700,
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
