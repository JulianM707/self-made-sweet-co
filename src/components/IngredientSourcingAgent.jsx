import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, TrendingDown, Award, DollarSign, ExternalLink, CheckCircle2, Sparkles, Filter, RefreshCw, X, Store, Loader2, Calendar } from 'lucide-react';
import { fetchLiveSacramentoPrices } from '../services/livePriceScraper';

// Initial Baseline Database for Sacramento Bakery Ingredients
const INITIAL_SUPPLIERS_DATA = [
  {
    id: 'cream-cheese',
    ingredient: 'Organic Block Cream Cheese',
    category: 'Dairy',
    usedFor: 'Classic Artisan Cheesecake',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "Costco Business Center (Sacramento)", price: "$14.49", unit: "3 lb block (48 oz)", unitPrice: "$4.83 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.8/5", inStock: true, notes: "Real block cream cheese, ideal for dense baking." },
      { name: "US Foods Chef's'Store (Sacramento)", price: "$15.99", unit: "3 lb block", unitPrice: "$5.33 / lb", badge: "Commercial Grade", qualityScore: "4.7/5", inStock: true, notes: "Low moisture content for slow bakes." },
      { name: "Trader Joe's (Sacramento)", price: "$2.89", unit: "8 oz block", unitPrice: "$5.78 / lb", badge: "Organic Choice", qualityScore: "4.9/5", inStock: true, notes: "Ultra creamy texture, great for small batches." }
    ]
  },
  {
    id: 'blueberries',
    ingredient: 'Fresh Wild Blueberries',
    category: 'Produce',
    usedFor: 'Wild Blueberry Streusel Muffins',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "Costco Wholesale (Sacramento)", price: "$6.49", unit: "18 oz container", unitPrice: "$5.76 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.9/5", inStock: true, notes: "Plump & sweet, perfect fruit distribution in batter." },
      { name: "Trader Joe's", price: "$4.79", unit: "12 oz package", unitPrice: "$6.38 / lb", badge: "Organic Choice", qualityScore: "4.8/5", inStock: true, notes: "Smaller berries, excellent cinnamon pairing." },
      { name: "Restaurant Depot", price: "$22.50", unit: "4 lb flat", unitPrice: "$5.62 / lb", badge: "Bulk Flat", qualityScore: "4.6/5", inStock: true, notes: "Best for heavy weekend production runs." }
    ]
  },
  {
    id: 'mascarpone',
    ingredient: 'Italian Mascarpone Cheese',
    category: 'Dairy',
    usedFor: 'Classic Venetian Tiramisu',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "US Foods Chef's'Store", price: "$12.49", unit: "16 oz tub", unitPrice: "$12.49 / lb", badge: "Authentic Import 🇮🇹", qualityScore: "5.0/5", inStock: true, notes: "100% Italian cream, velvet smooth whip." },
      { name: "Trader Joe's", price: "$4.29", unit: "8 oz tub", unitPrice: "$8.58 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.7/5", inStock: true, notes: "Great consistency for whipped mascarpone cream." },
      { name: "Whole Foods Market", price: "$7.49", unit: "8 oz tub", unitPrice: "$14.98 / lb", badge: "Premium Organic", qualityScore: "4.9/5", inStock: true, notes: "Ultra rich fat content." }
    ]
  },
  {
    id: 'chocolate-chunks',
    ingredient: 'Gourmet Dark Chocolate Chunks (60%+)',
    category: 'Pantry',
    usedFor: 'Gourmet Chocolate Chip Cookies',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "Costco Business Center", price: "$17.99", unit: "5 lb bag", unitPrice: "$3.60 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.9/5", inStock: true, notes: "Gourmet melt, holds shape with gooey center." },
      { name: "WebstaurantStore Bulk", price: "$39.99", unit: "10 lb box (Valrhona/Guittard)", unitPrice: "$4.00 / lb", badge: "Pastry Chef Choice", qualityScore: "5.0/5", inStock: true, notes: "Premium French chocolate callets." }
    ]
  },
  {
    id: 'butter',
    ingredient: 'Unsalted Creamery Butter',
    category: 'Dairy',
    usedFor: 'Streusel Crumbles & Crusts',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "Costco Wholesale", price: "$11.99", unit: "4 lb (4 pack)", unitPrice: "$3.00 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.8/5", inStock: true, notes: "Real Grade AA creamery butter." },
      { name: "US Foods Chef's'Store", price: "$13.80", unit: "4 lb case", unitPrice: "$3.45 / lb", badge: "Restaurant Grade", qualityScore: "4.7/5", inStock: true, notes: "High butterfat ratio for flaky streusel." }
    ]
  }
];

export default function IngredientSourcingAgent({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sourcingData, setSourcingData] = useState(INITIAL_SUPPLIERS_DATA);
  const [isScanning, setIsScanning] = useState(false);

  const handleRunLiveScraper = async () => {
    setIsScanning(true);
    const liveResults = await fetchLiveSacramentoPrices();
    setSourcingData(liveResults);
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen) {
      handleRunLiveScraper();
    }
  }, [isOpen]);

  const filteredData = sourcingData.filter(item => {
    const matchesSearch = item.ingredient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.usedFor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

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
      zIndex: 270,
      padding: '24px'
    }} onClick={onClose}>

      <div className="animate-fade-in" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '780px',
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <Calendar size={26} color="#D4AF37" />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  🤖 Automated Daily Sacramento Price Scraping Agent
                </h3>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', margin: 0 }}>
                Scrapes daily Sacramento store market prices (*Costco, Chef's'Store, Trader Joe's*).
              </p>
            </div>

            <button
              onClick={handleRunLiveScraper}
              disabled={isScanning}
              style={{
                backgroundColor: 'var(--color-caramel)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isScanning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Running Daily Scan...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>🔄 Refresh Daily Scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Search & Category Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px', padding: '10px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
              <Search size={18} color="var(--color-text-muted)" />
              <input 
                type="text"
                placeholder="Search cream cheese, mascarpone, blueberries..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', background: 'transparent' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'dairy', 'produce', 'pantry'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    backgroundColor: selectedCategory === cat ? 'var(--color-espresso)' : '#FFF',
                    color: selectedCategory === cat ? '#FFF' : 'var(--color-espresso)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {filteredData.map(item => (
              <div key={item.id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Item Banner Header */}
                <div style={{
                  backgroundColor: 'var(--color-cream-light)',
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--color-espresso)', margin: 0, fontWeight: 800 }}>
                      {item.ingredient}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-caramel)', fontWeight: 600 }}>
                      Key Bake: {item.usedFor} • <strong>{item.lastScraped}</strong>
                    </span>
                  </div>

                  <span className="badge badge-gold">{item.category}</span>
                </div>

                {/* Suppliers Table */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {item.suppliers.map((sup, idx) => (
                    <div key={idx} style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: sup.badge.includes('🏆') ? 'rgba(212, 175, 55, 0.08)' : '#FFF',
                      border: sup.badge.includes('🏆') ? '1px solid #D4AF37' : '1px solid var(--color-border)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-espresso)' }}>{sup.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-caramel)', fontWeight: 700, margin: '2px 0' }}>
                          🔍 {sup.scannedProductName || sup.productBrand || sup.name} {sup.skuNumber ? `(${sup.skuNumber})` : ''}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sup.notes}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Package</div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{sup.unit} ({sup.price})</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Unit Price</div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-espresso)' }}>{sup.unitPrice}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-gold" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                          {sup.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
