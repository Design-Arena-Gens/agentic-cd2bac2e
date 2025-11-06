import { NextRequest, NextResponse } from 'next/server';
import { zeroShotClassify } from '@/lib/hf';

const ROLE_SKILLS: Record<string, string[]> = {
  'software engineer': [
    'javascript','typescript','react','next.js','node.js','python','java','go','sql','no-sql','docker','kubernetes','aws','git','testing','unit tests','integration tests','rest','graphql','ci/cd','design patterns','system design'
  ],
  'data scientist': [
    'python','pandas','numpy','scikit-learn','pytorch','tensorflow','statistics','probability','bayesian','experiment design','sql','ml','nlp','computer vision','feature engineering','model evaluation','deployment','mlops'
  ],
  'product manager': [
    'roadmap','stakeholders','user research','analytics','kpis','a/b testing','prioritization','agile','scrum','wireframes','prds','competitive analysis'
  ],
  'designer': [
    'figma','prototyping','visual design','ux','ui','heuristics','accessibility','design systems','usability testing','stakeholder feedback','handoff'
  ],
};

const SOFT_SKILLS = [
  'communication','collaboration','leadership','problem solving','ownership','adaptability','mentorship','impact','growth mindset'
];

export async function POST(req: NextRequest) {
  const { resumeText = '', targetRole = 'software engineer' } = await req.json().catch(() => ({}));
  if (!resumeText || typeof resumeText !== 'string') {
    return NextResponse.json({ error: 'resumeText required' }, { status: 400 });
  }
  const roleKey = String(targetRole).toLowerCase();
  const skills = ROLE_SKILLS[roleKey] ?? [...new Set([...ROLE_SKILLS['software engineer'], ...SOFT_SKILLS])];

  const lower = resumeText.toLowerCase();
  const present = skills.filter(s => lower.includes(s.toLowerCase()));
  const missing = skills.filter(s => !lower.includes(s.toLowerCase())).slice(0, 10);

  // Optional zero-shot enrichment
  const zsc = await zeroShotClassify(['Strong', 'Average', 'Weak'], resumeText);
  const overall = zsc?.labels?.[0] || (present.length > skills.length * 0.6 ? 'Strong' : present.length > skills.length * 0.35 ? 'Average' : 'Weak');

  const suggestions = [
    ...missing.map(s => `Add concrete evidence of ${s} (projects, metrics, or links).`),
    'Quantify impact with metrics (e.g., reduced latency by 30%, saved $50k/year).',
    'Use action verbs and concise bullet points (avoid walls of text).',
    'Move most relevant experience to the top and tailor for the role.',
  ].slice(0, 8);

  const score = Math.round((present.length / Math.max(1, skills.length)) * 100);

  return NextResponse.json({
    role: roleKey,
    score,
    summary: overall,
    presentSkills: present,
    missingSkills: missing,
    suggestions,
  });
}
