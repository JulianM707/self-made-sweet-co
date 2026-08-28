import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, Cake, Clock, MapPin, Heart, Loader2 } from 'lucide-react';
import { PRODUCTS } from '../data/bakeryData';

// Knowledge Base Rules for Julian's AI Concierge
const BAKERY_KNOWLEDGE = [
  {
    keywords: ['hours', 'time', 'open', 'schedule', 'pickup', 'when', 'weekend'],
    answer: "Julian's kitchen is open for Store Pickup and Sacramento Local Delivery on **Saturday & Sunday from 8:00 AM to 8:00 PM**! You can select your exact weekend time slot at checkout."
  },
  {
    keywords: ['location', 'where', 'sacramento', 'vallejo', 'address', 'natomas', '95834'],
    answer: "Self-Made Sweet Co. operates out of **Natomas, Sacramento, CA (ZIP 95834)** for local delivery & weekend pickup. Julian originally comes from **Vallejo, CA**!"
  },
  {
    keywords: ['masterpiece', 'recommend', 'popular', 'best', 'signature', 'top'],
    answer: "Julian's Signature Masterpiece 🏆 is the **Wild Blueberry Streusel Muffin** ($4.50 single / $24 6-pack)! Packed with a full pint of fresh blueberries per batch and topped with a cold-butter cinnamon brown sugar streusel."
  },
  {
    keywords: ['cheesecake', 'basque', 'crust', 'topping', 'strawberry', 'stock', 'sold out', 'available'],
    answer: "Please note: Our **Classic Artisan Cheesecake** is currently **🔴 TEMPORARILY OUT OF STOCK**. We highly recommend trying **Julian's Masterpiece 🏆 (Wild Blueberry Streusel Muffins)** or **Classic Venetian Tiramisu** for this weekend's pickup!"
  },
  {
    keywords: ['tiramisu', 'espresso', 'mascarpone', 'coffee'],
    answer: "Our **Classic Venetian Tiramisu** ($8.50 slice / $48 tray) features light whipped mascarpone cream, espresso-soaked Savoiardi Italian ladyfingers, and Valrhona cocoa powder!"
  },
  {
    keywords: ['muffin', 'blueberry', 'streusel'],
    answer: "Julian's Masterpiece 🏆 **Wild Blueberry Streusel Muffin** ($4.50 single / $24 6-pack) is overflowing with fresh wild blueberries and topped with a cold-butter cinnamon brown sugar crunch!"
  },
  {
    keywords: ['cookie', 'chocolate'],
    answer: "Our **Gourmet Chocolate Chip Cookie** ($3.50 single / $18 6-pack) features crisp golden edges with a warm, soft, gooey dark chocolate chunk center!"
  },
  {
    keywords: ['nut', 'allergy', 'gluten', 'dietary', 'vegan'],
    answer: "We offer dietary-conscious bakes! Our **Wild Blueberry Streusel Muffins**, **Cinnamon Coffee Cake**, and **Gourmet Chocolate Chip Cookies** are 100% Nut-Free!"
  },
  {
    keywords: ['julian', 'founder', 'story', 'mba', 'santa cruz', 'sdsu', 'education'],
    answer: "Julian Medrano is the sole baker and founder of Self-Made Sweet Co.! He is a 1st generation Mexican-American from Vallejo, CA with a **Bachelor's from UC Santa Cruz** 🍌 and an **MBA from San Diego State University (SDSU)** 🔴⚫!"
  },
  {
    keywords: ['payment', 'venmo', 'cashapp', 'paypal', 'cash', 'pay'],
    answer: "We accept **Cash on pickup/delivery**, **Venmo** (`@SelfMadeSweetCo`), **Cash App** (`$SelfMadeSweetCo`), and **PayPal** (`@SelfMadeSweetCo`)!"
  }
];

export default function AICustomerConciergeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hi! I'm Julian's 24/7 AI Bakery Concierge. How can I help you today? Ask me about Julian's Masterpiece 🏆, weekend pickup hours (Sat/Sun 8AM-8PM), or dietary bakes!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    // Add User Message
    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Generate AI Response with typing indicator
    setTimeout(() => {
      const lower = query.toLowerCase();
      let botAnswer = null;

      // Find match in knowledge base
      for (const item of BAKERY_KNOWLEDGE) {
        if (item.keywords.some(kw => lower.includes(kw))) {
          botAnswer = item.answer;
          break;
        }
      }

      if (!botAnswer) {
        botAnswer = "I'm happy to help! Julian bakes fresh every weekend (**Saturday & Sunday 8:00 AM – 8:00 PM**) in Natomas, Sacramento. Try **Julian's Masterpiece 🏆 (Wild Blueberry Streusel Muffin)**! Is there a specific bake you'd like to learn about?";
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer }]);
    }, 550);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 280,
      maxWidth: '420px',
      width: 'calc(100% - 48px)',
      maxHeight: '620px',
      height: '85vh',
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 20px 50px rgba(42, 27, 23, 0.3)',
      border: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--color-espresso)',
        color: '#FFFFFF',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid var(--color-caramel)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-caramel)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', margin: 0, fontWeight: 800 }}>
              Julian's AI Concierge
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#D4AF37', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={11} /> 24/7 Automated Bakery Assistant
            </span>
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Quick Suggestion Chips */}
      <div style={{
        padding: '10px 14px',
        backgroundColor: 'var(--color-cream-light)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {[
          '🏆 Julian\'s Masterpiece',
          '⏰ Weekend Hours',
          '🫐 Nut-Free Bakes',
          '👨‍🍳 Julian\'s Story'
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-espresso)',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '8px'
            }}
          >
            {msg.sender === 'bot' && (
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-caramel)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                flexShrink: 0,
                marginTop: '4px'
              }}>
                <Bot size={15} />
              </div>
            )}

            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              backgroundColor: msg.sender === 'user' ? 'var(--color-caramel)' : 'var(--color-cream-light)',
              color: msg.sender === 'user' ? '#FFFFFF' : 'var(--color-espresso)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              border: msg.sender === 'user' ? 'none' : '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {msg.text.split('**').map((part, i) => (
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              ))}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-caramel)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              flexShrink: 0
            }}>
              <Bot size={15} />
            </div>
            <div style={{
              padding: '10px 14px',
              borderRadius: '18px 18px 18px 4px',
              backgroundColor: 'var(--color-cream-light)',
              color: 'var(--color-text-muted)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Loader2 size={14} className="animate-spin" color="var(--color-caramel)" />
              <span>Julian's AI Assistant is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: '8px',
          backgroundColor: '#FFFFFF'
        }}
      >
        <input 
          type="text"
          placeholder="Ask a question about Julian's bakes..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={isTyping}
          className="btn-primary"
          style={{ padding: '10px 16px', borderRadius: 'var(--radius-full)' }}
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
}
