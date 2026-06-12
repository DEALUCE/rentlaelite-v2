import io, os, re, json

ROOT = os.path.join(os.path.dirname(__file__), '..', 'src', 'pages')

PAGES = {
    '/beverly-hills-luxury-rentals': ('Beverly Hills Luxury Rentals', 'Executive homes for lease in the Beverly Hills corridor'),
    '/beverly-hills-market-report': ('Beverly Hills Market Report', 'Current luxury rental pricing and demand data'),
    '/luxury-rental-beverlywood': ('Luxury Rental Beverlywood', 'The gated compound at 9432 Oakmore Rd'),
    '/beverlywood-neighborhood-guide': ('Beverlywood Neighborhood Guide', 'Schools, dining, synagogues, and commute times'),
    '/beverlywood-90035-luxury-homes-for-rent': ('Beverlywood 90035 Homes for Rent', 'Luxury homes for rent in ZIP 90035'),
    '/furnished-rental-los-angeles-90035': ('Furnished Rental LA 90035', 'Fully furnished, 30-day minimum'),
    '/super-bowl-2027-housing-los-angeles': ('Super Bowl LXI 2027 Housing', 'Reserve the February 2027 window'),
    '/fifa-world-cup-2026-los-angeles-rental': ('FIFA 2026 Rental (Booked)', 'Case study — the FIFA window'),
    '/olympics-2028-housing-los-angeles': ('Olympics 2028 Housing', 'LA28 executive housing'),
    '/awards-season-housing-los-angeles': ('Awards Season Housing', 'Oscars, Grammys, Emmys stays'),
    '/luxury-rental-near-sofi-stadium': ('Luxury Rental Near SoFi', '18 minutes to SoFi Stadium'),
    '/corporate-housing-los-angeles': ('Corporate Housing LA', 'Executive relocation and corporate leases'),
    '/executive-rental-beverly-hills': ('Executive Rental Beverly Hills', 'C-suite furnished housing'),
    '/production-housing-los-angeles': ('Production Housing LA', 'Film and TV production stays'),
    '/medical-stay-near-cedars-sinai': ('Medical Stay Near Cedars-Sinai', 'Recovery and treatment housing'),
    '/insurance-housing-los-angeles': ('Insurance / ALE Housing', 'Additional Living Expense placements'),
    '/kosher-kitchen-luxury-rental-los-angeles': ('Kosher Kitchen Luxury Rental', 'Dual sinks, dual ovens, walk to shul'),
}

SILOS = {
    'geo': ['/beverly-hills-luxury-rentals', '/beverly-hills-market-report', '/luxury-rental-beverlywood',
            '/beverlywood-neighborhood-guide', '/beverlywood-90035-luxury-homes-for-rent', '/furnished-rental-los-angeles-90035'],
    'event': ['/super-bowl-2027-housing-los-angeles', '/fifa-world-cup-2026-los-angeles-rental',
              '/olympics-2028-housing-los-angeles', '/awards-season-housing-los-angeles', '/luxury-rental-near-sofi-stadium'],
    'usecase': ['/corporate-housing-los-angeles', '/executive-rental-beverly-hills', '/production-housing-los-angeles',
                '/medical-stay-near-cedars-sinai', '/insurance-housing-los-angeles', '/kosher-kitchen-luxury-rental-los-angeles'],
}

HEADINGS = {'geo': 'Beverly Hills & Beverlywood Guide', 'event': 'Event-Driven Housing', 'usecase': 'Specialized Housing'}

for silo, paths in SILOS.items():
    for path in paths:
        fname = os.path.join(ROOT, path.lstrip('/') + '.astro')
        if not os.path.exists(fname):
            print('MISSING', fname); continue
        with io.open(fname, 'r', encoding='utf-8') as f:
            src = f.read()
        if 'RelatedLinks' in src:
            print('SKIP (has)', path); continue
        links = [{'label': PAGES[p][0], 'href': p, 'sub': PAGES[p][1]} for p in paths if p != path]
        comp = "\n  <RelatedLinks heading=\"%s\" links={%s} />\n</Layout>" % (HEADINGS[silo], json.dumps(links))
        if '</Layout>' not in src:
            print('NO LAYOUT CLOSE', path); continue
        src = src.replace('</Layout>', comp, 1)
        m = re.search(r"^import .*?;?\s*$", src, re.M)
        imp = "import RelatedLinks from '../components/RelatedLinks.astro';"
        src = src.replace(m.group(0), m.group(0) + '\n' + imp, 1)
        with io.open(fname, 'w', encoding='utf-8', newline='\n') as f:
            f.write(src)
        print('OK', path)
