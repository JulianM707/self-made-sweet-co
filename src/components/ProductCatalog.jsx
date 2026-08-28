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
          <span className="badge badge-caramel" style={{ marginBottom: '12px' }}>Baked Fresh Daily by Julian</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>My Handcrafted Bakes</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Every treat is personally handcrafted by me in small batches using premium organic ingredients, real cream cheese, and house recipes.
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
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
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
                  border: selectedDietary === filter.id ? '1px solid var(--color-caramel)' : '1px solid transparent',
                  cursor: 'pointer'
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
            <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No bakes found matching your filters.</p>
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
              <div 
                key={product.id}
                className="card-interactive"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Product Image & Badges */}
                <div style={{ position: 'relative', height: '230px', overflow: 'hidden', backgroundColor: 'var(--color-cream-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: product.id === 'chocolate-chip-cookie' ? 'contain' : 'cover',
                      padding: product.id === 'chocolate-chip-cookie' ? '8px' : 0
                    }}
                  />
                  {product.isOutOfStock ? (
                    <span style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#E53E3E', color: '#FFF', fontWeight: 800, padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      🔴 Temporarily Sold Out
                    </span>
                  ) : product.badge && (
                    <span className="badge badge-gold" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      style={{
                        fontSize: '1.3rem',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        color: 'var(--color-espresso)'
                      }}
                    >
                      {product.name}
                    </h3>

                    <p style={{
                      color: 'var(--color-text-muted)',
                      fontSize: '0.9rem',
                      lineHeight: 1.55,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing & Add Actions */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                      marginBottom: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--color-border)'
                    }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-espresso)' }}>
                        ${product.priceSlice.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        / Slice • ${product.priceWhole.toFixed(2)} Whole
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                      <button 
                        onClick={() => onSelectProduct(product)}
                        className="btn-secondary"
                        style={{ padding: '10px', fontSize: '0.85rem' }}
                      >
                        <Eye size={15} />
                        <span>Details</span>
                      </button>

                      <button 
                        onClick={() => !product.isOutOfStock && onAddToCart(product, 'slice')}
                        disabled={product.isOutOfStock}
                        className={product.isOutOfStock ? "btn-secondary" : "btn-primary"}
                        style={{ 
                          padding: '10px', 
                          fontSize: '0.85rem',
                          opacity: product.isOutOfStock ? 0.6 : 1,
                          cursor: product.isOutOfStock ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Plus size={15} />
                        <span>{product.isOutOfStock ? 'Sold Out' : 'Add Slice'}</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
