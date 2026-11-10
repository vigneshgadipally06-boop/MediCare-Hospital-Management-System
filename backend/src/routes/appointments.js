import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authenticate, allow } from "../middleware/auth.js";
const router = Router();
router.use(authenticate);
router.post("/", allow("PATIENT"), async (req,res,next) => {
  try {
    const body = z.object({ doctorId:z.string(), appointmentAt:z.string().datetime(), reason:z.string().min(3).max(500) }).parse(req.body);
    const when = new Date(body.appointmentAt);
    if (when < new Date()) return res.status(400).json({ message:"Appointment must be in the future" });
    const doctor = await prisma.doctor.findFirst({ where:{ id:body.doctorId, available:true } });
    if (!doctor) return res.status(404).json({ message:"Doctor not found or unavailable" });
    const conflict = await prisma.appointment.findFirst({
      where:{ doctorId:body.doctorId, appointmentAt:when, status:{ not:"CANCELLED" } }
    });
    if (conflict) return res.status(409).json({ message:"This slot is already booked. Choose another time." });
    const appointment = await prisma.appointment.create({
      data:{ patientId:req.user.id, doctorId:body.doctorId, appointmentAt:when, reason:body.reason },
      include:{ doctor:{ include:{ user:{select:{name:true}}, department:true } } }
    });
    res.status(201).json(appointment);
  } catch(e) { next(e); }
});
router.get("/my", allow("PATIENT"), async (req,res,next) => {
  try {
    const rows = await prisma.appointment.findMany({
      where:{ patientId:req.user.id },
      include:{ doctor:{include:{user:{select:{name:true}},department:true}}, queueEntry:true },
      orderBy:{ appointmentAt:"desc" }
    });
    res.json(rows);
  } catch(e) { next(e); }
});
router.patch("/:id/cancel", allow("PATIENT","ADMIN"), async (req,res,next) => {
  try {
    const row = await prisma.appointment.findUnique({ where:{id:req.params.id} });
    if (!row) return res.status(404).json({message:"Appointment not found"});
    if (req.user.role === "PATIENT" && row.patientId !== req.user.id) return res.status(403).json({message:"Not your appointment"});
    if (["COMPLETED","CANCELLED"].includes(row.status)) return res.status(400).json({message:"Appointment cannot be cancelled"});
    const updated = await prisma.appointment.update({where:{id:row.id},data:{status:"CANCELLED"}});
    await prisma.queueEntry.updateMany({where:{appointmentId:row.id},data:{status:"SKIPPED"}});
    res.json(updated);
  } catch(e) { next(e); }
});
export default router;
