import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate, allow } from "../middleware/auth.js";
const router = Router();
router.use(authenticate, allow("ADMIN"));
router.get("/overview", async (_req,res,next) => {
  try {
    const [patients,doctors,appointments,waiting] = await Promise.all([
      prisma.user.count({where:{role:"PATIENT"}}),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.queueEntry.count({where:{status:"WAITING"}})
    ]);
    res.json({patients,doctors,appointments,waiting});
  } catch(e) { next(e); }
});
router.post("/doctors", async (req,res,next) => {
  try {
    const {name,email,password,departmentId,specialization,consultationFee=500} = req.body;
    if (!name || !email || !password || !departmentId || !specialization) return res.status(400).json({message:"Missing required fields"});
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.default.hash(password,12);
    const user = await prisma.user.create({data:{name,email,passwordHash,role:"DOCTOR"}});
    const doctor = await prisma.doctor.create({data:{userId:user.id,departmentId,specialization,consultationFee}});
    res.status(201).json(doctor);
  } catch(e) { next(e); }
});
export default router;
