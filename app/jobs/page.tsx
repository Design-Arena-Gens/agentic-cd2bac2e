"use client";
import { useState } from 'react';

export default function JobMatcherPage() {
  const [query, setQuery] = useState('software engineer');
  const [resumeText, setResumeText] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    setJobs([]);
    const res = await fetch('/api/job-matcher', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, resumeText }),
    });
    const data = await res.json();
    setJobs(data.jobs ?? []);
    setLoading(false);
  };

  return (
    <div className="grid gap-lg">
      <h2>Job Matcher</h2>
      <section className="block">
        <div className="grid" style={{ gap: 12 }}>
          <label>Search query</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. react developer" />
          <label>Paste your resume (optional, improves fit score)</label>
          <textarea rows={8} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
          <div className="row gap">
            <button className="btn" onClick={search} disabled={loading}>{loading ? 'Searching...' : 'Find jobs'}</button>
          </div>
        </div>
      </section>
      <section className="grid cards">
        {jobs.map(j => (
          <a key={j.id} href={j.url} target="_blank" rel="noreferrer" className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>{j.title}</strong>
              <span>{j.fitScore}% match</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', color: '#475569' }}>
              <span>{j.company}</span>
              <span>{j.location}</span>
            </div>
            <p style={{ marginTop: 8 }}>{j.description?.slice(0, 200)}...</p>
          </a>
        ))}
      </section>
    </div>
  );
}
