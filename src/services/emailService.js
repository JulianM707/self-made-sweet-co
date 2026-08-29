/**
 * Email Notification & Receipt Service for Self-Made Sweet Co.
 * Provides automated EmailJS REST API dispatch, Mailto fallback, and receipt generation.
 */

// Load custom EmailJS config from localStorage or defaults
export function getEmailConfig() {
  try {
    const saved = localStorage.getItem('julians_emailjs_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load email config', e);
  }
  return {
    serviceId: typeof process !== 'undefined' && process.env && process.env.VITE_EMAILJS_SERVICE_ID ? process.env.VITE_EMAILJS_SERVICE_ID : 'service_selfmadesweetco',
    templateId: typeof process !== 'undefined' && process.env && process.env.VITE_EMAILJS_TEMPLATE_ID ? process.env.VITE_EMAILJS_TEMPLATE_ID : 'template_order_confirm',
    publicKey: typeof process !== 'undefined' && process.env && process.env.VITE_EMAILJS_PUBLIC_KEY ? process.env.VITE_EMAILJS_PUBLIC_KEY : 'user_selfmadesweetco_key'
  };
}

export function saveEmailConfig(config) {
  try {
    localStorage.setItem('julians_emailjs_config', JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save email config', e);
  }
}

/**
 * Builds a clean text summary of the order for receipts
 */
export function formatOrderSummaryText(order) {
  const itemsText = order.items.map(i => `• ${i.qty || 1}x ${i.name} — $${((i.unitPrice || i.price || 0) * (i.qty || 1)).toFixed(2)}`).join('\n');
  
  return `----------------------------------------
SELF-MADE SWEET CO. — ORDER CONFIRMATION
Order ID: #${order.id || 'ORD-NEW'}
Baker: Julian Medrano (jmedrano707@yahoo.com)
----------------------------------------

Customer Name: ${order.customerName || 'Valued Customer'}
Customer Email: ${order.email || 'N/A'}
Phone: ${order.phone || 'N/A'}
Fulfillment: ${order.fulfillment || 'Store Pickup'}
Time Slot: ${order.dateSlot || 'Weekend Hours (Sat/Sun 8AM-8PM)'}
Payment Method: ${order.paymentMethod || 'Venmo / Cash'}

ITEMS ORDERED:
${itemsText}

TOTAL AMOUNT: $${(order.total || 0).toFixed(2)}
ORDER NOTES: ${order.note || 'None'}

Thank you for supporting Self-Made Sweet Co.!
Handcrafted in Natomas, Sacramento, CA 95834.
----------------------------------------`;
}

/**
 * Generates a pre-filled mailto URL for instant 1-click email sending
 */
export function generateMailtoReceiptUrl(order) {
  const recipient = order.email ? `${order.email},jmedrano707@yahoo.com` : 'jmedrano707@yahoo.com';
  const subject = encodeURIComponent(`Self-Made Sweet Co. Order Receipt #${order.id || 'ORD'}`);
  const body = encodeURIComponent(formatOrderSummaryText(order));
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

/**
 * Sends Order Confirmation Email via EmailJS REST API with automatic Mailto fallback
 */
export async function sendOrderConfirmationEmail(order) {
  const config = getEmailConfig();
  console.log('📧 Email Service: Processing Order Confirmation Receipt for Order:', order.id);

  const itemsList = order.items.map(i => `${i.qty || 1}x ${i.name} ($${((i.unitPrice || i.price || 0) * (i.qty || 1)).toFixed(2)})`).join('\n• ');

  const templateParams = {
    order_id: order.id,
    customer_name: order.customerName,
    customer_email: order.email,
    customer_phone: order.phone || 'N/A',
    fulfillment: order.fulfillment,
    date_slot: order.dateSlot,
    payment_method: order.paymentMethod,
    items_summary: `• ${itemsList}`,
    total_price: `$${(order.total || 0).toFixed(2)}`,
    order_notes: order.note || 'No special instructions',
    baker_email: 'jmedrano707@yahoo.com'
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        template_params: templateParams
      })
    });

    if (response.ok) {
      console.log('✅ Automated Email Confirmation Sent Successfully via EmailJS!');
      return { success: true, method: 'API' };
    } else {
      console.warn('⚠️ EmailJS API Notice (Credentials Pending) — Activating Direct Email Receipt Fallback');
      // Automatically trigger mailto link as fallback
      window.location.href = generateMailtoReceiptUrl(order);
      return { success: true, method: 'Mailto' };
    }
  } catch (error) {
    console.error('⚠️ Email Service Network Notice — Activating Direct Email Receipt Fallback:', error);
    window.location.href = generateMailtoReceiptUrl(order);
    return { success: true, method: 'Mailto' };
  }
}
