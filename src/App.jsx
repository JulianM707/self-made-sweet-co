import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import ProductModal from './components/ProductModal';
import FlavorQuizModal from './components/FlavorQuizModal';
import AboutJulianModal from './components/AboutJulianModal';
import BakerLoginModal from './components/BakerLoginModal';
import CartDrawer from './components/CartDrawer';
import OrderStatusModal from './components/OrderStatusModal';
import BakerDashboard from './components/BakerDashboard';
import Footer from './components/Footer';
import { INITIAL_ORDERS, PRODUCTS } from './data/bakeryData';
import { ChefHat, LogOut, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isBakerLoginOpen, setIsBakerLoginOpen] = useState(false);
  
  // Detect ?admin=true or #admin in URL on load to prompt secret Baker Login
  useEffect(() => {
    const search = window.location.search;
    const hash = window.location.hash;
    if (search.includes('admin=true') || search.includes('baker=true') || hash === '#admin' || hash === '#baker') {
      setIsBakerLoginOpen(true);
    }
  }, []);

  // Persist cart items in localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('julians_bakery_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist orders in localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('julians_bakery_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeOrderTrack, setActiveOrderTrack] = useState(null);

  // Sync cartItems state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('julians_bakery_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync orders state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('julians_bakery_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Cart operations
  const handleAddToCart = (productOrCustomItem, portionType = 'slice') => {
    if (productOrCustomItem.isCustom) {
      setCartItems(prev => [...prev, productOrCustomItem]);
    } else {
      const unitPrice = portionType === 'slice' ? productOrCustomItem.priceSlice : productOrCustomItem.priceWhole;
      const existingIdx = cartItems.findIndex(
        item => item.id === productOrCustomItem.id && item.optionType === portionType && !item.isCustom
      );

      if (existingIdx > -1) {
        const updated = [...cartItems];
        updated[existingIdx].quantity += productOrCustomItem.quantity || 1;
        updated[existingIdx].totalPrice = updated[existingIdx].quantity * unitPrice;
        setCartItems(updated);
      } else {
        setCartItems(prev => [...prev, {
          ...productOrCustomItem,
          optionType: portionType,
          quantity: productOrCustomItem.quantity || 1,
          unitPrice: unitPrice,
          totalPrice: (productOrCustomItem.quantity || 1) * unitPrice
        }]);
      }
    }
    setIsCartOpen(true);
  };

  const handleUpdateQty = (index, newQty) => {
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    const unitPrice = updated[index].unitPrice || updated[index].priceWhole;
    updated[index].totalPrice = newQty * unitPrice;
    setCartItems(updated);
  };

  const handleRemoveItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleOrderPlaced = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setActiveOrderTrack(newOrder);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (activeOrderTrack && activeOrderTrack.id === orderId) {
      setActiveOrderTrack(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (activeOrderTrack && activeOrderTrack.id === orderId) {
      setActiveOrderTrack(null);
    }
  };

  const handleClearCompletedOrders = () => {
    setOrders(prev => prev.filter(o => o.status !== 'Completed'));
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Baker Admin Top Indicator Bar (Only visible when signed into Kitchen Portal) */}
      {isAdminMode && (
        <div style={{
          backgroundColor: '#2A1B17',
          color: '#FFFFFF',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          borderBottom: '1px solid #D4AF37'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChefHat size={16} color="#D4AF37" />
            <span style={{ fontWeight: 700, color: '#D4AF37' }}>Baker Kitchen Portal Active</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>• Signed in as julian@selfmadesweetco.com</span>
          </div>

          <button
            onClick={() => setIsAdminMode(false)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={13} />
            <span>Exit Kitchen Portal</span>
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar 
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Switching */}
      <main style={{ flex: 1 }}>
        {isAdminMode ? (
          /* Baker Admin View */
          <BakerDashboard 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onClearCompletedOrders={handleClearCompletedOrders}
            products={PRODUCTS}
          />
        ) : (
          /* Customer Bakery Experience */
          <>
            <Hero 
              onExploreMenu={() => {
                const elem = document.getElementById('menu-section');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAbout={() => setIsAboutOpen(true)}
            />
            <ProductCatalog 
              onSelectProduct={(product) => setSelectedProduct(product)}
              onAddToCart={(product, type) => handleAddToCart(product, type)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer 
        onOpenAbout={() => setIsAboutOpen(true)} 
        onOpenBakerLogin={() => setIsBakerLoginOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(item) => handleAddToCart(item, item.optionType)}
      />

      <FlavorQuizModal 
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAddToCart={(product, type) => handleAddToCart(product, type)}
      />

      <AboutJulianModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <BakerLoginModal
        isOpen={isBakerLoginOpen}
        onClose={() => setIsBakerLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminMode(true);
          setIsBakerLoginOpen(false);
        }}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderStatusModal 
        order={activeOrderTrack}
        onClose={() => setActiveOrderTrack(null)}
      />

    </div>
  );
}
