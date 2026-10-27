"""Validate the static export at both a domain root and a repository subpath."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, urljoin, unquote
import json
import re

ROOT = Path(__file__).resolve().parent
DOCS = ROOT / 'docs'


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.images = []
        self.ids = set()
        self.h1 = 0
        self.has_title = False
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'title':
            self.in_title = True
        if tag == 'img':
            self.images.append(attrs)
        for key in ('href', 'src'):
            if attrs.get(key):
                self.references.append(attrs[key])
        for variant in attrs.get('srcset', '').split(','):
            if variant.strip():
                self.references.append(variant.strip().split()[0])

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, text):
        if self.in_title and text.strip():
            self.has_title = True


pages = {}
for path in DOCS.rglob('index.html'):
    page = Page()
    page.feed(path.read_text(encoding='utf-8'))
    pages[path.resolve()] = page

errors = []
expected_wa = json.loads((ROOT / 'content/site.json').read_text(encoding='utf-8'))['whatsapp']
wa_count = 0
for path, page in pages.items():
    label = str(path.relative_to(DOCS))
    if page.h1 != 1 or not page.has_title:
        errors.append(f'{label}: needs one H1 and a nonempty page title')
    for image in page.images:
        if 'alt' not in image or (image.get('src') and not image['alt'].strip()):
            errors.append(f'{label}: image needs an accessible description')
    for reference in page.references:
        parsed = urlsplit(reference)
        if parsed.netloc == 'wa.me':
            wa_count += 1
            if reference != expected_wa:
                errors.append(f'{label}: unexpected WhatsApp destination')
        if parsed.scheme or parsed.netloc:
            continue
        if parsed.path.startswith('/'):
            errors.append(f'{label}: root-relative reference breaks project hosting: {reference}')
        relative_page = path.relative_to(DOCS).as_posix()
        for mount in ('/', '/example-repository/'):
            page_url = 'https://example.invalid' + mount + relative_page.removesuffix('index.html')
            resolved = urlsplit(urljoin(page_url, reference))
            if not resolved.path.startswith(mount):
                errors.append(f'{label}: reference escapes project: {reference}')
                continue
            target = (DOCS / unquote(resolved.path[len(mount):])).resolve()
            if target.is_dir():
                target /= 'index.html'
            if not target.is_file():
                errors.append(f'{label}: missing target for {reference}')
            # #past is an intentional JavaScript-controlled album tab.
            elif resolved.fragment and resolved.fragment != 'past' and target in pages and unquote(resolved.fragment) not in pages[target].ids:
                errors.append(f'{label}: missing anchor in {reference}')

for css in DOCS.rglob('*.css'):
    for reference in re.findall(r'url\([\'\"]?([^\)\'\"]+)', css.read_text(encoding='utf-8')):
        if urlsplit(reference).scheme:
            continue
        if reference.startswith('/') or not (css.parent / reference).is_file():
            errors.append(f'{css.name}: broken asset {reference}')

if len(pages) < 15:
    errors.append('Expected at least 15 pages')
if not (DOCS / '.nojekyll').exists():
    errors.append('Missing docs/.nojekyll')
if wa_count == 0:
    errors.append('Missing WhatsApp enquiry links')

if errors:
    raise SystemExit('\n'.join(sorted(set(errors))))
print(f'PASS: {len(pages)} pages; links, anchors, scripts, styles, images and {wa_count} WhatsApp links.')
print('PASS: domain-root and GitHub project-subpath hosting.')
