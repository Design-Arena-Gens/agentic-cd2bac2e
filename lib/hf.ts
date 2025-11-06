const HF_API_BASE = 'https://api-inference.huggingface.co/models';

function getHeaders() {
  const token = process.env.HF_TOKEN;
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (token) headers['authorization'] = `Bearer ${token}`;
  return headers;
}

export async function generateText(model: string, prompt: string, max_new_tokens = 512) {
  try {
    const res = await fetch(`${HF_API_BASE}/${model}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens, temperature: 0.3 } }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HF text gen failed: ${res.status}`);
    const data = await res.json();
    const text = Array.isArray(data) ? data[0]?.generated_text ?? '' : (data.generated_text ?? JSON.stringify(data));
    return String(text);
  } catch (e) {
    return '';
  }
}

export async function zeroShotClassify(labels: string[], text: string) {
  try {
    const model = 'facebook/bart-large-mnli';
    const res = await fetch(`${HF_API_BASE}/${model}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ inputs: text, parameters: { candidate_labels: labels } }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('HF zsc failed');
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function embed(text: string): Promise<number[] | null> {
  try {
    const model = 'sentence-transformers/all-MiniLM-L6-v2';
    const res = await fetch(`${HF_API_BASE}/${model}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ inputs: text }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('HF embed failed');
    const data = await res.json();
    const vec = Array.isArray(data) ? data[0] : data;
    return Array.isArray(vec) ? (vec as number[]) : null;
  } catch {
    return null;
  }
}
