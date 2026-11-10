import fs from 'node:fs';

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function listDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry: fs.Dirent) => entry.isDirectory())
    .map((entry: fs.Dirent) => entry.name);
}

export function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry: fs.Dirent) => entry.isFile())
    .map((entry: fs.Dirent) => entry.name);
}

export function readFileIfExists(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

export function writeIfChanged(filePath: string, contents: string): boolean {
  const prev = readFileIfExists(filePath);
  if (prev === contents) return false;
  
  fs.writeFileSync(filePath, contents);
  return true;
}

export function writeJsonIfChanged(filePath: string, data: any): boolean {
  const contents = JSON.stringify(data, null, 2);
  return writeIfChanged(filePath, contents);
}
