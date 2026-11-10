
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    waiting: 0
  });

  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/overview")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  const cards = [
    ["Total Patients", stats.patients, "👥"],
    ["Total Doctors", stats.doctors, "👨‍⚕️"],
    ["Appointments", stats.appointments, "📅"],
    ["Waiting Patients", stats.waiting, "⏳"]
  ];

  return (
    <main className="shell">
      <header className="top">
        <Link href="/" className="brand">
          ✚ MediCare Admin
        </Link>
        <button
          className="btn secondary"
          onClick={() => {
            localStorage.removeItem("medicare_token");
            localStorage.removeItem("medicare_user");
            location.href = "/login";
          }}
        >
          Logout
        </button>
      </header>

      <section className="hero">
        <div>
          <h1>Hospital Administration</h1>
          <p>Manage hospital operations and patient queues.</p>
        </div>
        <div style={{ fontSize: 65 }}>🏥</div>
      </section>

      <section className="grid">
        {cards.map(([title, value, icon]) => (
          <div className="card" key={String(title)}>
            <div style={{ fontSize: 30 }}>{icon}</div>
            <p className="muted">{title}</p>
            <div className="stat">{value}</div>
          </div>
        ))}
      </section>

      {error && <p className="error">{error}</p>}

      <h2>Hospital Management</h2>

      <section className="grid two">
        <Link href="/doctor-queue" className="card">
          <h2>🎫 Queue Management</h2>
          <p className="muted">
            View waiting patients, call next token and
            complete consultations.
          </p>
          <span className="btn">Manage Queue →</span>
        </Link>

        <Link href="/doctors" className="card">
          <h2>👨‍⚕️ Doctor Management</h2>
          <p className="muted">
            View hospital doctors and their departments.
          </p>
          <span className="btn">View Doctors →</span>
        </Link>

        <Link href="/dashboard" className="card">
          <h2>📅 Appointments</h2>
          <p className="muted">
            Access appointment information.
          </p>
          <span className="btn">View Appointments →</span>
        </Link>

        <Link href="/doctor-queue" className="card">
          <h2>📊 Patient Queue</h2>
          <p className="muted">
            Monitor the hospital's daily queue.
          </p>
          <span className="btn">Open Queue →</span>
        </Link>
      </section>
    </main>
  );
}
