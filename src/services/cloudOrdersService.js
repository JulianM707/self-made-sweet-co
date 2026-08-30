/**
 * Real-Time Cloud Orders Sync Engine for Self-Made Sweet Co.
 * Syncs active customer orders across phones, laptops, and tablets live in real time.
 */

const DIRECT_CLOUD_DB_URL = 'https://api.myjson.online/v1/records/julians_bakery_orders_sacramento_95834';

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

    // 2. Direct client-to-cloud push for instant cross-device delivery
    await fetch(DIRECT_CLOUD_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: localOrders })
    }).catch(e => console.warn('Direct cloud push notice:', e));

    // 3. Serverless route backup push
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
    // Try direct cloud database fetch first
    const directRes = await fetch(DIRECT_CLOUD_DB_URL + '?cb=' + Date.now());
    if (directRes.ok) {
      const json = await directRes.json();
      if (json && json.data && Array.isArray(json.data)) {
        return json.data;
      }
    }

    // Fallback to serverless endpoint
    const res = await fetch('/api/orders-sync?cb=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && data.orders && Array.isArray(data.orders)) {
        return data.orders;
      }
    }
  } catch (e) {
    // Silent local fallback
  }
  return null;
}
