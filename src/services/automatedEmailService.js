/**
 * 100% Automated Background Email Service for Self-Made Sweet Co.
 * Supports Resend.com (3,000 free emails/mo) & EmailJS for hands-free background emails.
 */

export async function sendAutomatedBackgroundReceipt(order, customResendKey = '') {
  console.log('⚡ Automated Background Email Agent: Dispatching receipt for Order:', order.id);

  const resendApiKey = customResendKey || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_RESEND_API_KEY ? import.meta.env.VITE_RESEND_API_KEY : '');

  const itemsList = (order.items || []).map(i => `• ${i.qty || 1}x ${i.name} ($${((i.unitPrice || i.price || 0) * (i.qty || 1)).toFixed(2)})`).join('<br/>');
  const trackUrl = `https://self-made-sweet-co.vercel.app/?track=${order.id || 'ORD'}`;

  // 1. Resend.com Direct Background Email Dispatch
  if (resendApiKey) {
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Self-Made Sweet Co. <onboarding@resend.dev>',
          to: ['jmedrano707@yahoo.com'],
          subject: `Order Confirmed! Self-Made Sweet Co. #${order.id}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #EFE4D6; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #2A1B17; color: #FFFFFF; padding: 24px; text-align: center;">
                <h2 style="color: #D4AF37; margin: 0;">Self-Made Sweet Co.</h2>
                <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: rgba(255,255,255,0.75);">Handcrafted Bakes • Sacramento, CA</p>
              </div>
              <div style="padding: 24px; color: #2A1B17;">
                <h3>Thank you, ${order.customerName}!</h3>
                <p>Julian has received your order <strong>#${order.id}</strong> in the kitchen!</p>
                <div style="background-color: #FAF7F2; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>Fulfillment:</strong> ${order.fulfillment}</p>
                  <p style="margin: 4px 0;"><strong>Time Slot:</strong> ${order.dateSlot}</p>
                  <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                </div>
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${trackUrl}" style="background-color: #C88242; color: #FFFFFF; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
                    🔎 Track Live Baking Status
                  </a>
                </div>
                <h4>Items Ordered:</h4>
                <p style="line-height: 1.6;">${itemsList}</p>
                <h3 style="color: #C88242; border-top: 1px solid #EFE4D6; padding-top: 12px;">Total Paid: $${(order.total || 0).toFixed(2)}</h3>
              </div>
            </div>
          `
        })
      });

      if (resendResponse.ok) {
        console.log('✅ Resend.com Background Email Dispatched Successfully!');
        return { success: true, provider: 'Resend' };
      }
    } catch (err) {
      console.warn('Resend API background error:', err);
    }
  }

  // 2. EmailJS REST API Background Dispatch
  try {
    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_selfmadesweetco',
        template_id: 'template_order_confirm',
        user_id: 'user_selfmadesweetco_key',
        template_params: {
          order_id: order.id,
          customer_name: order.customerName,
          customer_email: order.email,
          fulfillment: order.fulfillment,
          date_slot: order.dateSlot,
          total_price: `$${(order.total || 0).toFixed(2)}`,
          track_url: trackUrl,
          baker_email: 'jmedrano707@yahoo.com'
        }
      })
    });

    if (emailjsResponse.ok) {
      console.log('✅ EmailJS Background Email Dispatched!');
      return { success: true, provider: 'EmailJS' };
    }
  } catch (err) {
    console.warn('Background email dispatch notice:', err);
  }

  return { success: false, fallback: true };
}
