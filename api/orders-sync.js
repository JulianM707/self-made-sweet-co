/**
 * Vercel Serverless Function for Real-Time Cross-Device Orders Sync
 * Provides instant high-speed order queue management for mobile & laptop devices.
 */

let IN_MEMORY_ORDERS_QUEUE = [
  {
    id: 'ORD-9021',
    customerName: 'Valerie R. (Natomas)',
    fulfillment: 'Store Pickup',
    dateSlot: 'Sat 10:00 AM',
    paymentMethod: 'Venmo (@SelfMadeSweetCo)',
    email: 'valerie.natomas@example.com',
    phone: '(916) 555-0192',
    status: 'In Oven',
    items: [
      { name: "Julian's Masterpiece Muffin 🏆", qty: 2, price: 4.50 },
      { name: 'Classic Venetian Tiramisu', qty: 1, price: 8.50 }
    ],
    total: 17.50,
    note: 'Extra streusel crunch please!'
  }
];

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
    return res.status(200).json({ success: true, orders: IN_MEMORY_ORDERS_QUEUE });
  }

  if (req.method === 'POST') {
    try {
      const { order, action, orderId, newStatus } = req.body || {};

      if (action === 'PUSH_ORDER' && order) {
        if (!IN_MEMORY_ORDERS_QUEUE.some(o => o.id === order.id)) {
          IN_MEMORY_ORDERS_QUEUE.unshift(order);
        }
        return res.status(200).json({ success: true, orders: IN_MEMORY_ORDERS_QUEUE });
      }

      if (action === 'UPDATE_STATUS' && orderId) {
        IN_MEMORY_ORDERS_QUEUE = IN_MEMORY_ORDERS_QUEUE.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        return res.status(200).json({ success: true, orders: IN_MEMORY_ORDERS_QUEUE });
      }

      if (action === 'DELETE_ORDER' && orderId) {
        IN_MEMORY_ORDERS_QUEUE = IN_MEMORY_ORDERS_QUEUE.filter(o => o.id !== orderId);
        return res.status(200).json({ success: true, orders: IN_MEMORY_ORDERS_QUEUE });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
