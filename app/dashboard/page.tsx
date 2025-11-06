"use client";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function getWeekKey(d: Date) {
  const onejan = new Date(d.getFullYear(), 0, 1);
  const millis = d.getTime() - onejan.getTime();
  const week = Math.ceil((millis / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

export default function DashboardPage() {
  const [weekly, setWeekly] = useState<Record<string, number>>({});
  const [skill, setSkill] = useState('JavaScript');
  const [hours, setHours] = useState(2);

  useEffect(() => {
    const saved = localStorage.getItem('aca-weekly');
    if (saved) setWeekly(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('aca-weekly', JSON.stringify(weekly));
  }, [weekly]);

  const logHours = () => {
    const key = getWeekKey(new Date());
    setWeekly((w) => ({ ...w, [key]: (w[key] || 0) + Number(hours) }));
  };

  const labels = Object.keys(weekly).sort();
  const data = labels.map((k) => weekly[k]);
  const avg = data.map((_, i) => {
    const window = data.slice(Math.max(0, i - 3), i + 1);
    const mean = window.reduce((a, b) => a + b, 0) / Math.max(1, window.length);
    return Number(mean.toFixed(2));
  });

  return (
    <div className="grid gap-lg">
      <h2>Progress Dashboard</h2>
      <section className="block">
        <div className="row gap">
          <input value={skill} onChange={(e) => setSkill(e.target.value)} />
          <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
          <button className="btn" onClick={logHours}>Log Hours This Week</button>
        </div>
        <p style={{ color: '#475569', marginTop: 6 }}>Track your weekly study hours. Simple moving average shows trend.</p>
      </section>
      <section className="block">
        <Line
          data={{
            labels,
            datasets: [
              { label: `${skill} hours`, data, borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.2)' },
              { label: 'Moving Avg', data: avg, borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.2)' },
            ],
          }}
          options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
        />
      </section>
      <section className="block">
        <form action="/api/stripe/create-checkout" method="POST">
          <button className="btn">Upgrade to Pro ($9)</button>
          <span style={{ marginLeft: 10, color: '#475569' }}>Unlock unlimited scans, paths, and matches.</span>
        </form>
      </section>
    </div>
  );
}
