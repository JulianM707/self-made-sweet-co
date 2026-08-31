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
  console.log('☁️ Real-Time Cloud Reviews: Pushing review to persistent cloud bin:', newReview.id);
  
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

    let existingData = {};
    try {
      const getRes = await fetch(CLOUD_BIN_URL + '?cb=' + Date.now());
      if (getRes.ok) {
        const json = await getRes.json();
        if (json && json.data) {
          existingData = json.data;
        }
      }
    } catch (e) {
      existingData = {};
    }

    let remoteReviews = Array.isArray(existingData.reviews) ? existingData.reviews : [];
    if (!remoteReviews.some(r => r.id === newReview.id)) {
      remoteReviews = [newReview, ...remoteReviews];
    }

    const deletedIds = getDeletedReviewIds();
    remoteReviews = remoteReviews.filter(r => !deletedIds.includes(r.id));

    // Direct write to persistent Cloud Storage Bin
    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'julian_orders_and_reviews',
        data: { ...existingData, reviews: remoteReviews }
      })
    }).catch(e => console.warn('Direct cloud review push notice:', e));

    // Also notify serverless endpoint
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

    let existingData = {};
    try {
      const getRes = await fetch(CLOUD_BIN_URL + '?cb=' + Date.now());
      if (getRes.ok) {
        const json = await getRes.json();
        if (json && json.data) {
          existingData = json.data;
        }
      }
    } catch (e) {
      existingData = {};
    }

    let remoteReviews = Array.isArray(existingData.reviews) ? existingData.reviews : [];
    const deletedIds = getDeletedReviewIds();
    const filtered = remoteReviews.filter(r => r.id !== reviewId && !deletedIds.includes(r.id));

    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'julian_orders_and_reviews',
        data: { ...existingData, reviews: filtered }
      })
    }).catch(e => console.warn('Cloud bin delete review notice:', e));

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

  // Try direct fetch from Cloud Bin first
  try {
    const res = await fetch(CLOUD_BIN_URL + '?cb=' + Date.now());
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.reviews)) {
        return json.data.reviews.filter(r => !deletedIds.includes(r.id));
      }
    }
  } catch (e) {
    // Silent fallback
  }

  // Backup fetch from serverless API
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
