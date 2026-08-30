/**
 * Real-Time Cloud Orders Sync Engine for Self-Made Sweet Co.
 * Syncs active customer orders across phones, laptops, and tablets live in real time.
 */

const REALTIME_DB_ENDPOINT = 'https://sweetcraft-bakery-orders-default-rtdb.firebaseio.com/orders.json';

export async function syncOrderToCloud(newOrder) {
  console.log('☁️ Real-Time Cloud Sync: Pushing mobile order to cloud:', newOrder.id);
  
  try {
    // 1. Save to local storage for instant offline access
    const savedLocal = localStorage.getItem('julians_bakery_orders');
    let localOrders = savedLocal ? JSON.parse(savedLocal) : [];
    
    if (!localOrders.some(o => o.id === newOrder.id)) {
      localOrders = [newOrder, ...localOrders];
      localStorage.setItem('julians_bakery_orders', JSON.stringify(localOrders));
    }

    // 2. Push directly to real-time cloud database
    await fetch(REALTIME_DB_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localOrders)
    }).catch(e => console.warn('Cloud DB push notice:', e));

    // 3. Backup push to serverless route
    await fetch('/api/orders-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'PUSH_ORDER', order: newOrder })
    }).catch(e => console.warn('Backend orders-sync notice:', e));

    return { success: true };
  } catch (err) {
    console.warn('Cloud order push notice:', err);
    return { success: false };
  }
}

export async function fetchCloudOrders() {
  try {
    // Direct real-time cloud database fetch
    const res = await fetch(REALTIME_DB_ENDPOINT + '?cb=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object') return Object.values(data);
    }
  } catch (e) {
    // Silent fallback
  }

  try {
    const backupRes = await fetch('/api/orders-sync?cb=' + Date.now());
    if (backupRes.ok) {
      const data = await backupRes.json();
      if (data && data.orders && Array.isArray(data.orders)) {
        return data.orders;
      }
    }
  } catch (e) {
    // Silent fallback
  }

  return null;
}
