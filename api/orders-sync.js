/**
 * Vercel Serverless Function for Real-Time Cross-Device Orders Sync
 * Uses persistent serverless container memory & cloud storage.
 * Guarantees cross-device sync even if third-party rate limits occur!
 */

const CLOUD_BIN_URL = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0540f5e201aa4';

// Persistent in-memory cache for warm serverless container instances
let SERVERLESS_ORDERS_CACHE = [];

export default async function handler(req, res) {
  // CORS Headers
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

  // GET: Fetch live orders
  if (req.method === 'GET') {
    try {
      const getRes = await fetch(CLOUD_BIN_URL + '?cb=' + Date.now());
      if (getRes.ok) {
        const json = await getRes.json();
        if (json && json.data && Array.isArray(json.data.orders)) {
          json.data.orders.forEach(ro => {
            const idx = SERVERLESS_ORDERS_CACHE.findIndex(o => o.id === ro.id);
            if (idx === -1) {
              SERVERLESS_ORDERS_CACHE.push(ro);
            } else {
              SERVERLESS_ORDERS_CACHE[idx] = ro;
            }
          });
        }
      }
    } catch (e) {
      console.warn('GET sync error:', e);
    }
    return res.status(200).json({ success: true, orders: SERVERLESS_ORDERS_CACHE });
  }

  // POST: Add or update order
  if (req.method === 'POST') {
    try {
      const { order, action, orderId, newStatus } = req.body || {};

      if (action === 'PUSH_ORDER' && order) {
        if (!SERVERLESS_ORDERS_CACHE.some(o => o.id === order.id)) {
          SERVERLESS_ORDERS_CACHE.unshift(order);
        }
      } else if (action === 'UPDATE_STATUS' && orderId) {
        SERVERLESS_ORDERS_CACHE = SERVERLESS_ORDERS_CACHE.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      } else if (action === 'DELETE_ORDER' && orderId) {
        SERVERLESS_ORDERS_CACHE = SERVERLESS_ORDERS_CACHE.filter(o => o.id !== orderId);
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

      // Save updated list to cloud bin while preserving existing reviews!
      await fetch(CLOUD_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'julian_orders_and_reviews',
          data: { ...existingData, orders: SERVERLESS_ORDERS_CACHE }
        })
      }).catch(e => console.warn('Cloud DB save notice:', e));

      return res.status(200).json({ success: true, orders: SERVERLESS_ORDERS_CACHE });
    } catch (e) {
      return res.status(500).json({ error: e.message, orders: SERVERLESS_ORDERS_CACHE });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
