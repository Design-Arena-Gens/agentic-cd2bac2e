import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/hf';

function fallbackPlan(goal: string) {
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1).map((w) => ({
    week: w,
    topic: `${goal}: Week ${w}`,
    resources: [
      { title: `${goal} - Free course`, url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(goal) },
      { title: 'Documentation', url: 'https://www.google.com/search?q=' + encodeURIComponent(goal + ' docs') },
    ],
    tasks: [
      `Study ${goal} for 4 hours`,
      `Build a small project related to ${goal}`,
    ],
  }));
  return { goal, durationWeeks: 12, weeks };
}

export async function POST(req: NextRequest) {
  const { goal = 'Learn Next.js' } = await req.json().catch(() => ({}));
  const prompt = `You are a career coach. Create a concise 12-week learning plan for the goal: "${goal}". Output JSON with schema { goal, durationWeeks, weeks: [{ week, topic, resources: [{title,url}], tasks: [string] }] }. Keep each list short and actionable.`;
  const text = await generateText('mistralai/Mistral-7B-Instruct-v0.2', prompt, 700);
  try {
    const jsonStart = text.indexOf('{');
    const json = JSON.parse(jsonStart >= 0 ? text.slice(jsonStart) : text);
    if (json?.weeks?.length) return NextResponse.json(json);
  } catch {}
  return NextResponse.json(fallbackPlan(goal));
}
