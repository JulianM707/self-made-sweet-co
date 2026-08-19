import React from 'react';
import { X, Award, GraduationCap, Heart, Sparkles, Smile, Star, MapPin, Dumbbell, ShieldCheck } from 'lucide-react';

export default function AboutJulianModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
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
      zIndex: 250,
      padding: '24px'
    }} onClick={onClose}>

      <div className="animate-fade-in" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-cream)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-espresso)',
            zIndex: 10,
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Top Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-espresso) 0%, #4A2E26 100%)',
          color: '#FFFFFF',
          padding: '40px 36px 30px 36px',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.15)',
            filter: 'blur(35px)'
          }}></div>

          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            <Sparkles size={14} />
            <span>Self-Made Sweet Co. Founder</span>
          </span>

          <h2 style={{ color: '#FFFFFF', fontSize: '2.2rem', marginBottom: '8px' }}>
            Julian Medrano, MBA
          </h2>
          <p style={{ color: 'var(--color-gold)', fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>Founder & Master Baker</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F9F1D8' }}>
              <MapPin size={15} color="var(--color-gold)" /> Vallejo Native • Sacramento, CA
            </span>
          </p>
        </div>

        {/* Story Body */}
        <div style={{ padding: '36px' }}>
          
          {/* Mission Quote Banner */}
          <div style={{
            backgroundColor: 'var(--color-cream-light)',
            borderLeft: '4px solid var(--color-caramel)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
            marginBottom: '28px'
          }}>
            <p style={{
              fontSize: '1.08rem',
              fontStyle: 'italic',
              color: 'var(--color-espresso)',
              lineHeight: 1.6,
              fontWeight: 500,
              margin: 0
            }}>
              "I built Self-Made Sweet Co. on hard work, discipline, and passion. There is nothing in the world quite like watching someone’s face light up with a genuine smile after their first bite of a fresh bake."
            </p>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-caramel)', display: 'block', marginTop: '10px' }}>
              — Julian Medrano, Founder of Self-Made Sweet Co.
            </span>
          </div>

          {/* Bio Story Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-caramel)', marginBottom: '8px' }}>
                <MapPin size={22} />
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-espresso)' }}>Vallejo Roots to Self-Made Rise</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                Born & raised in Vallejo, CA, Julian worked relentlessly to beat the odds—getting out of the hood and earning his Bachelor’s degree from <strong>UC Santa Cruz</strong> and an <strong>MBA from SDSU</strong>.
              </p>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-caramel)', marginBottom: '8px' }}>
                <Heart size={22} />
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-espresso)' }}>1st Gen Mexican-American Pride</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                As a proud first-generation Mexican-American, Julian combines deep cultural warmth and family values with a passion for building a lasting legacy.
              </p>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-caramel)', marginBottom: '8px' }}>
                <Dumbbell size={22} />
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-espresso)' }}>Gym Discipline & Food Love</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                Julian brings gym-level dedication and precision to the baking table—loving fitness and great food in equal measure.
              </p>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-caramel)', marginBottom: '8px' }}>
                <GraduationCap size={22} />
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-espresso)' }}>UCSC & SDSU MBA Precision</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                Combining academic discipline from UC Santa Cruz and strategic business training from SDSU with small-batch artisanal baking.
              </p>
            </div>

          </div>

          {/* Core Values */}
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--color-espresso)' }}>
            Julian's Self-Made Baking Philosophy:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-caramel)',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Smile size={16} />
              </div>
              <div>
                <strong style={{ color: 'var(--color-espresso)', fontSize: '0.95rem' }}>Baking Joy & Smiles First:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Every cheesecake, tiramisu, muffin, coffee cake, and cookie is baked to spark pure happiness and make every moment memorable.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-caramel)',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Star size={16} />
              </div>
              <div>
                <strong style={{ color: 'var(--color-espresso)', fontSize: '0.95rem' }}>Uncompromising Ingredient Quality:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Real cream cheese, sour cream & lemon zest, full-pint wild blueberries, Italian mascarpone, and pure vanilla extract.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <button onClick={onClose} className="btn-primary" style={{ padding: '12px 32px' }}>
              <span>Explore Self-Made Sweet Co. Bakes</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
