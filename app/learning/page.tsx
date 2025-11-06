"use client";
import { useState } from 'react';

export default function LearningPathPage() {
  const [goal, setGoal] = useState('Learn Next.js');
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setPlan(null);
    const res = await fetch('/api/generate-learning-path', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ goal }),
    });
    const data = await res.json();
    setPlan(data);
    setLoading(false);
  };

  return (
    <div className="grid gap-lg">
      <h2>Learning Paths</h2>
      <section className="block">
        <div className="grid" style={{ gap: 12 }}>
          <label>Goal</label>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Become a data scientist" />
          <div className="row gap">
            <button className="btn" onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate 12-week plan'}</button>
          </div>
        </div>
      </section>
      {plan && (
        <section className="block">
          <h3>{plan.goal} ({plan.durationWeeks} weeks)</h3>
          <div className="grid" style={{ gap: 10 }}>
            {plan.weeks?.map((w: any) => (
              <div key={w.week} className="card">
                <strong>Week {w.week}: {w.topic}</strong>
                <div>
                  <em>Resources</em>
                  <ul>
                    {w.resources?.map((r: any, i: number) => (
                      <li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <em>Tasks</em>
                  <ul>
                    {w.tasks?.map((t: string, i: number) => (<li key={i}>{t}</li>))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
