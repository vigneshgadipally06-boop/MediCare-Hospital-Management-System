
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    patients: number;
    doctors: number;
    appointments: number;
    waiting: number;
  } | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("medicare_token");
    if (!token) {
      setError("Sign in with an admin account to access the admin portal.");
      return;
    }

    let user: { role?: string } | null;
    try {
      user = JSON.parse(localStorage.getItem("medicare_user") || "null");
    } catch {
      setError("Your saved sign-in is invalid. Sign in again to continue.");
      return;
    }

    if (user?.role !== "ADMIN") {
      setError("Access denied. Sign out and sign in with an admin account.");
      return;
    }

    api("/admin/overview")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  const cards = stats
    ? [
        ["Total Patients", stats.patients, "👥"],
        ["Total Doctors", stats.doctors, "👨‍⚕️"],
        ["Appointments", stats.appointments, "📅"],
        ["Waiting Patients", stats.waiting, "⏳"]
      ]
    : [];

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

      {stats && <section className="grid">
        {cards.map(([title, value, icon]) => (
          <div className="card" key={String(title)}>
            <div style={{ fontSize: 30 }}>{icon}</div>
            <p className="muted">{title}</p>
            <div className="stat">{value}</div>
          </div>
        ))}
      </section>}

      {error && (
        <p className="error">
          {error} <Link href="/login">Sign in with another account</Link>
        </p>
      )}

      <h2>Hospital Management</h2>

      <section className="grid two">
        <Link href="/doctor-queue" className="card">
          <h2>🎫 Queue Management</h2>
          <p className="muted">
            Admins and doctors can view waiting patients, call the next token
            and complete consultations.
          </p>
          <span className="btn">Manage Queue →</span>
        </Link>

        <Link href="/doctors" className="card">
          <h2>👨‍⚕️ Doctor Directory</h2>
          <p className="muted">
            Browse hospital doctors and their departments.
          </p>
          <span className="btn">View Doctors →</span>
        </Link>

        <div className="card">
          <h2>📅 Appointments</h2>
          <p className="muted">
            Patients can view their appointments from the patient dashboard.
          </p>
        </div>

        <Link href="/doctor-queue" className="card">
          <h2>📊 Patient Queue</h2>
          <p className="muted">
            Admins and doctors can monitor the hospital's daily queue.
          </p>
          <span className="btn">Open Queue →</span>
        </Link>
      </section>
    </main>
  );
}
