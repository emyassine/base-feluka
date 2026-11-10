export type SiteTitleParts = {
  full: string;
  parts: [string, string];
};

export function canWrap(full: string, parts: [string, string]): SiteTitleParts {
  return { full, parts };
}
