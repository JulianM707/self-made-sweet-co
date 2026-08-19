import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Calendar, MapPin, Clock, ShoppingBag, ArrowRight, CheckCircle2, DollarSign, Smartphone, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onOrderPlaced 
}) {
  if (!isOpen) return null;

  const [fulfillment, setFulfillment] = useState('pickup'); // 'pickup' | 'delivery'
  const [pickupTime, setPickupTime] = useState('Tomorrow at 10:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'venmo' | 'cashapp' | 'paypal'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice || (item.unitPrice * item.quantity)), 0);
  const deliveryFee = fulfillment === 'delivery' ? 8.50 : 0.00;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + deliveryFee + tax;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customerName || !email || !phone) {
      alert('Please fill out your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Fire celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const paymentLabelMap = {
        cash: 'Cash (Pay on Pickup/Delivery)',
        venmo: 'Venmo (@SelfMadeSweetCo)',
        cashapp: 'Cash App ($SelfMadeSweetCo)',
        paypal: 'PayPal (julian@selfmadesweetco.com)'
      };

      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName,
        email,
        phone,
        address: fulfillment === 'delivery' ? address : 'Sacramento Kitchen Store Pickup',
        fulfillment: fulfillment === 'delivery' ? 'Sacramento Delivery' : 'Store Pickup',
        dateSlot: pickupTime,
        paymentMethod: paymentLabelMap[paymentMethod] || 'Cash',
        items: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.totalPrice || (item.unitPrice * item.quantity),
          customDetails: item.customDetails
        })),
        total: grandTotal,
        status: 'Order Confirmed',
        createdAt: 'Just now',
        note: notes
      };

      onOrderPlaced(newOrder);
      setIsSubmitting(false);
      onClose();
    }, 900);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(42, 27, 23, 0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 220
    }} onClick={onClose}>

      <div className="animate-fade-in" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-cream-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--color-caramel)" />
            <h3 style={{ fontSize: '1.25rem' }}>Your Artisan Basket</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--color-espresso)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Cart Content / Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-cream)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: 'var(--color-caramel)'
              }}>
                <ShoppingBag size={28} />
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '4px' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.88rem' }}>Add signature cheesecakes, tiramisu, muffins, or cookies to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Item Cards */}
              {cartItems.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border)'
                }}>
                  <img 
                    src={item.image || '/images/basque_cheesecake_1786065253639.jpg'} 
                    alt={item.name}
                    style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--color-espresso)' }}>{item.name}</h4>
                      <button 
                        onClick={() => onRemoveItem(idx)}
                        style={{ background: 'none', color: '#D96B43', cursor: 'pointer' }}
                        title="Remove Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Custom Specs if applicable */}
                    {item.customDetails && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                        <div>Base: {item.customDetails.base}</div>
                        <div>Filling: {item.customDetails.filling}</div>
                        {item.customDetails.inscription && <div>Plaque: "{item.customDetails.inscription}"</div>}
                      </div>
                    )}

                    {item.optionType && !item.isCustom && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-caramel)', fontWeight: 600, marginBottom: '6px' }}>
                        Portion: {item.optionType === 'slice' ? (item.category === 'muffins' ? 'Single Muffin' : item.category === 'cookies' ? 'Single Cookie' : 'Single Slice') : (item.category === 'muffins' || item.category === 'cookies' ? '6-Pack Box' : 'Full Cake')}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#FFF',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)'
                      }}>
                        <button onClick={() => onUpdateQty(idx, Math.max(1, item.quantity - 1))} style={{ background: 'none', cursor: 'pointer' }}>
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => onUpdateQty(idx, item.quantity + 1)} style={{ background: 'none', cursor: 'pointer' }}>
                          <Plus size={13} />
                        </button>
                      </div>

                      <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-espresso)' }}>
                        ${((item.unitPrice || item.priceWhole) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Fulfillment Options */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', color: 'var(--color-espresso)' }}>Fulfillment Method</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setFulfillment('pickup')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: fulfillment === 'pickup' ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                      backgroundColor: fulfillment === 'pickup' ? 'var(--color-cream-light)' : '#FFF',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Clock size={15} />
                    <span>Store Pickup (Free)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillment('delivery')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: fulfillment === 'delivery' ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                      backgroundColor: fulfillment === 'delivery' ? 'var(--color-cream-light)' : '#FFF',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <MapPin size={15} />
                    <span>Local Delivery ($8.50)</span>
                  </button>
                </div>

                {/* Time Slot Picker */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                    Select Preferred Time Slot:
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      backgroundColor: '#FFF'
                    }}
                  >
                    <option value="Today at 4:30 PM">Today at 4:30 PM (Express Pickup)</option>
                    <option value="Tomorrow at 10:00 AM">Tomorrow at 10:00 AM</option>
                    <option value="Tomorrow at 2:00 PM">Tomorrow at 2:00 PM</option>
                    <option value="This Saturday at 11:00 AM">This Saturday at 11:00 AM</option>
                  </select>
                </div>

                {/* Checkout Fields */}
                <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Your Full Name *" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)}
                    required 
                    style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input 
                      type="email" 
                      placeholder="Email Address *" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      required 
                      style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number *" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      required 
                      style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                    />
                  </div>

                  {fulfillment === 'delivery' && (
                    <input 
                      type="text" 
                      placeholder="Sacramento Delivery Street Address *" 
                      value={address} 
                      onChange={e => setAddress(e.target.value)}
                      required 
                      style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                    />
                  )}

                  <input 
                    type="text" 
                    placeholder="Special delivery or packaging notes..." 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />

                  {/* Payment Method Selector (Cash, Venmo, Cash App, PayPal) */}
                  <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '8px' }}>
                      Select Payment Method:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: paymentMethod === 'cash' ? '2px solid var(--color-caramel)' : '1px solid var(--color-border)',
                          backgroundColor: paymentMethod === 'cash' ? 'var(--color-cream-light)' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <DollarSign size={18} color="var(--color-caramel)" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-espresso)' }}>Cash</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>On Pickup/Delivery</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('venmo')}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: paymentMethod === 'venmo' ? '2px solid #008CFF' : '1px solid var(--color-border)',
                          backgroundColor: paymentMethod === 'venmo' ? 'rgba(0,140,255,0.06)' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: '#008CFF',
                          color: '#FFF',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>V</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#008CFF' }}>Venmo</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>@SelfMadeSweetCo</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cashapp')}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: paymentMethod === 'cashapp' ? '2px solid #00D632' : '1px solid var(--color-border)',
                          backgroundColor: paymentMethod === 'cashapp' ? 'rgba(0,214,50,0.06)' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: '#00D632',
                          color: '#FFF',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>$</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#00B82B' }}>Cash App</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>$SelfMadeSweetCo</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: paymentMethod === 'paypal' ? '2px solid #003087' : '1px solid var(--color-border)',
                          backgroundColor: paymentMethod === 'paypal' ? 'rgba(0,48,135,0.06)' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: '#003087',
                          color: '#FFF',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>P</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#003087' }}>PayPal</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>@SelfMadeSweetCo</div>
                        </div>
                      </button>
                    </div>

                    {/* Payment Instruction Banner */}
                    <div className="animate-fade-in" style={{ marginTop: '10px', padding: '10px 12px', backgroundColor: 'var(--color-cream-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-espresso)' }}>
                      {paymentMethod === 'cash' && (
                        <div>💵 <strong>Cash Option:</strong> Pay in person when picking up at the kitchen or upon Sacramento delivery.</div>
                      )}
                      {paymentMethod === 'venmo' && (
                        <div>💜 <strong>Venmo Option:</strong> Send <strong>${grandTotal.toFixed(2)}</strong> to <strong>@SelfMadeSweetCo</strong> with your name in notes.</div>
                      )}
                      {paymentMethod === 'cashapp' && (
                        <div>💚 <strong>Cash App Option:</strong> Send <strong>${grandTotal.toFixed(2)}</strong> to <strong>$SelfMadeSweetCo</strong> with your name in notes.</div>
                      )}
                      {paymentMethod === 'paypal' && (
                        <div>💙 <strong>PayPal Option:</strong> Send <strong>${grandTotal.toFixed(2)}</strong> to <strong>julian@selfmadesweetco.com</strong> or <strong>@SelfMadeSweetCo</strong>.</div>
                      )}
                    </div>
                  </div>

                  {/* Summary Totals */}
                  <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '16px', borderRadius: 'var(--radius-md)', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {fulfillment === 'delivery' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Sacramento Delivery Fee:</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Estimated Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-espresso)', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                      <span>Total Due:</span>
                      <span style={{ color: 'var(--color-caramel)' }}>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={isSubmitting}
                    style={{ width: '100%', marginTop: '12px', padding: '14px', fontSize: '1rem' }}
                  >
                    {isSubmitting ? 'Confirming Order...' : `Place Order ($${grandTotal.toFixed(2)})`}
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
