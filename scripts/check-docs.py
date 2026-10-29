#!/usr/bin/env python3
"""Check first-party documentation navigation and optional migration provenance."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs-new'
TECHNICAL = DOCS / 'technical'
LINK = re.compile(r'!?\[[^\]\n]*\]\(([^\s)]+)\)')
NAME = re.compile(r'\d{2}\.[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z]{2}\.md$')


def prose(text):
    """Exclude fenced code examples when inspecting Markdown links/headings."""
    fence = None
    for line in text.splitlines():
        match = re.match(r'^\s*(`{3,}|~{3,})', line)
        if match:
            mark = match[1]
            if fence is None:
                fence = mark
            elif mark[0] == fence[0] and len(mark) >= len(fence):
                fence = None
            continue
        if fence is None:
            yield line


def anchors(path):
    found, counts = set(), {}
    for line in prose(path.read_text()):
        heading = re.match(r'^#{1,6}\s+(.+)', line)
        if heading:
            label = heading[1].strip().rstrip('#').rstrip()
            label = re.sub(r'\[([^]]+)\]\([^)]*\)', r'\1', label)
            slug = ''.join(c for c in label.lower() if c.isalnum() or c in ' _-').replace(' ', '-')
            count = counts.get(slug, 0)
            counts[slug] = count + 1
            found.add(slug if count == 0 else f'{slug}-{count}')
        found.update(re.findall(r'(?:id|name)=["\x27]([^"\x27]+)', line))
    return found


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--migration', action='store_true', help='verify retained source bodies against migration manifest')
    args = parser.parse_args()
    errors = []
    pages = sorted(DOCS.rglob('*.md'))
    consumers = [ROOT / 'README.md', ROOT / 'AGENTS.md', ROOT / 'crates/platform/feluqa-console/DEPENDENCIES.md']
    graph = {}
    checked = 0
    for page in pages + consumers:
        if page in pages and page.name != 'DOCS_GUIDELINES.md' and not NAME.fullmatch(page.name):
            errors.append(f'{page.relative_to(ROOT)}: invalid page name')
        graph[page.resolve()] = set()
        for line in prose(page.read_text()):
            for match in LINK.finditer(line):
                url = match[1]
                if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', url) or url.startswith('/'):
                    continue
                target, _, fragment = unquote(url).partition('#')
                destination = (page.parent / target).resolve() if target else page.resolve()
                checked += 1
                if not destination.exists():
                    errors.append(f'{page.relative_to(ROOT)}: missing {url}')
                elif fragment and destination.suffix == '.md' and fragment not in anchors(destination):
                    errors.append(f'{page.relative_to(ROOT)}: missing anchor {url}')
                graph[page.resolve()].add(destination)
    reachable, queue = set(), [(DOCS / '00.index.en.md').resolve()]
    while queue:
        page = queue.pop()
        if page in reachable:
            continue
        reachable.add(page)
        queue.extend(graph.get(page, set()) - reachable)
    for page in pages:
        if page.resolve() not in reachable:
            errors.append(f'{page.relative_to(ROOT)}: unreachable from index')
    retained = 0
    if args.migration:
        manifest = json.loads((TECHNICAL / 'migration-manifest.json').read_text())
        sources = set()
        for record in manifest['records']:
            if record['source'] in sources:
                errors.append(f"duplicate migration source: {record['source']}")
            sources.add(record['source'])
            text = (ROOT / record['destination']).read_text()
            match = re.search(r'<!-- migrated-source:start -->\n(.*)\n<!-- migrated-source:end -->', text, re.S)
            if not match or hashlib.sha256(match[1].encode()).hexdigest() != record['migrated_body_sha256']:
                errors.append(f"{record['destination']}: retained body differs from migration baseline")
            retained += 1
    for error in errors:
        print(error, file=sys.stderr)
    print(f'{len(pages)} pages; {checked} local links; {retained} retained bodies checked; {len(errors)} errors.')
    return bool(errors)


if __name__ == '__main__':
    sys.exit(main())
