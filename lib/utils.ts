export function cosineSimilarity(a: number[], b: number[]) {
  if (a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function keywordScore(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  let hits = 0;
  for (const k of keywords) {
    if (lower.includes(k.toLowerCase())) hits += 1;
  }
  return hits / Math.max(1, keywords.length);
}

export function getOrigin(req: Request) {
  const hdr = req.headers.get('origin') || req.headers.get('x-forwarded-host');
  if (!hdr) return '';
  if (hdr.includes('http')) return hdr;
  return `https://${hdr}`;
}
