import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/bakeryData';
import { Search, Star, Plus, Eye, Sparkles, PieChart, Coffee, Cake, Cookie, Gift } from 'lucide-react';

const ICON_MAP = {
  Sparkles: Sparkles,
  PieChart: PieChart,
  Coffee: Coffee,
  Cake: Cake,
  Cookie: Cookie,
  Gift: Gift
};

export default function ProductCatalog({ onSelectProduct, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('all');

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary = selectedDietary === 'all' || product.dietary.some(d => d.toLowerCase().includes(selectedDietary));
    return matchesCategory && matchesSearch && matchesDietary;
  });

  return (
    <section id="menu-section" style={{ padding: '60px 0', background: 'var(--color-bg)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
          <span className="badge badge-caramel" style={{ marginBottom: '12px' }}>Baked Fresh Daily</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Our Handcrafted Confections</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Every treat is prepared in small batches using premium single-origin ingredients, organic dairy, and authentic recipes.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '32px'
        }}>
          {CATEGORIES.map(cat => {
            const IconComp = ICON_MAP[cat.icon] || Sparkles;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: isActive ? 'var(--color-espresso)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-main)',
                  border: isActive ? '1px solid var(--color-espresso)' : '1px solid var(--color-border)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconComp size={16} color={isActive ? '#D4AF37' : 'var(--color-caramel)'} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Dietary Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '40px',
          padding: '16px 24px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--color-text-muted)" />
            <input 
              type="text"
              placeholder="Search cheesecakes, tiramisu, muffins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-main)'
              }}
            />
          </div>

          {/* Dietary Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Dietary:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'gluten', label: 'Gluten-Free' },
              { id: 'nut', label: 'Nut-Free' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedDietary(filter.id)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: selectedDietary === filter.id ? 'var(--color-cream)' : 'transparent',
                  color: selectedDietary === filter.id ? 'var(--color-caramel)' : 'var(--color-text-muted)',
                  border: selectedDietary === filter.id ? '1px solid var(--color-caramel)' : '1px solid transparent'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No confections found matching your filters.</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSelectedDietary('all'); }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={() => onSelectProduct(product)}
                onAddToCart={(type) => onAddToCart(product, type)}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

function ProductCard({ product, onSelect, onAddToCart }) {
  const [optionType, setOptionType] = useState(product.priceSlice ? 'slice' : 'whole');
  const activePrice = optionType === 'slice' ? product.priceSlice : product.priceWhole;

  return (
    <div className="animate-fade-in" style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    >
      {/* Product Image Header */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Badge */}
        {product.badge && (
          <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
            <span className="badge badge-gold">{product.badge}</span>
          </div>
        )}

        {/* Quick View Button Overlay */}
        <button 
          onClick={onSelect}
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--color-espresso)'
          }}
        >
          <Eye size={15} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Prep Time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-caramel)', fontWeight: 600 }}>{product.prepTime}</span>
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', cursor: 'pointer' }} onClick={onSelect}>
          {product.name}
        </h3>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--color-text-muted)',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {product.description}
        </p>

        {/* Option Switcher (Slice vs Whole / 6-Pack for Muffins) */}
        {product.priceSlice && (
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--color-cream-light)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            border: '1px solid var(--color-border)'
          }}>
            <button
              onClick={() => setOptionType('slice')}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: optionType === 'slice' ? '#FFFFFF' : 'transparent',
                color: optionType === 'slice' ? 'var(--color-espresso)' : 'var(--color-text-muted)',
                boxShadow: optionType === 'slice' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              {product.category === 'muffins' ? 'Single Muffin' : product.category === 'cookies' ? 'Single Cookie' : 'Single Slice'} (${product.priceSlice.toFixed(2)})
            </button>
            <button
              onClick={() => setOptionType('whole')}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: optionType === 'whole' ? '#FFFFFF' : 'transparent',
                color: optionType === 'whole' ? 'var(--color-espresso)' : 'var(--color-text-muted)',
                boxShadow: optionType === 'whole' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              {product.category === 'muffins' || product.category === 'cookies' ? '6-Pack Box' : 'Full Cake'} (${product.priceWhole.toFixed(2)})
            </button>
          </div>
        )}

        {/* Price & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-espresso)' }}>
              ${activePrice.toFixed(2)}
            </span>
          </div>

          <button 
            onClick={() => onAddToCart(optionType)}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>
    </div>
  );
}
