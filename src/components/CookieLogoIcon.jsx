import React from 'react';

export default function CookieLogoIcon({ size = 28, color = '#FFF', cookieBg = '#C88D51', chipColor = '#2A1B17' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 44 44" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Outer Golden Cookie Circle */}
      <circle cx="22" cy="22" r="21" fill={cookieBg} stroke="#B37A40" strokeWidth="1.5" />
      
      {/* Baked Texture Inner Ring */}
      <circle cx="22" cy="22" r="18.5" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" strokeDasharray="3 2" />

      {/* Chocolate Chips around edges */}
      <circle cx="10" cy="14" r="2.2" fill={chipColor} opacity="0.85" />
      <circle cx="34" cy="13" r="2.4" fill={chipColor} opacity="0.85" />
      <circle cx="9" cy="28" r="2.2" fill={chipColor} opacity="0.85" />
      <circle cx="35" cy="29" r="2.2" fill={chipColor} opacity="0.85" />
      <circle cx="22" cy="7" r="2" fill={chipColor} opacity="0.8" />
      <circle cx="22" cy="37" r="2" fill={chipColor} opacity="0.8" />

      {/* S-M Monogram Text in Center */}
      <text 
        x="22" 
        y="26.5" 
        textAnchor="middle" 
        fill={color} 
        fontSize="14" 
        fontWeight="900" 
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        letterSpacing="-0.5px"
      >
        S-M
      </text>
    </svg>
  );
}
