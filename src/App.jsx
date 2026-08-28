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
import OrderNotificationToast from './components/OrderNotificationToast';
import BakerDashboard from './components/BakerDashboard';
import ReviewsSection from './components/ReviewsSection';
import AddReviewModal from './components/AddReviewModal';
import AICustomerConciergeModal from './components/AICustomerConciergeModal';
import Footer from './components/Footer';
import { INITIAL_ORDERS, INITIAL_REVIEWS, PRODUCTS } from './data/bakeryData';
import { sendOrderConfirmationEmail } from './services/emailService';
import { ChefHat, LogOut, Lock, Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isBakerLoginOpen, setIsBakerLoginOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [notificationOrder, setNotificationOrder] = useState(null);
  
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

  // Pure clean state for reviews (clears all previous test/demo reviews)
  const [reviews, setReviews] = useState([]);

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

  // Sync reviews state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('julians_bakery_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage', e);
    }
  }, [reviews]);

  // Review Operations
  const handleAddReview = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleLikeReview = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
      }
      return r;
    }));
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const handleToggleFeatureReview = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, featured: !r.featured };
      }
      return r;
    }));
  };

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
    setNotificationOrder(newOrder);
    sendOrderConfirmationEmail(newOrder);
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
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>• Signed in as jmedrano707@yahoo.com</span>
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
        reviewsCount={reviews.length}
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
            reviews={reviews}
            onDeleteReview={handleDeleteReview}
            onToggleFeatureReview={handleToggleFeatureReview}
          />
        ) : activeTab === 'reviews' ? (
          /* Customer Reviews & Dish Photos Tab */
          <ReviewsSection 
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        ) : (
          /* Customer Bakery Menu Experience */
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

      {/* Floating AI Customer Concierge Trigger Button (Bottom Right) */}
      {!isAdminMode && !isAIChatOpen && (
        <button
          onClick={() => setIsAIChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 200,
            backgroundColor: 'var(--color-espresso)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(42, 27, 23, 0.3)',
            border: '1.5px solid var(--color-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.88rem',
            animation: 'pulseGlow 3s infinite'
          }}
        >
          <Bot size={20} color="var(--color-gold)" />
          <span>Ask AI Concierge</span>
          <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>24/7</span>
        </button>
      )}

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

      <AICustomerConciergeModal 
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* Instant Purchase Order Notification Toast */}
      <OrderNotificationToast 
        order={notificationOrder}
        onClose={() => setNotificationOrder(null)}
        onTrackOrder={(ord) => setActiveOrderTrack(ord)}
      />

    </div>
  );
}
