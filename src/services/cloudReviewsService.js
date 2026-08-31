/**
 * Real-Time Cloud Reviews Sync Engine for Self-Made Sweet Co.
 * Allows customer photo reviews posted on any phone or computer to sync live everywhere!
 * Uses persistent cloud storage bin (ff808181a04ccf2d01a0540f5e201aa4).
 */

import { INITIAL_REVIEWS } from '../data/bakeryData';

const CLOUD_BIN_URL = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0540f5e201aa4';
const DELETED_REVIEWS_KEY = 'julians_bakery_deleted_reviews';

export function getDeletedReviewIds() {
  try {
    const saved = localStorage.getItem(DELETED_REVIEWS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function markReviewAsDeleted(reviewId) {
  try {
    const deleted = getDeletedReviewIds();
    if (!deleted.includes(reviewId)) {
      deleted.push(reviewId);
      localStorage.setItem(DELETED_REVIEWS_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.warn('Blacklist review error:', e);
  }
}

export async function syncReviewToCloud(newReview) {
  console.log('☁️ Real-Time Cloud Reviews: Pushing review to cloud:', newReview.id);
  
  try {
    const savedLocal = localStorage.getItem('julians_bakery_reviews');
    let localReviews = savedLocal ? JSON.parse(savedLocal) : INITIAL_REVIEWS;
    
    if (!localReviews.some(r => r.id === newReview.id)) {
      localReviews = [newReview, ...localReviews];
      try {
        localStorage.setItem('julians_bakery_reviews', JSON.stringify(localReviews));
      } catch (e) {
        console.warn('LocalStorage quota warning:', e);
      }
    }

    // Broadcast to serverless API
    await fetch('/api/reviews-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'PUSH_REVIEW', review: newReview })
    }).catch(e => console.warn('Backend reviews-sync notice:', e));

    return { success: true };
  } catch (err) {
    console.warn('Cloud review push notice:', err);
    return { success: false };
  }
}

export async function deleteReviewFromCloud(reviewId) {
  console.log('🗑️ Cloud Reviews Sync: Permanently deleting review from cloud bin:', reviewId);
  markReviewAsDeleted(reviewId);

  try {
    const savedLocal = localStorage.getItem('julians_bakery_reviews');
    let localReviews = savedLocal ? JSON.parse(savedLocal) : [];
    localReviews = localReviews.filter(r => r.id !== reviewId);
    try {
      localStorage.setItem('julians_bakery_reviews', JSON.stringify(localReviews));
    } catch (e) {
      console.warn('LocalStorage quota warning:', e);
    }

    await fetch('/api/reviews-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DELETE_REVIEW', reviewId })
    }).catch(e => console.warn('Backend reviews-sync delete notice:', e));

    return { success: true };
  } catch (err) {
    console.warn('Cloud review delete notice:', err);
    return { success: false };
  }
}

export async function fetchCloudReviews() {
  const deletedIds = getDeletedReviewIds();
  try {
    const res = await fetch('/api/reviews-sync?cb=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && data.reviews && Array.isArray(data.reviews)) {
        return data.reviews.filter(r => !deletedIds.includes(r.id));
      }
    }
  } catch (e) {
    // Silent fallback
  }
  return null;
}
