/**
 * Vercel Serverless Function for Real-Time Cross-Device Orders Sync
 * Uses persistent RESTful API cloud storage so mobile phone orders sync live to baker laptops!
 */

const CLOUD_SYNC_URL = 'https://api.restful-api.dev/objects/julians_bakery_orders_sacramento_95834';

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

  // GET: Fetch live orders from cloud
  if (req.method === 'GET') {
    try {
      const response = await fetch(CLOUD_SYNC_URL + '?cb=' + Date.now());
      if (response.ok) {
        const json = await response.json();
        const orders = json && json.data && Array.isArray(json.data.orders) ? json.data.orders : [];
        return res.status(200).json({ success: true, orders });
      }
    } catch (e) {
      console.warn('GET sync error:', e);
    }
    return res.status(200).json({ success: true, orders: [] });
  }

  // POST / PUT: Update orders in cloud
  if (req.method === 'POST') {
    try {
      const { order, action, orderId, newStatus } = req.body || {};
      
      // Fetch current list
      let currentOrders = [];
      try {
        const getRes = await fetch(CLOUD_SYNC_URL + '?cb=' + Date.now());
        if (getRes.ok) {
          const json = await getRes.json();
          if (json && json.data && Array.isArray(json.data.orders)) {
            currentOrders = json.data.orders;
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

      // Save to cloud store
      const putRes = await fetch(CLOUD_SYNC_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Self-Made Sweet Co. Orders Queue',
          data: { orders: currentOrders }
        })
      });

      // If object doesn't exist yet, create it with POST
      if (!putRes.ok) {
        await fetch('https://api.restful-api.dev/objects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: 'julians_bakery_orders_sacramento_95834',
            name: 'Self-Made Sweet Co. Orders Queue',
            data: { orders: currentOrders }
          })
        });
      }

      return res.status(200).json({ success: true, orders: currentOrders });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
