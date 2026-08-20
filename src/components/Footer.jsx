import React from 'react';
import { Heart, Mail, Phone, MapPin, GraduationCap, Lock } from 'lucide-react';
import CookieLogoIcon from './CookieLogoIcon';

export default function Footer({ onOpenAbout, onOpenBakerLogin }) {
  return (
    <footer style={{ backgroundColor: 'var(--color-espresso)', color: '#FFFFFF', paddingTop: '60px', paddingBottom: '40px' }}>
      <div className="container">
        
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          
          {/* Col 1: Julian's Story & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <CookieLogoIcon size={42} />
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                Self-Made Sweet Co.
              </h3>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '20px' }}>
              Founded by <strong>Julian Medrano</strong>, a 1st generation Mexican-American from Vallejo, CA. 
              Armed with a <strong>Bachelor's Degree from UC Santa Cruz</strong> and an <strong>MBA from San Diego State University (SDSU)</strong>, 
              Julian brings passion, fitness discipline, and artisan baking craft to every treat.
            </p>

            <button 
              onClick={onOpenAbout}
              className="badge badge-gold"
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              <Heart size={14} fill="currentColor" />
              <span>Read Julian’s Full Founder Story</span>
            </button>
          </div>

          {/* Col 2: Signature Bakes Menu */}
          <div>
            <h4 style={{ color: 'var(--color-caramel)', fontSize: '1.1rem', marginBottom: '18px', fontWeight: 700 }}>
              My Signature Bakes
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
              <li>• Classic Artisan Cheesecake</li>
              <li>• Classic Venetian Tiramisu</li>
              <li>• Wild Blueberry Streusel Muffin</li>
              <li>• Cinnamon Streusel Coffee Cake</li>
              <li>• Gourmet Chocolate Chip Cookie</li>
            </ul>
          </div>

          {/* Col 3: Sacramento Order & Pickup Hours */}
          <div>
            <h4 style={{ color: 'var(--color-caramel)', fontSize: '1.1rem', marginBottom: '18px', fontWeight: 700 }}>
              Sacramento Kitchen & Delivery
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} color="var(--color-caramel)" style={{ flexShrink: 0 }} />
                <span>Sacramento, California (Local Delivery & Store Pickup Available)</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Mail size={18} color="var(--color-caramel)" style={{ flexShrink: 0 }} />
                <span>jmedrano707@yahoo.com</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Phone size={18} color="var(--color-caramel)" style={{ flexShrink: 0 }} />
                <span>(916) 555-BAKE</span>
              </div>
              <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                ⏰ Kitchen Hours: Saturday & Sunday: 8:00 AM – 8:00 PM
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Secret Baker Portal Link */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <div>
            © {new Date().getFullYear()} Self-Made Sweet Co. • All Rights Reserved • Handcrafted with ❤️ by Julian
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Discreet Kitchen Staff Link */}
            <button 
              onClick={onOpenBakerLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Lock size={11} />
              <span>Kitchen Staff</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
