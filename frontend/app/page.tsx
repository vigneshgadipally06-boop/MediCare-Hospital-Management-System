import Link from "next/link";

export default function Home() {
  return (
    <main className="shell">
      <header className="top">
        <div className="brand">
          ✚ Medi<span>Care</span>
        </div>

        <nav className="nav">
          <Link href="/doctors">Patient Portal</Link>
          <Link href="/login">Login</Link>
          <Link href="/admin">Admin Portal</Link>
          <Link href="/register">Register</Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p>CARE, COORDINATED</p>
          <h1>Better care, with less waiting.</h1>
          <p>
            Find a specialist, book an appointment, and keep track of your care
            in one place.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn light" href="/doctors">
              Find a doctor
            </Link>
            <Link className="btn secondary" href="/register">
              Create an account
            </Link>
          </div>
        </div>
        <div aria-hidden="true" style={{ fontSize: 72 }}>
          🏥
        </div>
      </section>

      <section className="section">
        <h2>Your care, made simpler</h2>
        <div className="grid two">
          <article className="card">
            <h3>Find the right specialist</h3>
            <p className="muted">
              Browse available doctors and choose the care that fits your needs.
            </p>
            <Link href="/doctors">Browse doctors →</Link>
          </article>
          <article className="card">
            <h3>Manage appointments</h3>
            <p className="muted">
              Sign in to book visits and view your appointment details.
            </p>
            <Link href="/login">Go to patient login →</Link>
          </article>
        </div>
      </section>
    </main>
  );
}