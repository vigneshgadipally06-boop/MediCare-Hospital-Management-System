# MediCare – Hospital Appointment & Queue Management System

Intermediate full-stack project built with Next.js, Express, PostgreSQL and Prisma.

## Features
- Patient registration and login (JWT)
- Role-based patient, doctor and admin access
- Browse doctors and departments
- Book and cancel appointments
- Appointment status management
- Queue token generation and queue status
- Admin overview and doctor management endpoints

## Requirements
Node.js 20+, PostgreSQL 14+, npm.

## 1. Configure the backend
```bash
cd backend
cp .env.example .env
# Set DATABASE_URL and JWT_SECRET in .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
Backend runs at http://localhost:5000.

## 2. Configure the frontend
In another terminal:
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
Frontend runs at http://localhost:3000.
The frontend proxies `/api` requests to `BACKEND_API_ORIGIN` (default
`http://127.0.0.1:5000`), so the backend must be running while using the app.

To open the app from another device on your local network, start the frontend
with `npm run dev -- --hostname 0.0.0.0` and visit
`http://<server-lan-ip>:3000`. Keep `BACKEND_API_ORIGIN` pointed at the API
address reachable from the machine running Next.js; browser requests stay on
the frontend origin and do not use the visitor's `localhost`.

## Demo accounts (after seeding)
- Admin: admin@medicare.local / Admin@123
- Doctor: doctor@medicare.local / Doctor@123
- Patient: patient@medicare.local / Patient@123

Change demo passwords before any real deployment.

## API overview
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/doctors`
- POST `/api/appointments` (patient)
- GET `/api/appointments/my` (patient)
- PATCH `/api/appointments/:id/cancel`
- GET `/api/queue/today`
- PATCH `/api/queue/:id/status` (doctor/admin)
- GET `/api/admin/overview` (admin)

## Notes
This is an educational project starter, not a production clinical system. It does not store medical records or provide clinical decision support. Add production-grade validation, audit logging, rate limiting, email/SMS notifications, backups, HTTPS, and privacy/security review before real use.
