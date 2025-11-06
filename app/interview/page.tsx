"use client";
import { useEffect, useRef, useState } from 'react';

export default function InterviewPrepPage() {
  const [role, setRole] = useState('software engineer');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const recRef = useRef<any>(null);

  const loadQuestions = async () => {
    const res = await fetch('/api/interview', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role }) });
    const data = await res.json();
    setQuestions(data.questions || []);
  };

  useEffect(() => { loadQuestions(); }, []);

  const evaluate = async () => {
    setFeedback(null);
    const res = await fetch('/api/interview', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role, answer }) });
    const data = await res.json();
    setFeedback(data);
  };

  const toggleRecord = () => {
    const w: any = window as any;
    const Rec = (w.SpeechRecognition || w.webkitSpeechRecognition);
    if (!Rec) return alert('Speech recognition not supported in this browser');
    if (!recording) {
      const rec = new Rec();
      rec.continuous = true; rec.lang = 'en-US';
      rec.onresult = (e: any) => {
        const t = Array.from(e.results).map((r: any) => r[0].transcript).join(' ');
        setAnswer((prev) => (prev ? prev + ' ' : '') + t);
      };
      rec.start();
      recRef.current = rec; setRecording(true);
    } else {
      recRef.current?.stop(); recRef.current = null; setRecording(false);
    }
  };

  return (
    <div className="grid gap-lg">
      <h2>Interview Prep</h2>
      <section className="block">
        <div className="grid" style={{ gap: 12 }}>
          <label>Role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} />
          <div className="row gap">
            <button className="btn" onClick={loadQuestions}>Generate Questions</button>
          </div>
        </div>
      </section>
      {questions.length > 0 && (
        <section className="block">
          <h3>Questions</h3>
          <ol>
            {questions.map((q, i) => (<li key={i}>{q}</li>))}
          </ol>
        </section>
      )}
      <section className="block">
        <h3>Your Answer</h3>
        <textarea rows={8} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Speak or type your answer..." />
        <div className="row gap" style={{ marginTop: 8 }}>
          <button className="btn" onClick={toggleRecord}>{recording ? 'Stop Recording' : 'Record (Browser)'}</button>
          <button className="btn secondary" onClick={evaluate} disabled={!answer}>Get Feedback</button>
        </div>
      </section>
      {feedback && (
        <section className="block">
          <h3>Feedback</h3>
          <p><strong>Score:</strong> {feedback.score}/10</p>
          <p>{feedback.feedback}</p>
        </section>
      )}
    </div>
  );
}
