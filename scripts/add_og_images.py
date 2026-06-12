import io, os, re

ROOT = os.path.join(os.path.dirname(__file__), '..', 'src', 'pages')

MAP = {
    'super-bowl-2027-housing-los-angeles.astro': '/images/fifa-hero.jpg',
    'olympics-2028-housing-los-angeles.astro': '/images/fifa-aerial.jpg',
    'awards-season-housing-los-angeles.astro': '/images/living-1.jpg',
    'luxury-rental-near-sofi-stadium.astro': '/images/fifa-2026-la.jpg',
    'luxury-rental-near-lax.astro': '/images/exterior-1.jpg',
    'fifa-world-cup-2026-los-angeles-rental.astro': '/images/fifa-pool-night.jpg',
    'fifa-2026-executive-housing-los-angeles.astro': '/images/fifa-living-room.jpg',
    'case-study-fifa-booking.astro': '/images/fifa-pool-night.jpg',
    'kosher-kitchen-luxury-rental-los-angeles.astro': '/images/kitchen-1.jpg',
    'pico-robertson-kosher-rental.astro': '/images/kitchen-2.jpg',
    'corporate-housing-los-angeles.astro': '/images/office.jpg',
    'executive-rental-beverly-hills.astro': '/images/office-1.jpg',
    'production-housing-los-angeles.astro': '/images/living-2.jpg',
    'medical-stay-near-cedars-sinai.astro': '/images/primary-suite-1.jpg',
    'insurance-housing-los-angeles.astro': '/images/exterior-2.jpg',
    'gallery.astro': '/images/pool-1.jpg',
    'beverly-hills-luxury-rentals.astro': '/images/DJI_20250122125346_0953_D.jpg',
    'beverly-hills-market-report.astro': '/images/DJI_20250122125449_0960_D.jpg',
    'beverlywood-neighborhood-guide.astro': '/images/exterior-3.jpg',
    'beverlywood-90035-luxury-homes-for-rent.astro': '/images/exterior-4.jpg',
    'furnished-rental-los-angeles-90035.astro': '/images/living-1.jpg',
    'furnished-monthly-rental-los-angeles.astro': '/images/dining-1.jpg',
    'short-term-luxury-rental-west-los-angeles.astro': '/images/pool-2.jpg',
    'gated-compound-rental-los-angeles.astro': '/images/exterior-1.jpg',
    '5-bedroom-luxury-rental-los-angeles.astro': '/images/bedroom-3.jpg',
    'luxury-rental-beverlywood.astro': '/images/guest-house-1.jpg',
}

for fname, img in MAP.items():
    path = os.path.join(ROOT, fname)
    if not os.path.exists(path):
        print('MISSING', fname); continue
    with io.open(path, 'r', encoding='utf-8') as f:
        src = f.read()
    m = re.search(r'<Layout\b[^>]*?>', src, re.S)
    if not m:
        print('NO LAYOUT TAG', fname); continue
    tag = m.group(0)
    if 'image=' in tag:
        print('SKIP (has image)', fname); continue
    new_tag = tag.replace('<Layout', '<Layout\n  image="%s"' % img, 1)
    src = src.replace(tag, new_tag, 1)
    with io.open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(src)
    print('OK', fname)
