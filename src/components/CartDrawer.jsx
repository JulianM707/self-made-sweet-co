import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Calendar, MapPin, Clock, ShoppingBag, ArrowRight, CheckCircle2, DollarSign, Smartphone, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

// Generate arranged weekend kitchen time slots (Saturday & Sunday 8:00 AM - 8:00 PM)
function getArrangedTimeSlots() {
  const slots = [];
  const now = new Date();

  const getNextDayOfWeek = (date, dayOfWeek) => {
    const resultDate = new Date(date.getTime());
    let diff = dayOfWeek - date.getDay();
    if (diff < 0) diff += 7;
    resultDate.setDate(date.getDate() + diff);
    return resultDate;
  };

  const isSatToday = now.getDay() === 6;
  const isSunToday = now.getDay() === 0;

  const targetSat = isSatToday ? now : getNextDayOfWeek(now, 6);
  const targetSun = isSunToday ? now : getNextDayOfWeek(now, 0);

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const hours = [
    '8:00 AM (Opening Batch)',
    '10:00 AM',
    '12:00 PM (Noon)',
    '2:00 PM',
    '4:00 PM',
    '6:00 PM',
    '7:30 PM (Final Evening Batch)'
  ];

  // Saturday Slots (8 AM - 8 PM)
  hours.forEach(h => {
    slots.push(`Sat, ${formatDate(targetSat)} @ ${h}`);
  });

  // Sunday Slots (8 AM - 8 PM)
  hours.forEach(h => {
    slots.push(`Sun, ${formatDate(targetSun)} @ ${h}`);
  });

  return slots;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onOrderPlaced 
}) {
  if (!isOpen) return null;

  const availableTimeSlots = getArrangedTimeSlots();

  const [fulfillment, setFulfillment] = useState('pickup'); // 'pickup' | 'delivery'
  const [pickupTime, setPickupTime] = useState(availableTimeSlots[0]);
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
        cash: 'Cash (On Pickup/Delivery)',
        venmo: 'Venmo (@SelfMadeSweetCo)',
        cashapp: 'Cash App ($SelfMadeSweetCo)',
        paypal: 'PayPal (@SelfMadeSweetCo)'
      };

      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        fulfillment: fulfillment === 'delivery' ? `Sacramento Delivery (${address})` : 'Store Pickup',
        dateSlot: pickupTime,
        paymentMethod: paymentLabelMap[paymentMethod] || 'Cash',
        items: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.unitPrice || item.priceWhole
        })),
        total: grandTotal,
        status: 'Pending Prep',
        note: notes.trim()
      };

      onOrderPlaced(newOrder);
      setIsSubmitting(false);
      onClose();
    }, 1000);
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
      justifyContent: 'flex-end',
      zIndex: 250
    }} onClick={onClose}>
      
      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        backgroundColor: '#FFFFFF',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--color-caramel)" />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-espresso)', margin: 0 }}>
              Your Bakery Order
            </h3>
          </div>

          <button 
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-espresso)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
              <ShoppingBag size={48} color="var(--color-caramel)" style={{ marginBottom: '16px', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Add some handcrafted cheesecakes, tiramisu, or cookies to get started!</p>
              <button onClick={onClose} className="btn-primary">
                Browse Menu
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Itemized Cart List */}
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

                {/* Chronologically Arranged Time Slot Picker */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                    Select Weekend Kitchen Time Slot (Sat & Sun 8 AM - 8 PM):
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
                    {availableTimeSlots.map((slot, index) => (
                      <option key={index} value={slot}>{slot}</option>
                    ))}
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
                  </div>

                  {/* Summary Totals */}
                  <div style={{
                    backgroundColor: 'var(--color-cream)',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.88rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {fulfillment === 'delivery' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                        <span>Sacramento Delivery Fee</span>
                        <span>$8.50</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                      <span>Estimated Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      color: 'var(--color-espresso)',
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '6px',
                      marginTop: '4px'
                    }}>
                      <span>Grand Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ padding: '14px', width: '100%', marginTop: '6px', fontSize: '1rem' }}
                  >
                    {isSubmitting ? 'Processing Order...' : `Place Bakery Order ($${grandTotal.toFixed(2)})`}
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
