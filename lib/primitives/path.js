const SEP = '/';
const WIN_SEP = '\\';

const detectSep = () => {
  if (typeof process !== 'undefined' && process.platform === 'win32') {
    return WIN_SEP;
  }
  return SEP;
};

const DEFAULT_SEP = detectSep();

const normalize = (p, sep = DEFAULT_SEP) => {
  const isAbsolute = p.startsWith(SEP) || p.startsWith(WIN_SEP);
  const normalized = p.replace(/\\/g, SEP);
  const parts = normalized.split(SEP);
  const result = [];

  for (const part of parts) {
    if (part === '..') {
      result.pop();
    } else if (part !== '.' && part !== '') {
      result.push(part);
    }
  }

  const joined = result.join(sep);
  return isAbsolute ? sep + joined : joined || '.';
};

export const join = (...args) => normalize(args.join(SEP));

export const dirname = (p, sep = DEFAULT_SEP) => {
  const normalized = p.replace(/\\/g, SEP);
  const trimmed = normalized.endsWith(SEP) ? normalized.slice(0, -1) : normalized;
  const idx = trimmed.lastIndexOf(SEP);

  if (idx === -1) return '.';
  if (idx === 0) return sep; // racine absolue ex: /foo -> /
  return trimmed.slice(0, idx).replace(/\//g, sep);
};

export default {
  join,
  dirname,
};
