import React from 'react';
import { Cake, Heart, Mail, Phone, MapPin, GraduationCap, Lock } from 'lucide-react';

export default function Footer({ onOpenAbout, onOpenBakerLogin }) {
  return (
    <footer style={{ backgroundColor: 'var(--color-espresso)', color: '#FFFFFF', paddingTop: '60px', paddingBottom: '40px' }}>
      <div className="container">
        
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          
          {/* Col 1: Julian's Story & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-caramel)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
              }}>
                <Cake size={20} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                Self-Made Sweet Co.
              </h3>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '20px' }}>
              Welcome to <strong>Self-Made Sweet Co.</strong>! Founded by Julian Medrano, MBA—Vallejo native, UC Santa Cruz B.S. & SDSU MBA Alum, 1st gen Mexican-American, and self-made baker passionate about bringing genuine smiles to people’s faces.
            </p>

            <button 
              onClick={onOpenAbout}
              className="badge badge-gold"
              style={{ padding: '8px 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Heart size={14} fill="currentColor" />
              <span>Read Julian's Full Story</span>
            </button>
          </div>

          {/* Col 2: Signature Items */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '18px', fontFamily: 'var(--font-heading)' }}>
              Our Signature Bakes
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              <li>• Classic Artisan Cheesecake</li>
              <li>• Fresh Jammy Strawberry Cheesecake</li>
              <li>• Wild Blueberry Streusel Muffin</li>
              <li>• Classic Venetian Tiramisu</li>
              <li>• Cinnamon Streusel Coffee Cake</li>
              <li>• Gourmet Chocolate Chip Cookie</li>
            </ul>
          </div>

          {/* Col 3: Kitchen Info */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '18px', fontFamily: 'var(--font-heading)' }}>
              Sacramento Kitchen Info
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="var(--color-gold)" />
                <span>Sacramento, California (Vallejo Roots)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--color-gold)" />
                <span>julian@selfmadesweetco.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={16} color="var(--color-gold)" />
                <span>UC Santa Cruz & SDSU MBA Alum</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.6)'
        }}>
          <div>
            © {new Date().getFullYear()} Self-Made Sweet Co. All Rights Reserved. Crafted with <Heart size={13} display="inline" color="var(--color-terracotta)" fill="var(--color-terracotta)" /> for dessert lovers.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Vallejo Roots</span>
            <span>•</span>
            <span>UCSC & SDSU MBA Alum</span>
            <span>•</span>
            <button 
              onClick={onOpenBakerLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Kitchen Staff Portal Login"
            >
              <Lock size={12} />
              <span>Kitchen Staff</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
