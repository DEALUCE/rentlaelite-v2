// POST /api/apply
// Pre-qualification form → Google Sheet + Daniel notification

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { name, email, phone, employer, income, creditScore, moveIn, leaseLength, occupants, pets, message } = body;
  if (!email) return json({ error: 'Email required' }, 400);

  const timestamp = new Date().toISOString();
  const results = {};

  // ── 1. GOOGLE SHEET ───────────────────────────────────────────────────────
  if (env.SHEET_WEBHOOK_URL) {
    try {
      await fetch(env.SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp, name, email, phone, employer, income, creditScore, moveIn, leaseLength, occupants, pets, message, source: 'pre-qual-form' }),
      });
      results.sheet = 'ok';
    } catch (e) {
      results.sheet = 'error: ' + e.message;
    }
  }

  // ── 2. NOTIFY DANIEL ─────────────────────────────────────────────────────
  if (env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Oakmore Pre-Qual <daniel@theissakgroup.com>',
          to: ['dan.issak@gmail.com'],
          subject: `Pre-Qual Application: ${name || email}`,
          html: `
            <h2 style="color:#f59e0b">New Pre-Qual Application — 9432 Oakmore Rd</h2>
            <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
              <tr><td style="padding:6px;color:#6b7280">Name</td><td style="padding:6px;color:#111"><strong>${name}</strong></td></tr>
              <tr><td style="padding:6px;color:#6b7280">Email</td><td style="padding:6px"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:6px;color:#6b7280">Phone</td><td style="padding:6px">${phone}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Employer</td><td style="padding:6px">${employer}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Annual Income</td><td style="padding:6px">${income}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Credit Score</td><td style="padding:6px">${creditScore}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Move-In</td><td style="padding:6px">${moveIn}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Lease Length</td><td style="padding:6px">${leaseLength}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Occupants</td><td style="padding:6px">${occupants}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Pets</td><td style="padding:6px">${pets}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Message</td><td style="padding:6px">${message}</td></tr>
              <tr><td style="padding:6px;color:#6b7280">Time</td><td style="padding:6px">${timestamp}</td></tr>
            </table>
          `,
        }),
      });
    } catch (_) {}
  }

  // ── 3. CONFIRMATION TO APPLICANT ─────────────────────────────────────────
  if (env.RESEND_API_KEY && email) {
    try {
      const firstName = (name || 'there').split(' ')[0];
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Daniel Issak <daniel@theissakgroup.com>',
          to: [email],
          subject: 'Your application — 9432 & 9430 Oakmore Rd, Beverlywood',
          html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:Georgia,serif;color:#e2e8f0">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">
  <tr><td style="padding:40px 40px 24px">
    <p style="color:#f59e0b;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0">The Issak Group · DRE# 02037760</p>
    <h1 style="color:#ffffff;font-size:24px;margin:16px 0 4px;font-weight:400">Application Received</h1>
  </td></tr>
  <tr><td style="padding:0 40px 32px">
    <p style="color:#e2e8f0;font-size:15px">Hi ${firstName},</p>
    <p style="color:#94a3b8;font-size:14px;line-height:1.7">Thank you for submitting your pre-qualification for <strong style="color:#e2e8f0">9432 & 9430 Oakmore Rd, Beverlywood</strong>. Daniel will review your application and reach out within 24 hours to discuss next steps.</p>
    <p style="color:#94a3b8;font-size:14px;line-height:1.7">If you have questions in the meantime, call or text: <strong style="color:#f59e0b">424-272-5935</strong></p>
  </td></tr>
  <tr><td style="background:#111827;padding:24px 40px;border-top:1px solid #1e3a5f">
    <p style="color:#e2e8f0;font-size:13px;margin:0 0 4px"><strong>Daniel Issak</strong> · DRE# 02037760</p>
    <p style="color:#94a3b8;font-size:12px;margin:0">Real Estate Source, Inc. · 424-272-5935 · dan.issak@gmail.com</p>
  </td></tr>
</table></body></html>`,
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
