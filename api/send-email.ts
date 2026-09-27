// Vercel Serverless Function: /api/send-email
// Handles email sending from the contact and project enquiry form

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, phone, email, location, typology, sqft, budget, message, submittedAt } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, Phone and Email are required.' });
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f6f2; color: #222; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2ded4; padding: 32px; border-radius: 2px; }
          .header { border-bottom: 2px solid #c8a96e; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { font-size: 20px; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a; margin: 0; }
          .header p { font-size: 11px; color: #888; text-transform: uppercase; margin-top: 4px; letter-spacing: 1px; }
          .metric-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .metric-table td { padding: 8px 12px; border: 1px solid #eee; font-size: 13px; }
          .metric-label { font-weight: bold; width: 35%; background: #fdfbf7; color: #666; font-size: 11px; text-transform: uppercase; }
          .message-box { background: #faf9f6; border-left: 3px solid #c8a96e; padding: 16px; font-size: 14px; line-height: 1.6; color: #333; margin-top: 16px; }
          .footer { margin-top: 32px; font-size: 11px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Mohalkar Architects &amp; Planners</h1>
            <p>New Architectural Project Brief Received</p>
          </div>

          <table class="metric-table">
            <tr>
              <td class="metric-label">Client Name</td>
              <td><strong>${name}</strong></td>
            </tr>
            <tr>
              <td class="metric-label">Phone / WhatsApp</td>
              <td><a href="tel:${phone}" style="color: #c8a96e; text-decoration: none; font-weight: bold;">${phone}</a></td>
            </tr>
            <tr>
              <td class="metric-label">Email</td>
              <td><a href="mailto:${email}" style="color: #222;">${email}</a></td>
            </tr>
            <tr>
              <td class="metric-label">Site Location</td>
              <td>${location || 'Not Specified'}</td>
            </tr>
            <tr>
              <td class="metric-label">Typology</td>
              <td><strong>${typology || 'Residential'}</strong></td>
            </tr>
            <tr>
              <td class="metric-label">Approx. Built-Up Area</td>
              <td>${sqft || 'Not Specified'}</td>
            </tr>
            <tr>
              <td class="metric-label">Project Budget</td>
              <td>${budget || 'To be discussed'}</td>
            </tr>
            <tr>
              <td class="metric-label">Timestamp</td>
              <td>${submittedAt || new Date().toISOString()}</td>
            </tr>
          </table>

          <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #888;">Project Brief &amp; Scope:</div>
          <div class="message-box">
            ${message ? message.replace(/\n/g, '<br>') : 'No extra message provided.'}
          </div>

          <div class="footer">
            Mohalkar Architects &amp; Planners · Studio Portal Notification
          </div>
        </div>
      </body>
    </html>
  `;

  // Check for RESEND_API_KEY environment variable if configured
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Mohalkar Studio Briefs <onboarding@resend.dev>',
          to: ['mohalkararchitectsandplanners@gmail.com'],
          cc: ['abhishekmohalkar0062@gmail.com'],
          reply_to: email,
          subject: `[New Brief] ${typology || 'Architectural'} Enquiry from ${name}`,
          html: emailHtml
        })
      });

      if (response.ok) {
        return res.status(200).json({ success: true, message: 'Dispatched via Resend API' });
      }
    } catch (e) {
      console.error('Resend delivery error:', e);
    }
  }

  // Fallback to FormSubmit proxy dispatch
  try {
    const fsResponse = await fetch('https://formsubmit.co/ajax/mohalkararchitectsandplanners@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: `New Project Brief: ${typology} from ${name}`,
        _cc: 'abhishekmohalkar0062@gmail.com',
        _replyto: email,
        name,
        phone,
        email,
        location,
        typology,
        sqft,
        budget,
        message,
        submittedAt
      })
    });

    const fsData = await fsResponse.json();
    return res.status(200).json({ success: true, data: fsData });
  } catch (error: any) {
    return res.status(200).json({ success: true, fallback: true });
  }
}
