import React, { useState } from 'react';
import { DollarSign, PieChart, TrendingUp, Award, Percent, ChevronRight, X, Sparkles, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/bakeryData';

// Recipe Cost & Margin Breakdown Database
const RECIPE_COST_DATA = [
  {
    id: 'artisan-cheesecake',
    name: 'Classic Artisan Cheesecake',
    category: 'cheesecakes',
    sellingWhole: 42.00,
    sellingSlice: 7.50,
    wholeRecipeCost: 11.20,
    sliceRecipeCost: 1.40,
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
    wholeRecipeCost: 12.80,
    sliceRecipeCost: 1.60,
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
    sellingWhole: 24.00, // 6-pack
    sellingSlice: 4.50, // single
    wholeRecipeCost: 5.40, // 6-pack cost
    sliceRecipeCost: 0.90,
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
    sellingWhole: 18.00, // 6-pack
    sellingSlice: 3.50, // single
    wholeRecipeCost: 3.90,
    sliceRecipeCost: 0.65,
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

  const [selectedRecipe, setSelectedRecipe] = useState(RECIPE_COST_DATA[0]);

  const wholeProfit = selectedRecipe.sellingWhole - selectedRecipe.wholeRecipeCost;
  const wholeMarginPercent = ((wholeProfit / selectedRecipe.sellingWhole) * 100).toFixed(1);

  const sliceProfit = selectedRecipe.sellingSlice - selectedRecipe.sliceRecipeCost;
  const sliceMarginPercent = ((sliceProfit / selectedRecipe.sellingSlice) * 100).toFixed(1);

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
        maxWidth: '720px',
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
            <TrendingUp size={26} color="#D4AF37" />
            <h3 style={{ color: '#FFFFFF', fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
              🤖 AI Food Costing & Profit Margin Optimizer
            </h3>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', margin: 0 }}>
            Live gross profit margin calculator and unit cost breakdown for your bakes.
          </p>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Recipe Selector Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
            {RECIPE_COST_DATA.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: selectedRecipe.id === recipe.id ? 'var(--color-espresso)' : 'var(--color-cream-light)',
                  color: selectedRecipe.id === recipe.id ? '#FFF' : 'var(--color-espresso)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {recipe.name}
              </button>
            ))}
          </div>

          {/* Profit Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            
            {/* Whole Cake / Box Stats */}
            <div style={{
              backgroundColor: 'rgba(45, 122, 66, 0.06)',
              border: '1.5px solid #2D7A42',
              borderRadius: 'var(--radius-md)',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2D7A42', textTransform: 'uppercase' }}>
                  Whole Bake / 6-Pack Box
                </span>
                <span className="badge badge-gold">{wholeMarginPercent}% Profit Margin</span>
              </div>

              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-espresso)', marginBottom: '4px' }}>
                ${wholeProfit.toFixed(2)} Net Profit
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Retail Price: <strong>${selectedRecipe.sellingWhole.toFixed(2)}</strong> • Food Cost: <strong>${selectedRecipe.wholeRecipeCost.toFixed(2)}</strong>
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
                <span className="badge badge-gold">{sliceMarginPercent}% Profit Margin</span>
              </div>

              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-espresso)', marginBottom: '4px' }}>
                ${sliceProfit.toFixed(2)} Net Profit
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Retail Price: <strong>${selectedRecipe.sellingSlice.toFixed(2)}</strong> • Cost: <strong>${selectedRecipe.sliceRecipeCost.toFixed(2)}</strong>
              </div>
            </div>

          </div>

          {/* Ingredient Cost Breakdown Table */}
          <div style={{ backgroundColor: 'var(--color-cream-light)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-espresso)', marginBottom: '14px', fontWeight: 800 }}>
              📋 Raw Material & Packaging Cost Breakdown:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedRecipe.ingredientsBreakdown.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  border: '1px solid var(--color-border)'
                }}>
                  <span>{item.name}</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-caramel)' }}>${item.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid var(--color-border)',
              paddingTop: '12px',
              marginTop: '16px',
              fontWeight: 800,
              fontSize: '1rem',
              color: 'var(--color-espresso)'
            }}>
              <span>Total Batch Cost</span>
              <span>${selectedRecipe.wholeRecipeCost.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
