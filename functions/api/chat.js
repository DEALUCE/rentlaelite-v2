const SYSTEM_PROMPT = `You are the AI concierge for 9432 Oakmore Rd — a gated luxury compound in Beverlywood, Beverly Hills adjacent, Los Angeles CA 90035. You represent The Issak Group and listing agent Daniel Issak (DRE# 02037760).

PROPERTY FACTS:
- 5 bedrooms / 6 bathrooms (5 full, 1 half)
- 4,092 sq ft main residence + 400 sq ft detached guest house = 4,492 sq ft combined
- $34,999/month — fully furnished with curated luxury interiors, move-in ready
- Minimum lease: 30 days | Preferred: 3–12 months
- Security deposit: $34,999 | Pets considered

AMENITIES:
- Heated pool & spa (gas-heated, in-ground, filtered)
- Steam sauna in primary suite
- Chef's kitchen: dual ovens, dual sinks, island, ceramic counters
- Detached guest house: separate entrance, full kitchen, full bath, separately metered (included in lease — may not be sublet)
- Gated driveway with automatic gate, Ring security system
- EV charging station on-site
- Multi-zone HVAC smart home, smart lighting, blackout shades
- In-unit washer/dryer, water conditioner & purifier
- Hardwood flooring upper level, Italian porcelain main level
- Decorative fireplace, walk-in closet

LOCATION:
- 5 min to Beverly Hills / S Beverly Dr
- 8 min to Century City / Fox Studios
- 10 min to Cedars-Sinai Medical Center
- 12 min to LAX
- 15 min to Santa Monica
- Walking distance to Pico-Robertson dining

LEASE TERMS:
- Tenant pays: electricity, gas, water, internet, pool maintenance, gardener, renter's insurance
- Application: CAR rental application, full credit report ($49.99), proof of income/funds, all docs as single PDF

CONTACT:
- Daniel Issak: 424-272-5935 (call/text) | dan.issak@gmail.com
- All showings by appointment, 24-hour notice required. Listing agent accompanies all showings.

TONE & RULES:
- Concierge-level elegance. Never pushy or salesy.
- Answer questions directly and confidently.
- When someone wants to schedule a tour: ask for their name, preferred date/time, and best contact (phone or email). Then confirm Daniel will reach them within 24 hours.
- If asked about price negotiation: the price is firm; serious applicants are reviewed promptly.
- Keep responses under 120 words unless a detailed answer is genuinely required.
- Never fabricate information not in this prompt. If unsure, direct them to call Daniel directly.`;

export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
    });
  }

  let messages;
  try {
    const body = await request.json();
    messages = (body.messages || []).slice(-12);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
    });
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
      stream: true,
    }),
  });

  if (!anthropicRes.ok) {
    return new Response(JSON.stringify({ error: 'AI unavailable' }), {
      status: 502,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
    });
  }

  return new Response(anthropicRes.body, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'access-control-allow-origin': '*',
    },
  });
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
