import React, { useState } from 'react';
import { CUSTOMIZER_OPTIONS } from '../data/bakeryData';
import { Cake, Sparkles, Check, ChevronRight, ShoppingBag, Info } from 'lucide-react';

export default function Customizer({ onAddToCart }) {
  const [selectedBase, setSelectedBase] = useState(CUSTOMIZER_OPTIONS.bases[0]);
  const [selectedSize, setSelectedSize] = useState(CUSTOMIZER_OPTIONS.sizes[1]);
  const [selectedFilling, setSelectedFilling] = useState(CUSTOMIZER_OPTIONS.fillings[0]);
  const [selectedToppings, setSelectedToppings] = useState([CUSTOMIZER_OPTIONS.toppings[0]]);
  const [inscription, setInscription] = useState('Happy Birthday!');

  // Price Calculation Formula: (Base Size + Flavor Extra + Filling Extra + Toppings Extra)
  const toppingsTotal = selectedToppings.reduce((sum, top) => sum + top.price, 0);
  const totalPrice = selectedSize.basePrice + selectedBase.price + selectedFilling.price + toppingsTotal;

  const toggleTopping = (topping) => {
    if (selectedToppings.some(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddCustomCake = () => {
    const customItem = {
      id: `custom-cake-${Date.now()}`,
      name: `Custom ${selectedBase.name} (${selectedSize.name})`,
      category: 'cakes',
      isCustom: true,
      priceWhole: totalPrice,
      totalPrice: totalPrice,
      quantity: 1,
      image: '/images/celebration_cake_1786065271462.jpg',
      customDetails: {
        base: selectedBase.name,
        size: selectedSize.name,
        filling: selectedFilling.name,
        toppings: selectedToppings.map(t => t.name).join(', '),
        inscription: inscription
      }
    };

    onAddToCart(customItem, 'whole');
  };

  return (
    <section id="customizer-section" style={{ padding: '60px 0', background: 'radial-gradient(circle at 20% 80%, #F5EBE1 0%, #FAF7F2 60%)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            <Sparkles size={14} />
            <span>Interactive Bespoke Studio</span>
          </span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Build Your Custom Dream Cake</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Select your preferred flavor base, cake size, handcrafted fillings, and artisanal toppings. Watch your custom price update live!
          </p>
        </div>

        {/* Builder Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Left: Step Options Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Step 1: Base Flavor */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-caramel)',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>1</span>
                <span>Select Cake Base & Flavor</span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Choose the foundation sponge or cheesecake base.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {CUSTOMIZER_OPTIONS.bases.map(base => {
                  const isSelected = selectedBase.id === base.id;
                  return (
                    <div
                      key={base.id}
                      onClick={() => setSelectedBase(base)}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-cream-light)' : '#FFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-espresso)' }}>{base.name}</span>
                        {base.price > 0 && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-caramel)', fontWeight: 700 }}>+${base.price}</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{base.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Size & Servings */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-caramel)',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>2</span>
                <span>Select Size & Guest Servings</span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Determine dimensions based on your celebration.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {CUSTOMIZER_OPTIONS.sizes.map(size => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <div
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-cream-light)' : '#FFF',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-espresso)', marginBottom: '4px' }}>{size.name}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--color-caramel)', fontWeight: 800 }}>${size.basePrice} Base</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Filling */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-caramel)',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>3</span>
                <span>Layer Filling & Cream</span>
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                {CUSTOMIZER_OPTIONS.fillings.map(filling => {
                  const isSelected = selectedFilling.id === filling.id;
                  return (
                    <button
                      key={filling.id}
                      onClick={() => setSelectedFilling(filling)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-cream-light)' : '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        color: 'var(--color-espresso)'
                      }}
                    >
                      <span>{filling.name}</span>
                      <span style={{ color: 'var(--color-caramel)' }}>
                        {filling.price > 0 ? `+$${filling.price}` : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Toppings & Plaque */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-caramel)',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>4</span>
                <span>Toppings & Custom Plaque</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0 24px 0' }}>
                {CUSTOMIZER_OPTIONS.toppings.map(topping => {
                  const isSelected = selectedToppings.some(t => t.id === topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-gold-light)' : '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: 'var(--color-espresso)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSelected && <Check size={14} color="#8A6D0B" />}
                        <span>{topping.name}</span>
                      </div>
                      <span style={{ color: '#8A6D0B', fontWeight: 700 }}>+${topping.price}</span>
                    </button>
                  );
                })}
              </div>

              {/* Chocolate Plaque Inscription */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                  Hand-Piped Chocolate Plaque Inscription:
                </label>
                <input 
                  type="text"
                  placeholder="e.g., Happy 30th Birthday Sarah!"
                  value={inscription}
                  onChange={(e) => setInscription(e.target.value)}
                  maxLength={40}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

          </div>

          {/* Right: Live Summary & Price Card */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              backgroundColor: 'var(--color-espresso)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle background glow */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.15)',
                filter: 'blur(30px)'
              }}></div>

              <div className="badge badge-gold" style={{ marginBottom: '16px' }}>
                Live Bespoke Specs
              </div>

              <h3 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>
                Your Custom Cake
              </h3>

              {/* Live Spec Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ opacity: 0.8 }}>Base Flavor:</span>
                  <span style={{ fontWeight: 600, color: '#F9F1D8' }}>{selectedBase.name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ opacity: 0.8 }}>Size:</span>
                  <span style={{ fontWeight: 600, color: '#F9F1D8' }}>{selectedSize.name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ opacity: 0.8 }}>Filling:</span>
                  <span style={{ fontWeight: 600, color: '#F9F1D8' }}>{selectedFilling.name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ opacity: 0.8 }}>Toppings:</span>
                  <span style={{ fontWeight: 600, color: '#F9F1D8', textAlign: 'right', maxWidth: '160px' }}>
                    {selectedToppings.length > 0 ? selectedToppings.map(t => t.name).join(', ') : 'None'}
                  </span>
                </div>

                {inscription && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ opacity: 0.8 }}>Plaque Text:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-gold)', fontStyle: 'italic' }}>"{inscription}"</span>
                  </div>
                )}
              </div>

              {/* Price Calculation Box */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ fontSize: '1rem', opacity: '0.9' }}>Total Custom Price:</span>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-gold)' }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Add to Cart CTA */}
              <button 
                onClick={handleAddCustomCake}
                className="btn-gold"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', fontSize: '1rem' }}
              >
                <ShoppingBag size={18} />
                <span>Add Custom Creation to Cart</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', opacity: 0.7, marginTop: '16px', justifyContent: 'center' }}>
                <Info size={14} />
                <span>Requires 48h advance baking notice</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
