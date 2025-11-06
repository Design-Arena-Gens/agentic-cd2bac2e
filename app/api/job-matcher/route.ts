import { NextRequest, NextResponse } from 'next/server';
import { embed } from '@/lib/hf';
import { cosineSimilarity, keywordScore } from '@/lib/utils';

async function fetchJobs(query: string) {
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('jobs fetch failed');
  const data = await res.json();
  return (data?.jobs ?? []).slice(0, 30).map((j: any) => ({
    id: j.id,
    title: j.title,
    company: j.company_name,
    url: j.url,
    location: j.candidate_required_location,
    description: j.description?.replace(/<[^>]+>/g, '')?.slice(0, 2000) ?? '',
  }));
}

export async function POST(req: NextRequest) {
  const { query = 'software engineer', resumeText = '' } = await req.json().catch(() => ({}));
  const jobs = await fetchJobs(query).catch(() => [] as any[]);
  const resumeVec = resumeText ? await embed(resumeText) : null;

  const scorer = async (text: string) => {
    if (resumeVec) {
      const v = await embed(text);
      if (v) return cosineSimilarity(resumeVec, v);
    }
    const kws = query.split(/\s+/).filter(Boolean);
    return keywordScore((resumeText + ' ' + text), kws);
  };

  const scored: any[] = [];
  for (const job of jobs) {
    const sim = await scorer(`${job.title}. ${job.description}`);
    scored.push({ ...job, fitScore: Math.round(sim * 100) });
  }
  scored.sort((a, b) => b.fitScore - a.fitScore);
  return NextResponse.json({ query, count: scored.length, jobs: scored });
}
