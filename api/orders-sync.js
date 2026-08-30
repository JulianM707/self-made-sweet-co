/**
 * Vercel Serverless Function for Real-Time Cross-Device Orders Sync
 * Allows orders placed on any mobile phone to pop up live on the baker's laptop!
 */

// In-memory global store for active deployment session
let GLOBAL_ORDERS_QUEUE = [];

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

  if (req.method === 'POST') {
    try {
      const { order, action } = req.body || {};
      
      if (action === 'PUSH_ORDER' && order) {
        if (!GLOBAL_ORDERS_QUEUE.some(o => o.id === order.id)) {
          GLOBAL_ORDERS_QUEUE.unshift(order);
        }
        return res.status(200).json({ success: true, count: GLOBAL_ORDERS_QUEUE.length, orders: GLOBAL_ORDERS_QUEUE });
      }

      if (action === 'UPDATE_STATUS') {
        const { orderId, newStatus } = req.body;
        GLOBAL_ORDERS_QUEUE = GLOBAL_ORDERS_QUEUE.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        return res.status(200).json({ success: true, orders: GLOBAL_ORDERS_QUEUE });
      }

      if (action === 'DELETE_ORDER') {
        const { orderId } = req.body;
        GLOBAL_ORDERS_QUEUE = GLOBAL_ORDERS_QUEUE.filter(o => o.id !== orderId);
        return res.status(200).json({ success: true, orders: GLOBAL_ORDERS_QUEUE });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, orders: GLOBAL_ORDERS_QUEUE });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
