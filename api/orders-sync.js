/**
 * Vercel Serverless Function for Real-Time Cross-Device Orders Sync
 * Uses persistent cloud database storage so mobile phone orders sync live to baker laptops!
 */

const CLOUD_DB_URL = 'https://api.myjson.online/v1/records/julians_bakery_orders_sacramento_95834';

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

  // GET: Fetch live orders from cloud database
  if (req.method === 'GET') {
    try {
      const getRes = await fetch(CLOUD_DB_URL + '?cb=' + Date.now());
      if (getRes.ok) {
        const json = await getRes.json();
        const orders = json && json.data && Array.isArray(json.data) ? json.data : [];
        return res.status(200).json({ success: true, orders });
      }
    } catch (e) {
      console.warn('GET sync error:', e);
    }
    return res.status(200).json({ success: true, orders: [] });
  }

  // POST: Add or update order in cloud database
  if (req.method === 'POST') {
    try {
      const { order, action, orderId, newStatus } = req.body || {};

      let currentOrders = [];
      try {
        const getRes = await fetch(CLOUD_DB_URL + '?cb=' + Date.now());
        if (getRes.ok) {
          const json = await getRes.json();
          if (json && json.data && Array.isArray(json.data)) {
            currentOrders = json.data;
          }
        }
      } catch (e) {
        currentOrders = [];
      }

      if (action === 'PUSH_ORDER' && order) {
        if (!currentOrders.some(o => o.id === order.id)) {
          currentOrders.unshift(order);
        }
      } else if (action === 'UPDATE_STATUS' && orderId) {
        currentOrders = currentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      } else if (action === 'DELETE_ORDER' && orderId) {
        currentOrders = currentOrders.filter(o => o.id !== orderId);
      }

      // Save updated list to cloud database
      await fetch(CLOUD_DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: currentOrders })
      }).catch(e => console.warn('Cloud DB save notice:', e));

      return res.status(200).json({ success: true, orders: currentOrders });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
