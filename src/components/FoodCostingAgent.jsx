import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, TrendingUp, Award, Percent, ChevronRight, X, Sparkles, ShieldCheck, Edit3, Save, RotateCcw } from 'lucide-react';

const INITIAL_RECIPE_COST_DATA = [
  {
    id: 'artisan-cheesecake',
    name: 'Classic Artisan Cheesecake',
    category: 'cheesecakes',
    sellingWhole: 42.00,
    sellingSlice: 7.50,
    yieldSlices: 8,
    ingredientsBreakdown: [
      { name: 'Organic Block Cream Cheese (3 lbs)', cost: 5.62 },
      { name: 'Pure Vanilla Extract & Lemon Zest', cost: 1.10 },
      { name: 'Unsalted Butter & Graham Crust', cost: 1.80 },
      { name: 'Farm Eggs & Sugar', cost: 1.40 },
      { name: 'Packaging (Custom Box & Gold Board)', cost: 1.28 }
    ]
  },
  {
    id: 'venetian-tiramisu',
    name: 'Classic Venetian Tiramisu',
    category: 'tiramisu',
    sellingWhole: 48.00,
    sellingSlice: 8.50,
    yieldSlices: 8,
    ingredientsBreakdown: [
      { name: 'Italian Mascarpone Cheese', cost: 5.80 },
      { name: 'Savoiardi Ladyfinger Biscuits', cost: 2.90 },
      { name: 'Dark Roast Espresso & Cocoa Powder', cost: 1.50 },
      { name: 'Heavy Cream & Egg Yolks', cost: 1.40 },
      { name: 'Tray Packaging & Gold Ribbon', cost: 1.20 }
    ]
  },
  {
    id: 'blueberry-muffins',
    name: 'Wild Blueberry Streusel Muffins',
    category: 'muffins',
    sellingWhole: 24.00,
    sellingSlice: 4.50,
    yieldSlices: 6,
    ingredientsBreakdown: [
      { name: 'Fresh Wild Blueberries (1 Pint)', cost: 2.10 },
      { name: 'Organic Flour & Brown Sugar', cost: 1.10 },
      { name: 'Unsalted Butter Streusel', cost: 1.00 },
      { name: 'Eggs & Dairy', cost: 0.60 },
      { name: 'Bakery Box & Liners', cost: 0.60 }
    ]
  },
  {
    id: 'chocolate-cookies',
    name: 'Gourmet Chocolate Chip Cookies',
    category: 'cookies',
    sellingWhole: 18.00,
    sellingSlice: 3.50,
    yieldSlices: 6,
    ingredientsBreakdown: [
      { name: 'Gourmet Dark Chocolate Chunks (60%+)', cost: 1.80 },
      { name: 'Real Creamery Butter', cost: 0.90 },
      { name: 'Organic Flour & Brown Sugar', cost: 0.60 },
      { name: 'Vanilla & Eggs', cost: 0.30 },
      { name: 'Cookie Pouch & Label', cost: 0.30 }
    ]
  }
];

export default function FoodCostingAgent({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Load custom recipe costs from localStorage or default
  const [recipes, setRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem('julians_custom_food_costs');
      return saved ? JSON.parse(saved) : INITIAL_RECIPE_COST_DATA;
    } catch (e) {
      return INITIAL_RECIPE_COST_DATA;
    }
  });

  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0].id);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('julians_custom_food_costs', JSON.stringify(recipes));
    } catch (e) {
      console.error('Failed to save custom food costs', e);
    }
  }, [recipes]);

  const currentRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];

  // Live total batch cost calculation
  const totalBatchCost = currentRecipe.ingredientsBreakdown.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
  const sliceCost = totalBatchCost / (currentRecipe.yieldSlices || 1);

  const wholeProfit = currentRecipe.sellingWhole - totalBatchCost;
  const wholeMarginPercent = currentRecipe.sellingWhole > 0 ? ((wholeProfit / currentRecipe.sellingWhole) * 100).toFixed(1) : '0';

  const sliceProfit = currentRecipe.sellingSlice - sliceCost;
  const sliceMarginPercent = currentRecipe.sellingSlice > 0 ? ((sliceProfit / currentRecipe.sellingSlice) * 100).toFixed(1) : '0';

  // Handle price edits
  const handleUpdatePrice = (field, val) => {
    const num = parseFloat(val) || 0;
    setRecipes(prev => prev.map(r => {
      if (r.id === selectedRecipeId) {
        return { ...r, [field]: num };
      }
      return r;
    }));
  };

  // Handle ingredient cost edit
  const handleUpdateIngredientCost = (index, val) => {
    const num = parseFloat(val) || 0;
    setRecipes(prev => prev.map(r => {
      if (r.id === selectedRecipeId) {
        const updatedBreakdown = [...r.ingredientsBreakdown];
        updatedBreakdown[index].cost = num;
        return { ...r, ingredientsBreakdown: updatedBreakdown };
      }
      return r;
    }));
  };

  // Reset to initial defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all recipe food costs back to initial defaults?')) {
      setRecipes(INITIAL_RECIPE_COST_DATA);
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
      zIndex: 275,
      padding: '24px'
    }} onClick={onClose}>

      <div className="animate-fade-in" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '760px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          backgroundColor: 'var(--color-espresso)',
          color: '#FFFFFF',
          padding: '24px 32px',
          borderBottom: '2px solid var(--color-caramel)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <Edit3 size={24} color="#D4AF37" />
            <h3 style={{ color: '#FFFFFF', fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
              🤖 Interactive Food Cost & Profit Margin Calculator
            </h3>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', margin: 0 }}>
            Edit your exact ingredient costs below — net profits and margin percentages update in real-time!
          </p>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Recipe Selector Bar & Reset */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: selectedRecipeId === recipe.id ? 'var(--color-espresso)' : 'var(--color-cream-light)',
                    color: selectedRecipeId === recipe.id ? '#FFF' : 'var(--color-espresso)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {recipe.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleResetDefaults}
              style={{
                backgroundColor: 'none',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Price Adjustment Controls */}
          <div style={{
            backgroundColor: 'var(--color-cream-light)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                Selling Price (Whole / Box):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, color: 'var(--color-caramel)' }}>$</span>
                <input 
                  type="number"
                  step="0.50"
                  value={currentRecipe.sellingWhole}
                  onChange={e => handleUpdatePrice('sellingWhole', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontWeight: 800, fontSize: '1rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                Selling Price (Single Slice / Item):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, color: 'var(--color-caramel)' }}>$</span>
                <input 
                  type="number"
                  step="0.25"
                  value={currentRecipe.sellingSlice}
                  onChange={e => handleUpdatePrice('sellingSlice', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontWeight: 800, fontSize: '1rem' }}
                />
              </div>
            </div>
          </div>

          {/* Profit Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            
            {/* Whole Bake / Box Stats */}
            <div style={{
              backgroundColor: wholeProfit >= 0 ? 'rgba(45, 122, 66, 0.06)' : 'rgba(217, 107, 67, 0.08)',
              border: wholeProfit >= 0 ? '1.5px solid #2D7A42' : '1.5px solid #D96B43',
              borderRadius: 'var(--radius-md)',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2D7A42', textTransform: 'uppercase' }}>
                  Whole Bake / 6-Pack Box
                </span>
                <span className="badge badge-gold">{wholeMarginPercent}% Profit</span>
              </div>

              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-espresso)', marginBottom: '4px' }}>
                ${wholeProfit.toFixed(2)} Net Profit
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Retail: <strong>${currentRecipe.sellingWhole.toFixed(2)}</strong> • Batch Cost: <strong>${totalBatchCost.toFixed(2)}</strong>
              </div>
            </div>

            {/* Single Slice / Single Item Stats */}
            <div style={{
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
              border: '1.5px solid #D4AF37',
              borderRadius: 'var(--radius-md)',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8A6D0B', textTransform: 'uppercase' }}>
                  Single Slice / Single Item
                </span>
                <span className="badge badge-gold">{sliceMarginPercent}% Profit</span>
              </div>

              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-espresso)', marginBottom: '4px' }}>
                ${sliceProfit.toFixed(2)} Net Profit
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Retail: <strong>${currentRecipe.sellingSlice.toFixed(2)}</strong> • Slice Cost: <strong>${sliceCost.toFixed(2)}</strong>
              </div>
            </div>

          </div>

          {/* Editable Ingredient Cost Breakdown Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-espresso)', marginBottom: '14px', fontWeight: 800 }}>
              📝 Edit Raw Material & Packaging Costs for "{currentRecipe.name}":
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentRecipe.ingredientsBreakdown.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-cream-light)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  border: '1px solid var(--color-border)'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>{item.name}</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-caramel)' }}>$</span>
                    <input 
                      type="number"
                      step="0.10"
                      value={item.cost}
                      onChange={e => handleUpdateIngredientCost(idx, e.target.value)}
                      style={{
                        width: '90px',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontWeight: 800,
                        textAlign: 'right',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid var(--color-border)',
              paddingTop: '14px',
              marginTop: '16px',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--color-espresso)'
            }}>
              <span>Total Calculated Batch Cost</span>
              <span style={{ color: 'var(--color-caramel)' }}>${totalBatchCost.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
