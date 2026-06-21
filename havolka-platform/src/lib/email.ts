import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = process.env.EMAIL_FROM || 'HAVOLKA <hello@havolka.com>'

// Base email template
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; }
    .header { background: #0A0A09; padding: 28px 32px; }
    .logo { color: #ffffff; font-size: 16px; letter-spacing: 0.2em; font-weight: 500; }
    .body { padding: 32px; color: #1a1a1a; font-size: 14px; line-height: 1.7; }
    .footer { padding: 20px 32px; border-top: 1px solid #eee; font-size: 11px; color: #999; }
    .btn { display: inline-block; background: #0A0A09; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 2px; font-size: 12px; letter-spacing: 0.08em; font-weight: 500; margin: 16px 0; }
    h2 { font-size: 22px; font-weight: 400; margin: 0 0 16px; color: #0A0A09; }
    p { margin: 0 0 14px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><div class="logo">HAVOLKA</div></div>
    <div class="body">${content}</div>
    <div class="footer">HAVOLKA · A Bechelet Design Group brand · Perth, WA · hello@havolka.com</div>
  </div>
</body>
</html>`
}

// Welcome email after approval
export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Welcome to HAVOLKA',
    html: baseTemplate(`
      <h2>Welcome, ${name}.</h2>
      <p>Your HAVOLKA membership has been approved. You now have access to trade pricing, the quote builder, and our full product range.</p>
      <p>A few things to get started:</p>
      <ul style="margin: 0 0 14px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Browse the full range and view trade pricing</li>
        <li style="margin-bottom: 8px;">Request finish samples — we'll post discs to your studio</li>
        <li style="margin-bottom: 8px;">Use the AI specification assistant to build a door schedule</li>
        <li style="margin-bottom: 8px;">Send us a floor plan and Rafe will map every product across your project</li>
      </ul>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal" class="btn">Go to your portal</a>
      <p>Your account manager will be in touch shortly. If you need anything in the meantime, reply to this email.</p>
      <p>Ben Bechelet<br>Founder, HAVOLKA</p>
    `),
  })
}

// Application received confirmation
export async function sendApplicationConfirmation(to: string, name: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Application received — HAVOLKA',
    html: baseTemplate(`
      <h2>Application received, ${name}.</h2>
      <p>Thanks for applying for HAVOLKA membership. We review all applications within one business day.</p>
      <p>You'll receive a confirmation email once your application has been reviewed. Most applications are approved same day.</p>
      <p>In the meantime, you're welcome to browse the full product range at havolka.com.</p>
      <p>Ben Bechelet<br>Founder, HAVOLKA</p>
    `),
  })
}

// Team notification — new application
export async function notifyTeamNewApplication(applicantName: string, company: string, tradeType: string) {
  await transporter.sendMail({
    from: FROM,
    to: [process.env.NOTIFY_BEN!, process.env.NOTIFY_KEZ!].join(','),
    subject: `New membership application — ${company}`,
    html: baseTemplate(`
      <h2>New application</h2>
      <p><strong>${applicantName}</strong> from <strong>${company}</strong> has applied for HAVOLKA membership.</p>
      <p>Trade type: ${tradeType}</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/hub/crm" class="btn">Review in BDG Hub</a>
    `),
  })
}

// Order dispatched
export async function sendOrderDispatched(to: string, name: string, orderNumber: string, poNumber?: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Order dispatched — ${orderNumber}`,
    html: baseTemplate(`
      <h2>Your order is on its way.</h2>
      <p>Order ${orderNumber}${poNumber ? ` / PO: ${poNumber}` : ''} has been dispatched and is heading to you.</p>
      <p>Estimated delivery: 2–5 business days depending on your location.</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/orders" class="btn">Track your order</a>
    `),
  })
}

// Schedule completed
export async function sendScheduleComplete(to: string, name: string, projectName: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Door schedule ready — ${projectName}`,
    html: baseTemplate(`
      <h2>Your door schedule is ready.</h2>
      <p>Rafe has completed the door schedule for <strong>${projectName}</strong> and it's available in your portal.</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/documents" class="btn">Download schedule</a>
      <p>If you have any questions or need changes, reply to this email or leave a note in your portal.</p>
    `),
  })
}

// Finish sample dispatched
export async function sendSampleDispatched(to: string, name: string, finishes: string[]) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Finish samples on their way',
    html: baseTemplate(`
      <h2>Your finish samples are on their way.</h2>
      <p>We're posting the following finish discs to your studio:</p>
      <ul style="margin: 0 0 14px; padding-left: 20px;">
        ${finishes.map(f => `<li style="margin-bottom: 6px;">${f}</li>`).join('')}
      </ul>
      <p>Allow 2–4 business days for delivery. Once you've had a chance to compare them, feel free to get in touch if you'd like to discuss specifications or request additional samples.</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/for-trade" class="btn">Apply for membership</a>
    `),
  })
}

// Quote expiring reminder
export async function sendQuoteExpiring(to: string, name: string, projectName: string, quoteId: string, daysLeft: number) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Quote expiring in ${daysLeft} days — ${projectName}`,
    html: baseTemplate(`
      <h2>Your quote expires in ${daysLeft} days.</h2>
      <p>The quote for <strong>${projectName}</strong> expires in ${daysLeft} days. Convert it to an order or contact us to extend.</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/quotes" class="btn">View quote</a>
    `),
  })
}

// Callback request — team notification
export async function notifyCallbackRequest(memberName: string, phone: string, notes?: string) {
  await transporter.sendMail({
    from: FROM,
    to: [process.env.NOTIFY_BEN!, process.env.NOTIFY_KEZ!].join(','),
    subject: `Callback requested — ${memberName}`,
    html: baseTemplate(`
      <h2>Callback requested</h2>
      <p><strong>${memberName}</strong> has requested a callback.</p>
      <p>Phone: ${phone}</p>
      ${notes ? `<p>Notes: ${notes}</p>` : ''}
      <p>Please call back within the hour.</p>
    `),
  })
}

// Lead capture notification
export async function notifyNewLead(source: string, name: string, email: string, company?: string, details?: string) {
  await transporter.sendMail({
    from: FROM,
    to: [process.env.NOTIFY_BEN!, process.env.NOTIFY_KEZ!].join(','),
    subject: `New lead — ${source} — ${name}`,
    html: baseTemplate(`
      <h2>New lead captured</h2>
      <p><strong>Source:</strong> ${source}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      ${details ? `<p><strong>Details:</strong> ${details}</p>` : ''}
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/hub/crm" class="btn">View in BDG Hub</a>
    `),
  })
}
