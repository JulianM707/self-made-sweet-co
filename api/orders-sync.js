/**
 * Vercel Serverless Function for Real-Time Cross-Device Orders Sync
 * Uses persistent cloud KV storage so orders placed on mobile phones sync live to laptops!
 */

const KV_STORE_URL = 'https://kvdb.io/julian_bakery_orders_95834/active_orders';

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

  if (req.method === 'POST') {
    try {
      const { order, action, orderId, newStatus } = req.body || {};
      
      // Fetch current persistent orders from cloud KV
      let currentOrders = [];
      try {
        const kvRes = await fetch(KV_STORE_URL);
        if (kvRes.ok) {
          const text = await kvRes.text();
          if (text) currentOrders = JSON.parse(text);
        }
      } catch (e) {
        currentOrders = [];
      }

      if (!Array.isArray(currentOrders)) currentOrders = [];

      if (action === 'PUSH_ORDER' && order) {
        if (!currentOrders.some(o => o.id === order.id)) {
          currentOrders.unshift(order);
        }
      } else if (action === 'UPDATE_STATUS' && orderId) {
        currentOrders = currentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      } else if (action === 'DELETE_ORDER' && orderId) {
        currentOrders = currentOrders.filter(o => o.id !== orderId);
      }

      // Save updated orders to persistent cloud KV store
      await fetch(KV_STORE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentOrders)
      }).catch(e => console.warn('KV save notice:', e));

      return res.status(200).json({ success: true, count: currentOrders.length, orders: currentOrders });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const kvRes = await fetch(KV_STORE_URL + '?t=' + Date.now());
      if (kvRes.ok) {
        const text = await kvRes.text();
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            return res.status(200).json({ success: true, orders: parsed });
          }
        }
      }
    } catch (e) {
      console.warn('KV get notice:', e);
    }
    return res.status(200).json({ success: true, orders: [] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
