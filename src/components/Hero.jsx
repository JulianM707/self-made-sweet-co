import React from 'react';
import { Sparkles, ArrowRight, Award, Heart, CheckCircle2, GraduationCap, Smile, Dumbbell, MapPin } from 'lucide-react';

export default function Hero({ onExploreMenu, onOpenAbout }) {
  return (
    <section style={{
      position: 'relative',
      padding: '60px 0 50px 0',
      background: 'radial-gradient(circle at 80% 20%, #F5EBE1 0%, #FAF7F2 60%)',
      overflow: 'hidden'
    }}>
      <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'center' }}>
        
        {/* Left Hero Content */}
        <div>
          {/* Founder Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span className="badge badge-gold">
              <Sparkles size={14} />
              <span>Julian Medrano, MBA • UC Santa Cruz & SDSU Alum</span>
            </span>
            <span className="badge badge-caramel">1st Gen Mexican-American • Vallejo Native</span>
          </div>

          <h1 style={{
            fontSize: '3.4rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
            color: 'var(--color-espresso)'
          }}>
            Baking <span style={{ color: 'var(--color-caramel)', fontStyle: 'italic' }}>Joy & Smiles</span> into Every Slice.
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--color-text-muted)',
            marginBottom: '28px',
            maxWidth: '560px',
            lineHeight: 1.65
          }}>
            Hi, I’m <strong>Julian Medrano</strong>! Born & raised in Vallejo, CA, I worked hard to get out and earn my Bachelor’s degree from <strong>UC Santa Cruz</strong> and my <strong>MBA from SDSU</strong>. As a proud 1st generation Mexican-American who loves fitness and great food, my mission is simple: share my passion for baking and put genuine smiles on people’s faces with every bite.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <button onClick={onExploreMenu} className="btn-primary">
              <span>Order Signature Bakes</span>
              <ArrowRight size={18} />
            </button>
            
            <button onClick={onOpenAbout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={16} color="var(--color-terracotta)" fill="var(--color-terracotta)" />
              <span>Julian's Story</span>
            </button>
          </div>

          {/* Value Props */}
          <div style={{ display: 'flex', gap: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
              <Smile size={18} color="var(--color-caramel)" />
              <span>Baked to Make You Smile</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
              <Dumbbell size={18} color="var(--color-caramel)" />
              <span>Gym & Food Passion</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
              <GraduationCap size={18} color="var(--color-caramel)" />
              <span>UC Santa Cruz & SDSU MBA</span>
            </div>
          </div>
        </div>

        {/* Right Hero Showcase Cards Collage */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '4px solid #FFF'
          }}>
            <img 
              src="/images/berry_muffins_1786065279996.jpg" 
              alt="Julian Medrano's Wild Blueberry Streusel Muffin" 
              style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px',
              background: 'linear-gradient(to top, rgba(42,27,23,0.88) 0%, rgba(42,27,23,0) 100%)',
              color: '#FFF'
            }}>
              <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Julian's Masterpiece 🏆</span>
              <h3 style={{ color: '#FFF', fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>Wild Blueberry Streusel Muffin</h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.9 }}>Overflowing with fresh wild blueberries & cold-butter cinnamon streusel crumble</p>
            </div>
          </div>

          {/* Floating Accent Card */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37'
            }}>
              <Heart size={20} fill="currentColor" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-espresso)' }}>Self-Made Sweet Co.</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-caramel)', fontWeight: 600 }}>Julian Medrano, MBA</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
