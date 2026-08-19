import React, { useState } from 'react';
import { X, Star, Camera, Upload, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AddReviewModal({ isOpen, onClose, products = [], onSubmitReview }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [dishId, setDishId] = useState(products[0]?.id || 'classic-cheesecake');
  const [customDishName, setCustomDishName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle local file selection and convert to Base64 Data URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick preset photos for easy testing
  const PRESET_PHOTOS = [
    { label: '🍓 Strawberry Cheesecake', url: '/images/strawberry_cheesecake_1786065683977.jpg' },
    { label: '☕ Espresso Tiramisu', url: '/images/espresso_tiramisu_1786065261884.jpg' },
    { label: '🫐 Blueberry Muffin', url: '/images/berry_muffins_1786065279996.jpg' },
    { label: '🍪 Chocolate Chip Cookie', url: '/images/chocolate_chip_cookies.jpg' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);

    const selectedProduct = products.find(p => p.id === dishId);
    const dishName = selectedProduct ? selectedProduct.name : (customDishName || 'Handcrafted Bake');

    const newReview = {
      id: 'REV-' + Date.now(),
      customerName: customerName.trim(),
      verified: true,
      dishId: dishId,
      dishName: dishName,
      rating: rating,
      date: 'Just now',
      timestamp: Date.now(),
      title: title.trim() || `${rating}★ Review for ${dishName}`,
      comment: comment.trim(),
      image: imagePreview || (selectedProduct ? selectedProduct.image : '/images/artisan_pastry_box_1786065288702.jpg'),
      helpfulCount: 0,
      featured: false
    };

    // Confetti explosion
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }

    setTimeout(() => {
      onSubmitReview(newReview);
      setIsSubmitting(false);
      // Reset form
      setRating(5);
      setCustomerName('');
      setTitle('');
      setComment('');
      setImagePreview(null);
      onClose();
    }, 400);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        position: 'relative',
        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-cream)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-caramel)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-espresso)', margin: 0 }}>
                Share Your Dish & Review
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Post a photo of your dish & tell us how it tasted!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Star Rating Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '8px' }}>
              Your Overall Rating *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Star 
                    size={30} 
                    color={(hoverRating || rating) >= star ? '#D4AF37' : '#D1D5DB'}
                    fill={(hoverRating || rating) >= star ? '#D4AF37' : 'none'}
                  />
                </button>
              ))}
              <span style={{ marginLeft: '10px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-caramel)' }}>
                {rating === 5 ? '5.0 - Exceptional! 🌟' : rating === 4 ? '4.0 - Very Good 👌' : `${rating}.0 Stars`}
              </span>
            </div>
          </div>

          {/* Dish Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '6px' }}>
                Which dish did you order? *
              </label>
              <select
                value={dishId}
                onChange={(e) => setDishId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-body)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-text-main)'
                }}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
                <option value="custom">Custom Special Bake / Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '6px' }}>
                Your Name / Alias *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maria G."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>
          </div>

          {/* Optional Custom Dish Name if selected custom */}
          {dishId === 'custom' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '6px' }}>
                Specify Custom Dish Name
              </label>
              <input
                type="text"
                placeholder="e.g. Custom Birthday Cheesecake Box"
                value={customDishName}
                onChange={(e) => setCustomDishName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          )}

          {/* Photo Upload Area */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '6px' }}>
              Upload Photo of Your Dish 📸
            </label>
            
            <div style={{
              border: '2px dashed var(--color-caramel)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#FAFAF7',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />

              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Dish Preview"
                    style={{
                      maxHeight: '160px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                    ✓ Photo attached! Click to change photo
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Upload size={28} color="var(--color-caramel)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
                    Drop dish photo here or click to browse files
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Supports JPG, PNG, WEBP files
                  </span>
                </div>
              )}
            </div>

            {/* Quick Preset Photo Selection */}
            {!imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Or pick a sample photo:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImagePreview(preset.url)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--color-cream)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-espresso)',
                        cursor: 'pointer'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Title & Comment */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '6px' }}>
              Review Title
            </label>
            <input
              type="text"
              placeholder="e.g. Insanely good! Best dessert in town."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
                marginBottom: '16px'
              }}
            />

            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '6px' }}>
              Detailed Review *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell other dessert lovers about the flavor, crust, texture, or delivery experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.5,
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '12px 20px' }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Posting Review...' : 'Post Dish Review 📸'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
