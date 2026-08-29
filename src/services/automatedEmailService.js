/**
 * 100% Automated Background Email Service for Self-Made Sweet Co.
 * Connects via Vercel Serverless Backend Route /api/send-email for 100% reliable background email dispatch.
 */

export function getResendApiKey() {
  try {
    const saved = localStorage.getItem('julians_resend_api_key');
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {
    console.error('Failed to load resend key from localStorage', e);
  }

  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_RESEND_API_KEY || 
           import.meta.env.VITE_SelfMadeSweetCoBakery || 
           import.meta.env.SelfMadeSweetCoBakery || 
           '';
  }
  return '';
}

export function saveResendApiKey(key) {
  try {
    localStorage.setItem('julians_resend_api_key', key.trim());
  } catch (e) {
    console.error('Failed to save resend key to localStorage', e);
  }
}

export async function sendAutomatedBackgroundReceipt(order, customResendKey = '') {
  console.log('⚡ Automated Background Email Agent: Dispatching receipt for Order:', order.id);

  const resendApiKey = customResendKey || getResendApiKey();

  // 1. Try Vercel Serverless Function Endpoint /api/send-email (Bypasses Browser CORS)
  try {
    const serverlessResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: order,
        apiKey: resendApiKey
      })
    });

    if (serverlessResponse.ok) {
      console.log('✅ Vercel Serverless Backend Resend Email Dispatched Successfully!');
      return { success: true, provider: 'Vercel-Serverless-Resend' };
    }
  } catch (err) {
    console.warn('Vercel serverless endpoint notice:', err);
  }

  // 2. Direct Resend Client Fallback
  if (resendApiKey) {
    try {
      const itemsList = (order.items || []).map(i => `• ${i.qty || 1}x ${i.name} ($${((i.unitPrice || i.price || 0) * (i.qty || 1)).toFixed(2)})`).join('<br/>');
      const trackUrl = `https://self-made-sweet-co.vercel.app/?track=${order.id || 'ORD'}`;

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
        console.log('✅ Direct Resend Email Dispatched Successfully!');
        return { success: true, provider: 'Direct-Resend' };
      }
    } catch (err) {
      console.warn('Direct Resend client notice:', err);
    }
  }

  return { success: false, fallback: true };
}
