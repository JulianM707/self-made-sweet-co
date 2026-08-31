import React, { useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2, Heart, ThumbsUp, Filter, Sparkles, MapPin, X, Camera, Upload } from 'lucide-react';
import { PRODUCTS } from '../data/bakeryData';

export default function ReviewsSection({ reviews, onAddReview, onOpenAddReview }) {
  const [selectedProductFilter, setSelectedProductFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [dishName, setDishName] = useState(PRODUCTS[0].name);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [customImage, setCustomImage] = useState(null);

  // DYNAMIC STATS CALCULATIONS
  const totalReviews = reviews.length;
  const avgRatingNumber = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews
    : 5.0;
  const avgRatingDisplay = avgRatingNumber.toFixed(1);

  const fiveStarCount = reviews.filter(r => (r.rating || 5) === 5).length;
  const satisfactionPct = totalReviews > 0
    ? Math.round((fiveStarCount / totalReviews) * 100)
    : 100;

  const filteredReviews = reviews.filter(r => {
    if (selectedProductFilter === 'all') return true;
    const name = r.dishName || r.productName || '';
    return name.toLowerCase().includes(selectedProductFilter.toLowerCase());
  });

  // Handle image upload with automatic canvas compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export lightweight JPEG (~80KB)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setCustomImage(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!customerName || !comment) return;

    const matchedProduct = PRODUCTS.find(p => p.name === dishName) || PRODUCTS[0];

    const newReview = {
      id: `REV-${Date.now()}`,
      customerName: customerName.trim(),
      location: location.trim() || 'Sacramento, CA',
      dishName: dishName,
      productName: dishName,
      rating: Number(rating),
      date: 'Just now',
      title: title.trim() || `${rating} Stars for ${dishName}!`,
      comment: comment.trim(),
      image: customImage || matchedProduct.image,
      verified: true
    };

    onAddReview(newReview);
    setCustomerName('');
    setLocation('');
    setTitle('');
    setComment('');
    setCustomImage(null);
    setIsFormOpen(false);
  };

  return (
    <section id="reviews-section" style={{ padding: '60px 0 90px 0', background: 'var(--color-cream-light)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            <Star size={14} fill="currentColor" />
            <span>Verified Customer Reviews</span>
          </span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--color-espresso)' }}>
            Customer Praise & Dish Photos
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Real reviews & photos from dessert lovers across Vallejo, Sacramento, Vacaville, and Northern California!
          </p>
        </div>

        {/* Dynamic Rating Overview Summary Banner */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 36px',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--color-border)', paddingRight: '24px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-espresso)', lineHeight: 1 }}>
                {avgRatingDisplay}
              </div>
              <div style={{ display: 'flex', gap: '2px', color: 'var(--color-gold)', marginTop: '4px', justifyContent: 'center' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.round(avgRatingNumber) ? 'currentColor' : 'none'} color="var(--color-gold)" />
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                Average Customer Rating
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: 'var(--color-espresso)' }}>
                {satisfactionPct}% 5-Star Satisfaction
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {totalReviews === 0 
                  ? 'Be the first customer to leave an authentic review for Julian!' 
                  : `Calculated live from ${totalReviews} verified customer review${totalReviews === 1 ? '' : 's'}.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAddReview ? onOpenAddReview() : setIsFormOpen(true)}
            className="btn-primary"
            style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Camera size={18} />
            <span>Leave Review & Upload Photo</span>
          </button>
        </div>

        {/* Filter Tabs by Bake */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} /> Filter by Bake:
          </span>
          
          <button
            onClick={() => setSelectedProductFilter('all')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: selectedProductFilter === 'all' ? 'var(--color-espresso)' : '#FFF',
              color: selectedProductFilter === 'all' ? '#FFF' : 'var(--color-espresso)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer'
            }}
          >
            All Bakes ({totalReviews})
          </button>

          {PRODUCTS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProductFilter(p.name)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: selectedProductFilter.toLowerCase() === p.name.toLowerCase() ? 'var(--color-caramel)' : '#FFF',
                color: selectedProductFilter.toLowerCase() === p.name.toLowerCase() ? '#FFF' : 'var(--color-espresso)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredReviews.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFF', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
              <Sparkles size={36} color="var(--color-caramel)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-espresso)', marginBottom: '6px' }}>No Customer Reviews Yet</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
                Be the very first customer to submit a review and photo for Julian’s signature bakes!
              </p>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="btn-primary"
              >
                + Submit First Review
              </button>
            </div>
          ) : (
            filteredReviews.map(review => {
              const name = review.customerName || review.author || 'Happy Customer';
              const dish = review.dishName || review.productName || 'Signature Bake';
              const loc = review.location || 'Sacramento, CA';

              return (
                <div key={review.id} style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  {/* Photo if available */}
                  {review.image && (
                    <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={review.image} 
                        alt={dish} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="badge badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '0.75rem' }}>
                        {dish}
                      </span>
                    </div>
                  )}

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Top Row: Author & Rating */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-espresso)' }}>{name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={12} color="var(--color-caramel)" />
                            <span>{loc}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2px', color: 'var(--color-gold)' }}>
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <Star key={i} size={15} fill="currentColor" />
                          ))}
                        </div>
                      </div>

                      {/* Review Title if present */}
                      {review.title && (
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '6px' }}>
                          {review.title}
                        </h4>
                      )}

                      {/* Review Comment */}
                      <p style={{
                        fontSize: '0.9rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6,
                        marginBottom: '16px'
                      }}>
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Verified Buyer Footer */}
                    <div style={{
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-muted)'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2D7A42', fontWeight: 700 }}>
                        <CheckCircle2 size={13} /> Verified Buyer
                      </span>
                      <span>{review.date}</span>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Leave Review & Upload Photo Modal */}
        {isFormOpen && (
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
            zIndex: 260,
            padding: '24px'
          }} onClick={() => setIsFormOpen(false)}>

            <div className="animate-fade-in" style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }} onClick={e => e.stopPropagation()}>
              
              <button 
                onClick={() => setIsFormOpen(false)}
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
                  color: 'var(--color-espresso)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Camera size={24} color="var(--color-caramel)" />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-espresso)', margin: 0 }}>
                  Leave Review & Upload Photo
                </h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                Showcase the delicious bake you received from Julian!
              </p>

              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vanessa M."
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                    Your Location (City, CA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vallejo, CA or Sacramento, CA"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                    Which Bake Did You Order? *
                  </label>
                  <select
                    value={dishName}
                    onChange={e => setDishName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none', backgroundColor: '#FFF' }}
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* 📸 CUSTOM DISH PHOTO UPLOAD INPUT */}
                <div style={{
                  backgroundColor: 'var(--color-cream-light)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--color-caramel)'
                }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Upload size={16} color="var(--color-caramel)" />
                    <span>Upload Photo of Your Bake (Optional)</span>
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ width: '100%', fontSize: '0.85rem', cursor: 'pointer' }}
                  />

                  {customImage && (
                    <div style={{ marginTop: '12px', position: 'relative' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2D7A42', display: 'block', marginBottom: '4px' }}>
                        ✓ Photo Ready to Upload:
                      </span>
                      <img 
                        src={customImage} 
                        alt="Uploaded preview" 
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} 
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                    Rating *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: star <= rating ? 'var(--color-gold)' : 'var(--color-border)'
                        }}
                      >
                        <Star size={26} fill={star <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                    Headline / Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Look at this gorgeous slice!"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-espresso)', display: 'block', marginBottom: '6px' }}>
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us what you loved about your bake..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    Post Review & Photo
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
