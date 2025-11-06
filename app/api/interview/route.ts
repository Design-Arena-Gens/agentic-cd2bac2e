import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/hf';

export async function POST(req: NextRequest) {
  const { role = 'software engineer', answer } = await req.json().catch(() => ({}));
  if (!answer) {
    const prompt = `Generate 5 concise interview questions for a ${role}. Output as a numbered list.`;
    const text = await generateText('mistralai/Mistral-7B-Instruct-v0.2', prompt, 300);
    const questions = text
      .split('\n')
      .map((l) => l.replace(/^\d+[).]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 5);
    return NextResponse.json({ role, questions });
  }
  const prompt = `You are an interviewer for a ${role}. Given the candidate's answer, provide concise, constructive feedback and a 1-10 score. Answer:
${answer}
Return JSON { feedback: string, score: number }.`;
  const text = await generateText('mistralai/Mistral-7B-Instruct-v0.2', prompt, 300);
  try {
    const jsonStart = text.indexOf('{');
    const json = JSON.parse(jsonStart >= 0 ? text.slice(jsonStart) : text);
    if (json?.feedback) return NextResponse.json(json);
  } catch {}
  return NextResponse.json({ feedback: 'Clearer structure and specific examples will strengthen your answer.', score: 7 });
}
