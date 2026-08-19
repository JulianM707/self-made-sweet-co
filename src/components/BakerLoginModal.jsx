import React, { useState } from 'react';
import { X, Lock, ChefHat, Mail, Key, AlertCircle, ArrowRight } from 'lucide-react';

export default function BakerLoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const SECRET_EMAILS = ['julian@selfmadesweetco.com', 'julian@juliansbakery.com'];
  const SECRET_PASSWORD = 'bakery123';

  // Email & Password Submit
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (SECRET_EMAILS.includes(email.toLowerCase().trim()) && password === SECRET_PASSWORD) {
      setError('');
      setEmail('');
      setPassword('');
      onLoginSuccess();
    } else {
      setError('Invalid email or password credentials.');
    }
  };

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
      zIndex: 260,
      padding: '24px'
    }} onClick={onClose}>

      <div className="animate-fade-in" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '420px',
        width: '100%',
        padding: '36px 32px',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        textAlign: 'center'
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

        {/* Header Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold-light)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D4AF37',
          marginBottom: '16px'
        }}>
          <ChefHat size={32} />
        </div>

        <span className="badge badge-gold" style={{ marginBottom: '10px' }}>
          <Lock size={13} />
          <span>Julian's Kitchen Portal</span>
        </span>

        <h3 style={{ fontSize: '1.6rem', marginBottom: '6px', color: 'var(--color-espresso)' }}>
          Baker Kitchen Sign In
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
          Enter your admin email and password to access the kitchen dashboard.
        </p>

        {error && (
          <div style={{
            color: '#D96B43',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px',
            padding: '10px 14px',
            backgroundColor: 'rgba(217, 107, 67, 0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(217, 107, 67, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
              Baker Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--color-caramel)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="julian@selfmadesweetco.com"
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} color="var(--color-caramel)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '13px', marginTop: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span>Sign In to Kitchen Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
