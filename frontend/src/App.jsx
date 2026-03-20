import { useEffect, useState } from 'react';
import { authenticate, fetchNotices, fetchOverview, fetchResults, fetchStudents } from './api/client';
import './styles.css';

export default function App() {
  const [overview, setOverview] = useState(null);
  const [students, setStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');

  useEffect(() => {
    Promise.all([fetchOverview(), fetchStudents(), fetchNotices(), fetchResults()])
      .then(([ov, studentPayload, noticePayload, resultsPayload]) => {
        setOverview(ov);
        setStudents(studentPayload.students);
        setNotices(noticePayload.notices);
        setResults(resultsPayload.results);
      })
      .catch((err) => setError(err.message || 'Unable to load portal data'));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginStatus('');
    setError('');
    const { email, password } = Object.fromEntries(new FormData(event.target));
    try {
      const payload = await authenticate({ email, password });
      setToken(payload.token);
      setLoginStatus(payload.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Vignan's University</p>
          <h1>Parent Portal</h1>
          <p className="lede">
            Keep track of attendance, notices, and academic highlights in a single dashboard.
          </p>
        </div>
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Parent Sign-in</h2>
          <label>
            Email
            <input name="email" type="email" placeholder="parent@vignan.edu" required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="welcome123" required />
          </label>
          <button type="submit" disabled={loginLoading}>
            {loginLoading ? 'Signing in…' : 'Sign in'}
          </button>
          {loginStatus && <p className="success">{loginStatus}</p>}
          {token && <p className="token-preview">Session token: {token.slice(0, 16)}…</p>}
        </form>
      </header>

      {error && <p className="error-banner">{error}</p>}

      <section className="overview-grid">
        {[
          { label: 'Students tracked', value: overview?.totalStudents ?? '—' },
          { label: 'Notices live', value: overview?.totalNotices ?? '—' },
          { label: 'Top performers', value: overview?.topStudents?.join(', ') ?? '—' },
          { label: 'Avg. attendance', value: overview?.averageAttendance ?? '—' }
        ].map((metric) => (
          <article key={metric.label} className="metric-card">
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="panel-grid">
        <article className="panel">
          <h2>Latest Notices</h2>
          <ul className="notice-list">
            {notices.map((notice) => (
              <li key={notice.id}>
                <div>
                  <strong>{notice.title}</strong>
                  <p className="meta">
                    {notice.audience} · {notice.date}
                  </p>
                </div>
                <p className="notice-summary">{notice.summary}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Student Snapshot</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.grade}</td>
                  <td>{student.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <h2>Recent Results</h2>
          <ul className="result-list">
            {results.slice(0, 3).map((result) => (
              <li key={result.id}>
                <span>
                  {result.student} · {result.subject}
                </span>
                <strong>{result.grade}</strong>
                <p className="meta">{result.status}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
