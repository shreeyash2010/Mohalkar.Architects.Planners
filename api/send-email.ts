// Vercel Serverless Function: /api/send-email
// Handles email sending from the contact and project enquiry form

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const {
      name,
      email,
      phone,
      location = "Maharashtra",
      type = "Residential",
      budget = "To be discussed",
      details = "",
      source = "Direct Website",
    } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, email, phone",
      });
    }

    const emailSubject = `New Project Enquiry: ${name} (${type.toUpperCase()}) - Mohalkar Architects`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #c8a96e; border-bottom: 2px solid #c8a96e; padding-bottom: 10px; margin-top: 0;">
          Mohalkar Architects &amp; Planners
        </h2>
        <h3 style="color: #1f2937;">New Client Consultation Brief</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px; font-weight: bold; color: #4b5563; width: 35%;">Client Name:</td>
            <td style="padding: 8px; color: #111827;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px; font-weight: bold; color: #4b5563;">Phone:</td>
            <td style="padding: 8px; color: #111827;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px; font-weight: bold; color: #4b5563;">Email:</td>
            <td style="padding: 8px; color: #111827;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px; font-weight: bold; color: #4b5563;">Location:</td>
            <td style="padding: 8px; color: #111827;">${location}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px; font-weight: bold; color: #4b5563;">Project Typology:</td>
            <td style="padding: 8px; color: #111827;">${type}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px; font-weight: bold; color: #4b5563;">Approximate Budget:</td>
            <td style="padding: 8px; color: #111827;">${budget}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px; font-weight: bold; color: #4b5563;">Referral Source:</td>
            <td style="padding: 8px; color: #111827;">${source}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #374151;">Project Brief &amp; Scope:</h4>
          <p style="margin: 0; white-space: pre-wrap; color: #1f2937; line-height: 1.5;">${details}</p>
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
          Sent via Mohalkar Architects &amp; Planners Online Enquiry Portal
        </p>
      </div>
    `;

    // 1. If RESEND_API_KEY is configured in Vercel Environment Variables
    if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Mohalkar Architects <onboarding@resend.dev>",
          to: [
            process.env.STUDIO_EMAIL || "mohalkararchitectsandplanners@gmail.com",
            "abhishekmohalkar0062@gmail.com",
          ],
          reply_to: email,
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      const resendData = await resendResponse.json();
      if (resendResponse.ok) {
        return res.status(200).json({
          success: true,
          provider: "resend",
          message: "Enquiry email successfully delivered!",
          data: resendData,
        });
      }
    }

    // 2. Fallback: FormSubmit relay
    const formSubmitResponse = await fetch(
      "https://formsubmit.co/ajax/mohalkararchitectsandplanners@gmail.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          project_location: location,
          project_type: type,
          approximate_budget: budget,
          referral_source: source,
          project_details: details,
          _subject: emailSubject,
          _cc: "abhishekmohalkar0062@gmail.com",
          _replyto: email,
          _template: "table",
          _captcha: "false",
        }),
      }
    );

    const formSubmitData = await formSubmitResponse.json().catch(() => ({}));
    return res.status(200).json({
      success: true,
      provider: "formsubmit",
      message: "Enquiry submitted and forwarded to studio emails!",
      data: formSubmitData,
    });
  } catch (error: any) {
    console.error("Vercel send-email API error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to process email dispatch",
    });
  }
}
