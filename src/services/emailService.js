/**
 * Email Notification Service for Self-Made Sweet Co.
 * Uses EmailJS HTTP API to send order confirmation emails to customers & Julian.
 */

// Default configuration keys (replace with your EmailJS credentials)
const EMAILJS_CONFIG = {
  serviceId: 'service_selfmadesweetco',
  templateId: 'template_order_confirm',
  publicKey: 'user_selfmadesweetco_key'
};

export async function sendOrderConfirmationEmail(order) {
  try {
    const itemsList = order.items.map(i => `${i.qty}x ${i.name} ($${(i.price * (i.qty || 1)).toFixed(2)})`).join('\n• ');

    const templateParams = {
      order_id: order.id,
      customer_name: order.customerName,
      customer_email: order.email,
      customer_phone: order.phone || 'N/A',
      fulfillment: order.fulfillment,
      date_slot: order.dateSlot,
      payment_method: order.paymentMethod,
      items_summary: `• ${itemsList}`,
      total_price: `$${order.total.toFixed(2)}`,
      order_notes: order.note || 'No special instructions',
      baker_email: 'jmedrano707@yahoo.com'
    };

    console.log('Sending EmailJS Order Notification:', templateParams);

    // Call EmailJS REST API directly
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.publicKey,
        template_params: templateParams
      })
    });

    if (response.ok) {
      console.log('✅ Email notification sent successfully via EmailJS!');
      return { success: true };
    } else {
      console.warn('EmailJS response warning:', response.statusText);
      return { success: false, fallback: true };
    }
  } catch (error) {
    console.error('EmailJS notification error:', error);
    return { success: false, error };
  }
}
