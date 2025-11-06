import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid gap-lg">
      <section className="hero">
        <h1>Level up your career with open AI</h1>
        <p>
          Personalized resume insights, 12-week learning plans, job matching, interview prep,
          and a progress dashboard ? all powered by open models.
        </p>
        <div className="row gap">
          <Link className="btn" href="/resume">Get Started</Link>
          <Link className="btn secondary" href="/learning">Build a Learning Path</Link>
        </div>
      </section>
      <section className="grid cards">
        <Link href="/resume" className="card">
          <h3>Resume Analyzer ?</h3>
          <p>Identify gaps and get actionable improvements.</p>
        </Link>
        <Link href="/learning" className="card">
          <h3>Learning Paths ?</h3>
          <p>Goal-based 12-week plans using free resources.</p>
        </Link>
        <Link href="/jobs" className="card">
          <h3>Job Matcher ?</h3>
          <p>Scan job boards and rank by fit score.</p>
        </Link>
        <Link href="/interview" className="card">
          <h3>Interview Prep ?</h3>
          <p>Role-specific questions with AI feedback.</p>
        </Link>
        <Link href="/dashboard" className="card">
          <h3>Progress Dashboard ?</h3>
          <p>Weekly insights and skill tracking.</p>
        </Link>
      </section>
      <section className="note">
        <p>
          Free tier: 3 scans/month, 1 path, 10 matches. Upgrade to Pro for unlimited usage.
        </p>
      </section>
    </div>
  );
}
