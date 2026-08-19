import React, { useState } from 'react';
import { X, Star, Clock, Check, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const [optionType, setOptionType] = useState(product.priceSlice ? 'slice' : 'whole');
  const [selectedTopping, setSelectedTopping] = useState(
    product.toppingOptions ? product.toppingOptions[0] : null
  );
  const [selectedCrust, setSelectedCrust] = useState(
    product.crustOptions ? product.crustOptions[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');

  const basePrice = optionType === 'slice' ? product.priceSlice : product.priceWhole;
  const toppingExtra = selectedTopping ? selectedTopping.price : 0;
  const crustExtra = selectedCrust ? selectedCrust.price : 0;
  
  const unitPrice = basePrice + toppingExtra + crustExtra;
  const totalPrice = unitPrice * quantity;

  // Active Display Image (switch to strawberry image if strawberry topping selected)
  const activeImage = (selectedTopping && selectedTopping.image) ? selectedTopping.image : product.image;

  const handleAdd = () => {
    let customName = product.name;
    const detailsArray = [];
    if (selectedTopping && selectedTopping.id !== 'plain') {
      detailsArray.push(`Topping: ${selectedTopping.name}`);
    }
    if (selectedCrust && selectedCrust.id !== 'classic-crust') {
      detailsArray.push(`Crust: ${selectedCrust.name}`);
    }

    if (detailsArray.length > 0) {
      customName += ` (${detailsArray.join(', ')})`;
    }

    onAddToCart({
      ...product,
      name: customName,
      optionType,
      quantity,
      unitPrice,
      totalPrice,
      specialNotes,
      selectedTopping: selectedTopping ? selectedTopping.name : null,
      selectedCrust: selectedCrust ? selectedCrust.name : null
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(42, 27, 23, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '24px'
    }} onClick={onClose}>
      
      <div className="animate-fade-in modal-container grid-hero" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        boxShadow: 'var(--shadow-lg)'
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
            backgroundColor: 'rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-espresso)',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Left Side: Product Image */}
        <div style={{ position: 'relative', height: '100%', minHeight: '360px' }}>
          <img 
            src={activeImage} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {product.badge && (
            <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
              <span className="badge badge-gold">{product.badge}</span>
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Options */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Prep Time */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-caramel)', fontWeight: 600 }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {product.prepTime}
              </span>
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{product.name}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Portion Selector (Slice vs Whole / 6-Pack for Muffins) */}
            {product.priceSlice && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                  Select Portion Size:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setOptionType('slice')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: optionType === 'slice' ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                      backgroundColor: optionType === 'slice' ? 'var(--color-cream-light)' : '#FFF',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      {product.category === 'muffins' ? 'Single Muffin' : product.category === 'cookies' ? 'Single Cookie' : 'Single Portion'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-caramel)', fontWeight: 600 }}>${product.priceSlice.toFixed(2)}</div>
                  </button>

                  <button
                    onClick={() => setOptionType('whole')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: optionType === 'whole' ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                      backgroundColor: optionType === 'whole' ? 'var(--color-cream-light)' : '#FFF',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      {product.category === 'muffins' ? 'Half-Dozen Box (6 Muffins)' : product.category === 'cookies' ? '6-Pack Cookie Box (6 Cookies)' : 'Full Bake / Cake'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-caramel)', fontWeight: 600 }}>${product.priceWhole.toFixed(2)}</div>
                  </button>
                </div>
              </div>
            )}

            {/* Custom Fruit Topping Selector for Cheesecake */}
            {product.toppingOptions && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                  Choose Fruit Topping:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {product.toppingOptions.map(top => {
                    const isSelected = selectedTopping && selectedTopping.id === top.id;
                    return (
                      <button
                        key={top.id}
                        onClick={() => setSelectedTopping(top)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-cream-light)' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--color-espresso)'
                        }}
                      >
                        <span>{top.name}</span>
                        <span style={{ color: 'var(--color-caramel)' }}>{top.price > 0 ? `+$${top.price.toFixed(2)}` : 'Included'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Crust Selector for Cheesecake */}
            {product.crustOptions && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                  Choose Crust Type:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {product.crustOptions.map(crust => {
                    const isSelected = selectedCrust && selectedCrust.id === crust.id;
                    return (
                      <button
                        key={crust.id}
                        onClick={() => setSelectedCrust(crust)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-cream-light)' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--color-espresso)'
                        }}
                      >
                        <span>{crust.name}</span>
                        <span style={{ color: 'var(--color-caramel)' }}>{crust.price > 0 ? `+$${crust.price.toFixed(2)}` : 'Standard'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Special Instructions (Optional):
              </label>
              <input 
                type="text"
                placeholder="e.g., Extra strawberry sauce on side..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Footer: Quantity & Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
            
            {/* Quantity Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--color-cream)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)'
            }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'none', color: 'var(--color-espresso)' }}
              >
                <Minus size={15} />
              </button>
              <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ background: 'none', color: 'var(--color-espresso)' }}
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleAdd}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart (${totalPrice.toFixed(2)})</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
