/**
 * Vercel Serverless Function for Real-Time Cross-Device Reviews Sync
 * Allows customer photo reviews posted on mobile & desktop to sync live!
 * Preserves orders data object during PUT requests.
 */

const CLOUD_REVIEWS_URL = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0540f5e201aa4';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const getRes = await fetch(CLOUD_REVIEWS_URL + '?cb=' + Date.now());
      if (getRes.ok) {
        const json = await getRes.json();
        const reviews = json && json.data && Array.isArray(json.data.reviews) ? json.data.reviews : [];
        return res.status(200).json({ success: true, reviews });
      }
    } catch (e) {
      console.warn('GET reviews sync notice:', e);
    }
    return res.status(200).json({ success: true, reviews: [] });
  }

  if (req.method === 'POST') {
    try {
      const { review, action, reviewId } = req.body || {};

      let existingData = {};
      let currentReviews = [];
      try {
        const getRes = await fetch(CLOUD_REVIEWS_URL + '?cb=' + Date.now());
        if (getRes.ok) {
          const json = await getRes.json();
          if (json && json.data) {
            existingData = json.data;
            if (Array.isArray(json.data.reviews)) {
              currentReviews = json.data.reviews;
            }
          }
        }
      } catch (e) {
        currentReviews = [];
      }

      if (action === 'PUSH_REVIEW' && review) {
        if (!currentReviews.some(r => r.id === review.id)) {
          currentReviews.unshift(review);
        }
      } else if (action === 'DELETE_REVIEW' && reviewId) {
        currentReviews = currentReviews.filter(r => r.id !== reviewId);
      }

      // Save updated reviews list while PRESERVING existing orders!
      await fetch(CLOUD_REVIEWS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'julian_orders_and_reviews',
          data: { ...existingData, reviews: currentReviews }
        })
      }).catch(e => console.warn('Cloud reviews save notice:', e));

      return res.status(200).json({ success: true, reviews: currentReviews });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
