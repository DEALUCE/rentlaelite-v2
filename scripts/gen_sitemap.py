import io, os

BASE = 'https://sevennova.ai'
TODAY = '2026-06-12'

# (path, changefreq, priority)
URLS = [
    ('/luxury-rental', 'daily', '1.0'),
    ('/property', 'weekly', '0.9'),
    ('/gallery', 'monthly', '0.7'),
    ('/contact', 'monthly', '0.8'),
    ('/faq', 'monthly', '0.8'),
    ('/services', 'monthly', '0.7'),
    ('/results', 'monthly', '0.6'),
    ('/about', 'monthly', '0.6'),
    ('/apply', 'monthly', '0.8'),
    ('/brief', 'monthly', '0.5'),
    ('/beverly-hills-luxury-rentals', 'weekly', '0.9'),
    ('/beverly-hills-market-report', 'monthly', '0.8'),
    ('/fifa-world-cup-2026-los-angeles-rental', 'weekly', '0.7'),
    ('/fifa-2026-executive-housing-los-angeles', 'weekly', '0.7'),
    ('/case-study-fifa-booking', 'monthly', '0.8'),
    ('/super-bowl-2027-housing-los-angeles', 'weekly', '0.9'),
    ('/olympics-2028-housing-los-angeles', 'weekly', '0.9'),
    ('/awards-season-housing-los-angeles', 'weekly', '0.9'),
    ('/luxury-rental-near-sofi-stadium', 'weekly', '0.9'),
    ('/furnished-rental-los-angeles-90035', 'monthly', '0.8'),
    ('/furnished-monthly-rental-los-angeles', 'weekly', '0.9'),
    ('/luxury-rental-beverlywood', 'monthly', '0.8'),
    ('/beverlywood-90035-luxury-homes-for-rent', 'monthly', '0.8'),
    ('/beverlywood-neighborhood-guide', 'monthly', '0.8'),
    ('/short-term-luxury-rental-west-los-angeles', 'monthly', '0.8'),
    ('/kosher-kitchen-luxury-rental-los-angeles', 'monthly', '0.9'),
    ('/gated-compound-rental-los-angeles', 'monthly', '0.9'),
    ('/5-bedroom-luxury-rental-los-angeles', 'monthly', '0.9'),
    ('/corporate-housing-los-angeles', 'weekly', '0.9'),
    ('/executive-rental-beverly-hills', 'weekly', '0.9'),
    ('/insurance-housing-los-angeles', 'weekly', '0.9'),
    ('/medical-stay-near-cedars-sinai', 'weekly', '0.9'),
    ('/production-housing-los-angeles', 'weekly', '0.9'),
    ('/pico-robertson-kosher-rental', 'weekly', '0.9'),
    ('/luxury-rental-near-lax', 'weekly', '0.9'),
    ('/zoning', 'monthly', '0.8'),
    ('/zoning/r1-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/r2-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/r3-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/r4-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/r5-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/rd1-5-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/rd2-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/rd3-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/rd4-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/rd5-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/rd6-zone-los-angeles', 'monthly', '0.6'),
    ('/zoning/unit-calculator', 'monthly', '0.8'),
]

out = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for path, freq, pri in URLS:
    out += ['  <url>',
            '    <loc>%s%s</loc>' % (BASE, path),
            '    <lastmod>%s</lastmod>' % TODAY,
            '    <changefreq>%s</changefreq>' % freq,
            '    <priority>%s</priority>' % pri,
            '  </url>']
out.append('</urlset>')

dest = os.path.join(os.path.dirname(__file__), '..', 'public', 'sitemap.xml')
with io.open(dest, 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(out) + '\n')
print('wrote', len(URLS), 'urls')
