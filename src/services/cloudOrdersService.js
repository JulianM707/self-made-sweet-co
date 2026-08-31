/**
 * Real-Time Cloud Orders Sync Engine for Self-Made Sweet Co.
 * Syncs active customer orders across phones, laptops, and tablets live in real time.
 * Uses persistent cloud storage bin (ff808181a04ccf2d01a0540f5e201aa4).
 */

const CLOUD_BIN_URL = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0540f5e201aa4';
const DELETED_ORDERS_KEY = 'julians_bakery_deleted_orders';

export function getDeletedOrderIds() {
  try {
    const saved = localStorage.getItem(DELETED_ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function markOrderAsDeleted(orderId) {
  try {
    const deleted = getDeletedOrderIds();
    if (!deleted.includes(orderId)) {
      deleted.push(orderId);
      localStorage.setItem(DELETED_ORDERS_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.warn('Blacklist order error:', e);
  }
}

export async function syncOrderToCloud(newOrder) {
  console.log('☁️ Real-Time Cloud Sync: Pushing order to cloud bin:', newOrder.id);
  
  try {
    const savedLocal = localStorage.getItem('julians_bakery_orders');
    let localOrders = savedLocal ? JSON.parse(savedLocal) : [];
    
    if (!localOrders.some(o => o.id === newOrder.id)) {
      localOrders = [newOrder, ...localOrders];
      localStorage.setItem('julians_bakery_orders', JSON.stringify(localOrders));
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

    let remoteList = Array.isArray(existingData.orders) ? existingData.orders : [];
    if (!remoteList.some(o => o.id === newOrder.id)) {
      remoteList = [newOrder, ...remoteList];
    }

    const deletedIds = getDeletedOrderIds();
    remoteList = remoteList.filter(o => !deletedIds.includes(o.id));

    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'julian_orders_and_reviews',
        data: { ...existingData, orders: remoteList }
      })
    }).catch(e => console.warn('Cloud bin push notice:', e));

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

export async function deleteOrderFromCloud(orderId) {
  console.log('🗑️ Cloud Sync: Permanently deleting order from cloud bin:', orderId);
  markOrderAsDeleted(orderId);

  try {
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

    let remoteList = Array.isArray(existingData.orders) ? existingData.orders : [];
    const deletedIds = getDeletedOrderIds();
    const filtered = remoteList.filter(o => o.id !== orderId && !deletedIds.includes(o.id));

    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'julian_orders_and_reviews',
        data: { ...existingData, orders: filtered }
      })
    }).catch(e => console.warn('Cloud bin delete notice:', e));

    await fetch('/api/orders-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DELETE_ORDER', orderId })
    }).catch(e => console.warn('Backend orders-sync notice:', e));

    return { success: true };
  } catch (err) {
    console.warn('Cloud delete notice:', err);
    return { success: false };
  }
}

export async function updateOrderStatusInCloud(orderId, newStatus) {
  console.log('🔄 Cloud Sync: Updating status in cloud bin:', orderId, newStatus);
  try {
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

    let remoteList = Array.isArray(existingData.orders) ? existingData.orders : [];
    const updatedList = remoteList.map(o => o.id === orderId ? { ...o, status: newStatus } : o);

    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'julian_orders_and_reviews',
        data: { ...existingData, orders: updatedList }
      })
    }).catch(e => console.warn('Cloud bin update notice:', e));

    await fetch('/api/orders-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPDATE_STATUS', orderId, newStatus })
    }).catch(e => console.warn('Backend orders-sync notice:', e));

    return { success: true };
  } catch (err) {
    console.warn('Cloud update status notice:', err);
    return { success: false };
  }
}

export async function clearCompletedOrdersFromCloud() {
  console.log('🧹 Cloud Sync: Clearing completed orders from cloud bin');
  try {
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

    let remoteList = Array.isArray(existingData.orders) ? existingData.orders : [];
    const activeOnly = remoteList.filter(o => o.status !== 'Completed');

    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'julian_orders_and_reviews',
        data: { ...existingData, orders: activeOnly }
      })
    }).catch(e => console.warn('Cloud bin clear notice:', e));

    return { success: true };
  } catch (err) {
    console.warn('Cloud clear notice:', err);
    return { success: false };
  }
}

export async function fetchCloudOrders() {
  const deletedIds = getDeletedOrderIds();
  try {
    const res = await fetch(CLOUD_BIN_URL + '?cb=' + Date.now());
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.orders)) {
        return json.data.orders.filter(o => !deletedIds.includes(o.id));
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
        return data.orders.filter(o => !deletedIds.includes(o.id));
      }
    }
  } catch (e) {
    // Silent fallback
  }

  return null;
}
