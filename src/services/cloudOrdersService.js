/**
 * Real-Time Cloud Orders Sync Engine for Self-Made Sweet Co.
 * Syncs active customer orders across phones, laptops, and tablets live in real time.
 * Uses verified persistent cloud storage bin (ff808181a04ccf2d01a0540f5e201aa4).
 */

const CLOUD_BIN_URL = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0540f5e201aa4';

export async function syncOrderToCloud(newOrder) {
  console.log('☁️ Real-Time Cloud Sync: Pushing mobile order to persistent cloud bin:', newOrder.id);
  
  try {
    // 1. Save to local storage for instant offline access
    const savedLocal = localStorage.getItem('julians_bakery_orders');
    let localOrders = savedLocal ? JSON.parse(savedLocal) : [];
    
    if (!localOrders.some(o => o.id === newOrder.id)) {
      localOrders = [newOrder, ...localOrders];
      localStorage.setItem('julians_bakery_orders', JSON.stringify(localOrders));
    }

    // 2. Fetch current remote cloud orders to avoid overwriting existing
    let remoteList = [];
    try {
      const getRes = await fetch(CLOUD_BIN_URL + '?cb=' + Date.now());
      if (getRes.ok) {
        const json = await getRes.json();
        if (json && json.data && Array.isArray(json.data.orders)) {
          remoteList = json.data.orders;
        }
      }
    } catch (e) {
      remoteList = [];
    }

    if (!remoteList.some(o => o.id === newOrder.id)) {
      remoteList = [newOrder, ...remoteList];
    }

    // 3. Save merged list back to cloud bin
    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'julian_orders',
        data: { orders: remoteList }
      })
    }).catch(e => console.warn('Cloud bin push notice:', e));

    // 4. Serverless route backup push
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
    const res = await fetch(CLOUD_BIN_URL + '?cb=' + Date.now());
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.orders)) {
        return json.data.orders;
      }
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
