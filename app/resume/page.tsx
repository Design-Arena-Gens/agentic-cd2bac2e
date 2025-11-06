"use client";
import { useState } from 'react';

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('software engineer');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    const res = await fetch('/api/analyze-resume', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ resumeText, targetRole }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="grid gap-lg">
      <h2>Resume Analyzer</h2>
      <section className="block">
        <div className="grid" style={{ gap: 12 }}>
          <label>Target role</label>
          <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. software engineer" />
          <label>Paste your resume</label>
          <textarea rows={12} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste plain text resume..." />
          <div className="row gap">
            <button className="btn" onClick={analyze} disabled={!resumeText || loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
          </div>
        </div>
      </section>
      {result && (
        <section className="block">
          <h3>Results</h3>
          <p><strong>Role:</strong> {result.role}</p>
          <p><strong>Score:</strong> {result.score}/100 ({result.summary})</p>
          <div className="grid" style={{ gap: 8 }}>
            <div>
              <strong>Present skills</strong>
              <p>{result.presentSkills?.join(', ') || '?'}</p>
            </div>
            <div>
              <strong>Missing skills</strong>
              <p>{result.missingSkills?.join(', ') || '?'}</p>
            </div>
            <div>
              <strong>Suggestions</strong>
              <ul>
                {result.suggestions?.map((s: string, i: number) => (<li key={i}>{s}</li>))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
