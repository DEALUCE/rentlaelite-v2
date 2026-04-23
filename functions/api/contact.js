// POST /api/contact
// 1. Saves lead to Google Sheet via Apps Script webhook
// 2. Sends PDF brochure email via Resend

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { name, email, phone, moveIn, leaseLength, message, source } = body;
  if (!email) return json({ error: 'Email required' }, 400);

  const timestamp = new Date().toISOString();
  const results   = {};

  // ── 1. GOOGLE SHEET ──────────────────────────────────────────────────────
  if (env.SHEET_WEBHOOK_URL) {
    try {
      await fetch(env.SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp, name, email, phone, moveIn, leaseLength, message, source: source || 'contact-form' }),
      });
      results.sheet = 'ok';
    } catch (e) {
      results.sheet = 'error: ' + e.message;
    }
  }

  // ── 2. RESEND — BROCHURE EMAIL ────────────────────────────────────────────
  if (env.RESEND_API_KEY && email) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Daniel Issak <daniel@theissakgroup.com>',
          to:   [email],
          subject: 'Your property brochure — 9432 & 9430 Oakmore Rd, Beverlywood',
          html: brochureHtml(name),
        }),
      });
      results.email = res.ok ? 'ok' : await res.text();
    } catch (e) {
      results.email = 'error: ' + e.message;
    }
  }

  // ── 3. NOTIFY DANIEL ─────────────────────────────────────────────────────
  if (env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Oakmore Lead <daniel@theissakgroup.com>',
          to:   ['dan.issak@gmail.com'],
          subject: `New inquiry: ${name || email} — ${source || 'contact form'}`,
          html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone}</p><p><b>Move-in:</b> ${moveIn}</p><p><b>Lease:</b> ${leaseLength}</p><p><b>Message:</b> ${message}</p><p><b>Source:</b> ${source}</p><p><b>Time:</b> ${timestamp}</p>`,
        }),
      });
    } catch (_) {}
  }

  return json({ ok: true, results });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
  });
}

function brochureHtml(name) {
  const firstName = (name || 'there').split(' ')[0];
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:Georgia,serif;color:#e2e8f0">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">
  <tr><td style="background:#0a0e1a;padding:40px 40px 0">
    <p style="color:#f59e0b;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0">The Issak Group · DRE# 02037760</p>
    <h1 style="color:#ffffff;font-size:28px;margin:16px 0 4px;font-weight:400">9432 &amp; 9430 Oakmore Rd</h1>
    <p style="color:#94a3b8;font-size:13px;margin:0">Beverlywood · Beverly Hills Adjacent · Los Angeles CA 90035</p>
  </td></tr>

  <tr><td style="padding:32px 40px">
    <p style="color:#e2e8f0;font-size:15px;line-height:1.6">Hi ${firstName},</p>
    <p style="color:#94a3b8;font-size:14px;line-height:1.7">Thank you for your inquiry. Here are the full property details for the Oakmore compound — one of the best-positioned luxury rentals for the FIFA 2026 window in Los Angeles.</p>
  </td></tr>

  <tr><td style="padding:0 40px">
    <table width="100%" style="background:#111827;border:1px solid #1e3a5f;padding:24px">
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e293b">
        <span style="color:#94a3b8;font-size:11px;letter-spacing:2px;text-transform:uppercase">Monthly Rent</span>
        <span style="color:#f59e0b;font-size:18px;font-weight:600;float:right">$34,999/mo</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e293b">
        <span style="color:#94a3b8;font-size:12px">Bedrooms / Bathrooms</span>
        <span style="color:#e2e8f0;font-size:12px;float:right">5 BR / 6 BA</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e293b">
        <span style="color:#94a3b8;font-size:12px">Combined Living Space</span>
        <span style="color:#e2e8f0;font-size:12px;float:right">4,492 sqft</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e293b">
        <span style="color:#94a3b8;font-size:12px">Guest House</span>
        <span style="color:#e2e8f0;font-size:12px;float:right">~400 sqft · private entrance</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e293b">
        <span style="color:#94a3b8;font-size:12px">SoFi Stadium</span>
        <span style="color:#e2e8f0;font-size:12px;float:right">15 min</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e293b">
        <span style="color:#94a3b8;font-size:12px">Beverly Hills</span>
        <span style="color:#e2e8f0;font-size:12px;float:right">8 min</span>
      </td></tr>
      <tr><td style="padding:8px 0">
        <span style="color:#94a3b8;font-size:12px">Available</span>
        <span style="color:#e2e8f0;font-size:12px;float:right">May – Aug 2026 · FIFA Window</span>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 40px">
    <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0 0 16px"><b style="color:#e2e8f0">Key Amenities:</b> Heated pool &amp; spa · Steam sauna · Chef's kitchen (dual ovens, ceramic island) · EV charging · Ring security · Smart home · Fully furnished · Move-in ready</p>
  </td></tr>

  <tr><td style="padding:0 40px 32px;text-align:center">
    <a href="https://master.rentlaelite-v2.pages.dev/brief" style="display:inline-block;background:#f59e0b;color:#0a0e1a;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:16px 32px;margin-bottom:12px">View One-Page Brief →</a>
    <br>
    <a href="https://master.rentlaelite-v2.pages.dev" style="display:inline-block;color:#f59e0b;text-decoration:none;font-size:11px;letter-spacing:2px;text-transform:uppercase">Full Property Website</a>
  </td></tr>

  <tr><td style="background:#111827;padding:24px 40px;border-top:1px solid #1e3a5f">
    <p style="color:#e2e8f0;font-size:13px;margin:0 0 4px"><b>Daniel Issak</b> · DRE# 02037760</p>
    <p style="color:#94a3b8;font-size:12px;margin:0">Real Estate Source, Inc. · 424-272-5935 · dan.issak@gmail.com</p>
    <p style="color:#94a3b8;font-size:12px;margin:8px 0 0">Showings by appointment · 24-hour notice required</p>
  </td></tr>
</table>
</body>
</html>`;
}
