"""
SEO drift detector.

Usage:
  python .seo-baseline/check-drift.py

Compares current live state of 5 critical sevennova.ai pages against
.seo-baseline/baseline.json. Exits 0 if no drift, 1 if drift detected.

Run after any deploy. Run weekly as a smoke test.
"""
import os, re, json, sys, hashlib, urllib.request, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
BASELINE_PATH = os.path.join(HERE, 'baseline.json')

CRITICAL_FIELDS = ['title', 'canonical', 'h1', 'upload_date', 'start_date', 'end_date']
WARN_FIELDS    = ['description_first_120', 'schema_types', 'mojibake_em_dash_count']

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'seo-drift/1.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

def extract(html_bytes):
    text = html_bytes.decode('utf-8', errors='ignore')
    def m(pat):
        x = re.search(pat, text, re.IGNORECASE | re.DOTALL)
        return x.group(1) if x else None
    h1 = m(r'<h1[^>]*>(.*?)</h1>')
    h1_text = re.sub(r'<[^>]+>', ' ', h1).strip() if h1 else None
    h1_text = re.sub(r'\s+', ' ', h1_text) if h1_text else None
    desc = m(r'<meta\s+name="description"\s+content="([^"]+)"')
    return {
        'title': m(r'<title>([^<]+)</title>'),
        'canonical': m(r'<link\s+rel="canonical"\s+href="([^"]+)"'),
        'description_first_120': desc[:120] if desc else None,
        'h1': h1_text,
        'schema_types': sorted(set(re.findall(r'"@type":"([^"]+)"', text))),
        'body_size_bytes': len(html_bytes),
        'body_sha256_short': hashlib.sha256(html_bytes).hexdigest()[:16],
        'upload_date': m(r'"uploadDate":"([^"]+)"'),
        'start_date':  m(r'"startDate":"([^"]+)"'),
        'end_date':    m(r'"endDate":"([^"]+)"'),
        'mojibake_em_dash_count': html_bytes.count(
            bytes([0xc3,0xa2,0xe2,0x82,0xac,0xe2,0x80,0x9d])
        ),
    }

def main():
    if not os.path.exists(BASELINE_PATH):
        print(f"ERROR: baseline not found at {BASELINE_PATH}", file=sys.stderr)
        return 2

    with open(BASELINE_PATH, 'r', encoding='utf-8') as f:
        baseline = json.load(f)

    print(f"drift check vs baseline captured {baseline['captured_at']}")
    print(f"checking {len(baseline['pages'])} pages on https://sevennova.ai\n")

    critical_drift = 0
    warn_drift = 0

    for url_path, base in baseline['pages'].items():
        try:
            current = extract(fetch('https://sevennova.ai' + url_path))
        except Exception as e:
            print(f"[ERROR] {url_path}: {e}")
            critical_drift += 1
            continue

        line_prefix = f"  {url_path}"
        page_critical = []
        page_warn = []

        for f in CRITICAL_FIELDS:
            if base.get(f) != current.get(f):
                page_critical.append((f, base.get(f), current.get(f)))

        for f in WARN_FIELDS:
            if base.get(f) != current.get(f):
                page_warn.append((f, base.get(f), current.get(f)))

        if not page_critical and not page_warn:
            print(f"[OK]    {url_path}")
            continue

        print(f"[DRIFT] {url_path}")
        for f, b, c in page_critical:
            print(f"        CRITICAL  {f}")
            print(f"          was: {b}")
            print(f"          now: {c}")
            critical_drift += 1
        for f, b, c in page_warn:
            # for schema_types, show the diff
            if f == 'schema_types':
                added = sorted(set(c or []) - set(b or []))
                removed = sorted(set(b or []) - set(c or []))
                if added or removed:
                    print(f"        WARN      {f}: +{added} -{removed}")
                    warn_drift += 1
            elif f == 'mojibake_em_dash_count' and (c or 0) > (b or 0):
                print(f"        WARN      {f}: was {b} now {c} (mojibake REGRESSION)")
                warn_drift += 1
            elif f != 'mojibake_em_dash_count':
                print(f"        WARN      {f}")
                print(f"          was: {b}")
                print(f"          now: {c}")
                warn_drift += 1

    print()
    print(f"summary: {critical_drift} critical drift, {warn_drift} warn drift")
    return 1 if critical_drift else 0

if __name__ == '__main__':
    sys.exit(main())
