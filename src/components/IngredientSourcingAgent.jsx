import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, TrendingDown, Award, DollarSign, ExternalLink, CheckCircle2, Sparkles, Filter, RefreshCw, X, Store, Loader2, Calendar, Edit3, Save, RotateCcw } from 'lucide-react';
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
      { name: "Costco Business Center (Sacramento)", productBrand: "Kirkland Signature", scannedProductName: "Kirkland Signature Real Block Cream Cheese (3 lb / 48 oz)", skuNumber: "Item #948210", price: "$14.49", unit: "3 lb block (48 oz)", unitPrice: "$4.83 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.8/5", inStock: true, notes: "Real block cream cheese, ideal for dense baking." },
      { name: "US Foods Chef's'Store (Sacramento)", productBrand: "Glenview Farms", scannedProductName: "Glenview Farms Commercial Cream Cheese Loaf", skuNumber: "SKU #742019", price: "$15.99", unit: "3 lb loaf", unitPrice: "$5.33 / lb", badge: "Commercial Grade", qualityScore: "4.7/5", inStock: true, notes: "Low moisture content for cheesecakes." },
      { name: "Trader Joe's (Sacramento)", productBrand: "Trader Joe's Organic", scannedProductName: "Trader Joe's Organic Pasteurized Cream Cheese", skuNumber: "TJ #004921", price: "$2.89", unit: "8 oz block", unitPrice: "$5.78 / lb", badge: "Organic Choice", qualityScore: "4.9/5", inStock: true, notes: "Ultra creamy texture, great for small batches." }
    ]
  },
  {
    id: 'blueberries',
    ingredient: 'Fresh Wild Blueberries',
    category: 'Produce',
    usedFor: 'Wild Blueberry Streusel Muffins',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "Costco Wholesale (Sacramento)", productBrand: "Driscoll's / Ocean Spray", scannedProductName: "Fresh Organic Wild Blueberries 18 oz Clamshell", skuNumber: "Item #401129", price: "$6.49", unit: "18 oz container", unitPrice: "$5.76 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.9/5", inStock: true, notes: "Plump & sweet, perfect fruit distribution in batter." },
      { name: "Trader Joe's", productBrand: "Trader Joe's Produce", scannedProductName: "Trader Joe's Organic Jumbo Blueberries", skuNumber: "TJ #008812", price: "$4.79", unit: "12 oz package", unitPrice: "$6.38 / lb", badge: "Organic Choice", qualityScore: "4.8/5", inStock: true, notes: "Smaller berries, excellent cinnamon pairing." },
      { name: "Restaurant Depot", productBrand: "Fresh Farms Wholesale", scannedProductName: "Fresh Wild Blueberry Bakery Flat (4 lb)", skuNumber: "RD #339102", price: "$22.50", unit: "4 lb flat", unitPrice: "$5.62 / lb", badge: "Bulk Flat", qualityScore: "4.6/5", inStock: true, notes: "Best for heavy weekend production runs." }
    ]
  },
  {
    id: 'mascarpone',
    ingredient: 'Italian Mascarpone Cheese',
    category: 'Dairy',
    usedFor: 'Classic Venetian Tiramisu',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "US Foods Chef's'Store", productBrand: "Galbani Santa Lucia", scannedProductName: "Galbani Italian Imported Mascarpone Cheese 16 oz", skuNumber: "SKU #589100", price: "$12.49", unit: "16 oz tub", unitPrice: "$12.49 / lb", badge: "Authentic Import 🇮🇹", qualityScore: "5.0/5", inStock: true, notes: "100% Italian cream, velvet smooth whip." },
      { name: "Trader Joe's", productBrand: "Trader Joe's", scannedProductName: "Trader Joe's Italian Mascarpone Cheese", skuNumber: "TJ #003194", price: "$4.29", unit: "8 oz tub", unitPrice: "$8.58 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.7/5", inStock: true, notes: "Great consistency for whipped mascarpone cream." },
      { name: "Whole Foods Market", productBrand: "BelGioioso", scannedProductName: "BelGioioso Artisanal Fresh Mascarpone 8 oz", skuNumber: "WF #991023", price: "$7.49", unit: "8 oz tub", unitPrice: "$14.98 / lb", badge: "Premium Organic", qualityScore: "4.9/5", inStock: true, notes: "Ultra rich fat content." }
    ]
  },
  {
    id: 'chocolate-chunks',
    ingredient: 'Gourmet Dark Chocolate Chips / Chunks',
    category: 'Pantry',
    usedFor: 'Gourmet Chocolate Chip Cookies',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "Costco Business Center (Sacramento)", productBrand: "Kirkland Signature", scannedProductName: "Kirkland Signature Semi-Sweet Chocolate Chips (4.5 lb / 72 oz)", skuNumber: "Item #1324792", price: "$12.99", unit: "4.5 lb bag (72 oz)", unitPrice: "$2.89 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.8/5", inStock: true, notes: "Real 51% cacao semi-sweet baking chips." },
      { name: "Costco Business Center (Sacramento)", productBrand: "Nestlé Toll House", scannedProductName: "Nestlé Toll House Semi-Sweet Morsels (72 oz)", skuNumber: "Item #274889", price: "$14.99", unit: "4.5 lb bag", unitPrice: "$3.33 / lb", badge: "Name Brand Classic", qualityScore: "4.7/5", inStock: true, notes: "Classic bakery morsels." },
      { name: "US Foods Chef's'Store (Sacramento)", productBrand: "Hershey's Special Dark", scannedProductName: "Hershey's Special Dark Mildly Sweet Chocolate Chips 5 lb", skuNumber: "SKU #88201", price: "$18.50", unit: "5 lb bag", unitPrice: "$3.70 / lb", badge: "Commercial Grade", qualityScore: "4.8/5", inStock: true, notes: "Rich dark chocolate flavor." }
    ]
  },
  {
    id: 'butter',
    ingredient: 'Unsalted Creamery Butter',
    category: 'Dairy',
    usedFor: 'Streusel Crumbles & Crusts',
    lastScraped: 'Baseline Daily Market Price',
    suppliers: [
      { name: "Costco Wholesale (Sacramento)", productBrand: "Kirkland Signature", scannedProductName: "Kirkland Signature Grade AA Unsalted Butter 4/1 lb", skuNumber: "Item #218391", price: "$11.99", unit: "4 lb (4 pack)", unitPrice: "$3.00 / lb", badge: "Daily Best Deal 🏆", qualityScore: "4.8/5", inStock: true, notes: "Real Grade AA creamery butter." },
      { name: "US Foods Chef's'Store (Sacramento)", productBrand: "Darigold", scannedProductName: "Darigold Commercial Unsalted Butter 4 lb Case", skuNumber: "SKU #109244", price: "$13.80", unit: "4 lb case", unitPrice: "$3.45 / lb", badge: "Restaurant Grade", qualityScore: "4.7/5", inStock: true, notes: "High butterfat ratio for flaky streusel." }
    ]
  }
];

export default function IngredientSourcingAgent({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Load custom saved prices from localStorage or initial
  const [sourcingData, setSourcingData] = useState(() => {
    try {
      const saved = localStorage.getItem('julians_custom_sourcing_prices');
      return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS_DATA;
    } catch (e) {
      return INITIAL_SUPPLIERS_DATA;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('julians_custom_sourcing_prices', JSON.stringify(sourcingData));
    } catch (e) {
      console.error('Failed to save custom sourcing prices', e);
    }
  }, [sourcingData]);

  const handleRunLiveScraper = async () => {
    setIsScanning(true);
    const liveResults = await fetchLiveSacramentoPrices();
    setSourcingData(liveResults);
    setIsScanning(false);
  };

  // Handle live price editing for specific supplier
  const handleUpdateSupplierPrice = (ingredientId, supplierIdx, field, val) => {
    setSourcingData(prev => prev.map(item => {
      if (item.id === ingredientId) {
        const updatedSuppliers = [...item.suppliers];
        updatedSuppliers[supplierIdx] = {
          ...updatedSuppliers[supplierIdx],
          [field]: val
        };
        return { ...item, suppliers: updatedSuppliers };
      }
      return item;
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all supplier ingredient prices back to initial baseline?')) {
      setSourcingData(INITIAL_SUPPLIERS_DATA);
    }
  };

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
        maxWidth: '820px',
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

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  backgroundColor: isEditing ? '#D4AF37' : 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit3 size={15} />
                <span>{isEditing ? 'Done Editing' : '✏️ Edit Store Prices'}</span>
              </button>

              <button
                onClick={handleRunLiveScraper}
                disabled={isScanning}
                style={{
                  backgroundColor: 'var(--color-caramel)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isScanning ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} />
                    <span>🔄 Refresh Daily Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Search & Category Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
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

            <button
              onClick={handleResetDefaults}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={13} /> Reset
            </button>
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
                      gridTemplateColumns: isEditing ? '1.4fr 1fr 1fr 0.8fr' : '1.4fr 1fr 1fr 1.2fr',
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

                      {/* Package Price Field */}
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Package Price</div>
                        {isEditing ? (
                          <input 
                            type="text"
                            value={sup.price}
                            onChange={e => handleUpdateSupplierPrice(item.id, idx, 'price', e.target.value)}
                            style={{ width: '100%', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontWeight: 800 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{sup.unit} ({sup.price})</div>
                        )}
                      </div>

                      {/* Unit Price Field */}
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Unit Price ($/lb)</div>
                        {isEditing ? (
                          <input 
                            type="text"
                            value={sup.unitPrice}
                            onChange={e => handleUpdateSupplierPrice(item.id, idx, 'unitPrice', e.target.value)}
                            style={{ width: '100%', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontWeight: 800 }}
                          />
                        ) : (
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-espresso)' }}>{sup.unitPrice}</div>
                        )}
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
