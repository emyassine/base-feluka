type FrontmatterData = Record<string, string | string[]>;

function stripQuotes(value: string): string {
  return value.replace(/^['"]|['"]$/g, '');
}

export function parseFrontmatter(content: string): {
  data: FrontmatterData;
  body: string;
} {
  if (!content.startsWith('---')) {
    return { data: {}, body: content };
  }
  
  const endIndex = content.indexOf('\n---', 3);
  if (endIndex === -1) {
    return { data: {}, body: content };
  }
  
  const raw = content.slice(3, endIndex).trim();
  const body = content.slice(endIndex + 4).replace(/^\s*\n/, '');
  
  const data: FrontmatterData = {};
  let currentKey: string | null = null;
  
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Handle list items
    const listMatch = trimmed.match(/^-\s+(.+)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      (data[currentKey] as string[]).push(stripQuotes(listMatch[1].trim()));
      continue;
    }
    
    // Handle key-value pairs
    const kvMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (!kvMatch) {
      currentKey = null;
      continue;
    }
    
    const key = kvMatch[1].trim();
    let value = kvMatch[2].trim();
    currentKey = key;
    
    // Empty value means array follows
    if (value === '') {
      data[key] = [];
      continue;
    }
    
    // Handle inline arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1);
      data[key] = value
        .split(',')
        .map(v => stripQuotes(v.trim()))
        .filter(Boolean);
      continue;
    }
    
    data[key] = stripQuotes(value);
  }
  
  return { data, body };
}

export function extractTitle(body: string): string {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}
