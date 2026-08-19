import React, { useState } from 'react';
import { QUIZ_QUESTIONS, PRODUCTS } from '../data/bakeryData';
import { X, Sparkles, ArrowRight, RotateCcw, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function FlavorQuizModal({ isOpen, onClose, onAddToCart }) {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState([]);
  const [matchedProduct, setMatchedProduct] = useState(null);

  const handleSelectOption = (scoreCategory) => {
    const newScores = [...scores, scoreCategory];
    setScores(newScores);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate top category from scores
      const categoryCounts = {};
      newScores.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      let topCategory = 'cheesecake';
      let maxCount = 0;
      Object.keys(categoryCounts).forEach(cat => {
        if (categoryCounts[cat] > maxCount) {
          maxCount = categoryCounts[cat];
          topCategory = cat;
        }
      });

      // Find product in topCategory
      const recommended = PRODUCTS.find(p => p.category === topCategory) || PRODUCTS[0];
      setMatchedProduct(recommended);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores([]);
    setMatchedProduct(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(42, 27, 23, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 250,
      padding: '24px'
    }} onClick={onClose}>

      <div className="animate-fade-in" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '580px',
        width: '100%',
        padding: '36px',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-cream)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-espresso)'
          }}
        >
          <X size={18} />
        </button>

        {!matchedProduct ? (
          /* Quiz Steps */
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '12px' }}>
              <Sparkles size={14} />
              <span>Step {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
            </div>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
              {QUIZ_QUESTIONS[currentStep].question}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select the option that best describes your craving right now.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {QUIZ_QUESTIONS[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option.score)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-cream-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--color-espresso)',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                    e.currentTarget.style.borderColor = 'var(--color-caramel)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-cream-light)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  <span>{option.label}</span>
                  <ArrowRight size={16} color="var(--color-caramel)" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Match Result View */
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-gold-light)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Your Perfect Craving Match!</span>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{matchedProduct.name}</h3>

            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              height: '180px',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img src={matchedProduct.image} alt={matchedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              {matchedProduct.description}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleReset} className="btn-secondary">
                <RotateCcw size={16} />
                <span>Retake Quiz</span>
              </button>

              <button 
                onClick={() => {
                  onAddToCart(matchedProduct, matchedProduct.priceSlice ? 'slice' : 'whole');
                  onClose();
                }} 
                className="btn-primary"
              >
                <ShoppingBag size={18} />
                <span>Add Match to Cart</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
