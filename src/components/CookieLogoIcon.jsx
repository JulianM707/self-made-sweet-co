import React from 'react';

export default function CookieLogoIcon({ size = 48, className = '', style = {} }) {
  return (
    <img 
      src="/images/sm_cookie_logo.png" 
      alt="Self-Made Sweet Co. Authentic SM Cookie Logo"
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        borderRadius: '50%',
        boxShadow: '0 3px 10px rgba(42, 27, 23, 0.18)',
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        border: '2px solid #FFFFFF',
        ...style
      }}
    />
  );
}
