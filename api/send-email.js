/**
 * Vercel Serverless Function for Resend Automated Email Dispatch
 * Runs securely on Vercel's Node.js backend — bypasses browser CORS restrictions!
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order, apiKey } = req.body || {};

    const resendKey = apiKey || process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || process.env.VITE_SelfMadeSweetCoBakery || process.env.SelfMadeSweetCoBakery;

    if (!resendKey) {
      return res.status(400).json({ error: 'Resend API key missing in environment' });
    }

    const itemsList = (order.items || []).map(i => `• ${i.qty || 1}x ${i.name} ($${((i.unitPrice || i.price || 0) * (i.qty || 1)).toFixed(2)})`).join('<br/>');
    const trackUrl = `https://self-made-sweet-co.vercel.app/?track=${order.id || 'ORD'}`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Self-Made Sweet Co. <onboarding@resend.dev>',
        to: order.email ? [order.email, 'jmedrano707@yahoo.com'] : ['jmedrano707@yahoo.com'],
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

    const data = await resendResponse.json();

    if (resendResponse.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(resendResponse.status).json({ error: data });
    }
  } catch (err) {
    console.error('Serverless function resend error:', err);
    return res.status(500).json({ error: err.message });
  }
}
