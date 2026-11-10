
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting MediCare dataset insertion...");

  const passwordHash = await bcrypt.hash("Demo@123", 10);

  // 1. Create departments
  const departmentNames = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "General Medicine"
  ];

  const departments = {};

  for (const name of departmentNames) {
    departments[name] = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  // 2. Create admin
  await prisma.user.upsert({
    where: { email: "admin@medicare.local" },
    update: { passwordHash, role: "ADMIN" },
    create: {
      name: "Hospital Administrator",
      email: "admin@medicare.local",
      passwordHash,
      role: "ADMIN"
    }
  });

  // 3. Create doctors
  const doctorData = [
    ["Dr. Ananya Rao", "ananya@medicare.local", "Cardiology", "Cardiologist", 800],
    ["Dr. Rahul Sharma", "rahul@medicare.local", "Neurology", "Neurologist", 900],
    ["Dr. Priya Reddy", "priya@medicare.local", "Orthopedics", "Orthopedic Surgeon", 700],
    ["Dr. Arjun Kumar", "arjun@medicare.local", "Dermatology", "Dermatologist", 600],
    ["Dr. Sneha Patel", "sneha@medicare.local", "General Medicine", "General Physician", 500]
  ];

  const doctors = [];

  for (const [name, email, department, specialization, fee] of doctorData) {
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: "DOCTOR" },
      create: {
        name,
        email,
        passwordHash,
        role: "DOCTOR"
      }
    });

    const doctor = await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        departmentId: departments[department].id,
        specialization,
        consultationFee: fee
      }
    });

    doctors.push(doctor);
  }

  // 4. Create 10 patients
  const patientNames = [
    "Vikram Reddy",
    "Kavya Sharma",
    "Arun Kumar",
    "Divya Rao",
    "Sai Krishna",
    "Meghana Patel",
    "Rohit Verma",
    "Sravani Reddy",
    "Kiran Kumar",
    "Anjali Singh"
  ];

  const patients = [];

  for (let i = 0; i < patientNames.length; i++) {
    const email = `patient${i + 1}@medicare.local`;

    const patient = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: "PATIENT" },
      create: {
        name: patientNames[i],
        email,
        passwordHash,
        phone: `98765000${String(i + 1).padStart(2, "0")}`,
        role: "PATIENT"
      }
    });

    patients.push(patient);
  }

  // 5. Create 15 appointments
  const reasons = [
    "Regular health checkup",
    "Headache and migraine",
    "Back pain",
    "Skin allergy",
    "Chest discomfort",
    "Fever and cold",
    "Joint pain",
    "Blood pressure check",
    "Follow-up consultation",
    "General consultation",
    "Heart checkup",
    "Knee pain",
    "Skin infection",
    "Neurological consultation",
    "Annual health examination"
  ];

  const now = new Date();

  function appointmentTime(dayOffset, hour) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, 0, 0, 0);
    return date;
  }

  for (let i = 0; i < 15; i++) {
    const doctor = doctors[i % doctors.length];
    const patient = patients[i % patients.length];

    // First three appointments are scheduled for today.
    const dayOffset = i < 3 ? 0 : Math.floor(i / 3);
    const hour = 9 + (i % 6);

    const appointmentAt = appointmentTime(dayOffset, hour);

    const existing = await prisma.appointment.findFirst({
      where: {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentAt
      }
    });

    if (existing) continue;

    const status = i === 0
      ? "IN_PROGRESS"
      : i === 1
      ? "CHECKED_IN"
      : "BOOKED";

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentAt,
        reason: reasons[i],
        status,
        tokenNumber: i < 2 ? i + 1 : null
      }
    });

    // Queue entries for the first two appointments.
    if (i < 2) {
      await prisma.queueEntry.create({
        data: {
          appointmentId: appointment.id,
          tokenNumber: i + 1,
          status: i === 0 ? "IN_PROGRESS" : "WAITING"
        }
      });
    }
  }

  console.log("--------------------------------");
  console.log("MediCare dataset inserted!");
  console.log("Departments: 5");
  console.log("Doctors: 5");
  console.log("Patients: 10");
  console.log("Appointments: 15 (maximum)");
  console.log("Queue entries: 2 (maximum)");
  console.log("--------------------------------");
}

main()
  .catch((error) => {
    console.error("Dataset insertion failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
