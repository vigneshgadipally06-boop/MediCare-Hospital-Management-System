import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate, allow } from "../middleware/auth.js";
const router = Router();
router.use(authenticate);
router.post("/check-in/:appointmentId", allow("PATIENT","ADMIN"), async (req,res,next) => {
  try {
    const appt = await prisma.appointment.findUnique({where:{id:req.params.appointmentId}});
    if (!appt) return res.status(404).json({message:"Appointment not found"});
    if (req.user.role === "PATIENT" && appt.patientId !== req.user.id) return res.status(403).json({message:"Not your appointment"});
    if (appt.status !== "BOOKED") return res.status(400).json({message:"Only booked appointments can check in"});
    const existing = await prisma.queueEntry.findUnique({where:{appointmentId:appt.id}});
    if (existing) return res.json(existing);
    const dayStart = new Date(appt.appointmentAt); dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate()+1);
    const count = await prisma.queueEntry.count({where:{appointment:{doctorId:appt.doctorId,appointmentAt:{gte:dayStart,lt:dayEnd}}}});
    const entry = await prisma.$transaction(async tx => {
      const q = await tx.queueEntry.create({data:{appointmentId:appt.id,tokenNumber:count+1}});
      await tx.appointment.update({where:{id:appt.id},data:{status:"CHECKED_IN",tokenNumber:count+1}});
      return q;
    });
    res.status(201).json(entry);
  } catch(e) { next(e); }
});
router.get("/today", allow("DOCTOR","ADMIN"), async (req,res,next) => {
  try {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(end.getDate()+1);
    const rows = await prisma.queueEntry.findMany({
      where:{appointment:{appointmentAt:{gte:start,lt:end}, ...(req.user.role==="DOCTOR" ? {doctor:{userId:req.user.id}} : {})}},
      include:{appointment:{include:{patient:{select:{name:true,phone:true}},doctor:{include:{user:{select:{name:true}}}}}}},
      orderBy:{tokenNumber:"asc"}
    });
    res.json(rows);
  } catch(e) { next(e); }
});
router.patch("/:id/status", allow("DOCTOR","ADMIN"), async (req,res,next) => {
  try {
    const { status } = req.body;
    if (!["IN_PROGRESS","COMPLETED","SKIPPED","WAITING"].includes(status))
      return res.status(400).json({message:"Invalid queue status"});
    const row = await prisma.queueEntry.findUnique({where:{id:req.params.id},include:{appointment:{include:{doctor:true}}}});
    if (!row) return res.status(404).json({message:"Queue entry not found"});
    if (req.user.role==="DOCTOR" && row.appointment.doctor.userId!==req.user.id) return res.status(403).json({message:"Not your queue"});
    const updated = await prisma.$transaction(async tx => {
      const q = await tx.queueEntry.update({where:{id:row.id},data:{status}});
      const apptStatus = status==="IN_PROGRESS" ? "IN_PROGRESS" : status==="COMPLETED" ? "COMPLETED" : status==="SKIPPED" ? "CANCELLED" : "CHECKED_IN";
      await tx.appointment.update({where:{id:row.appointmentId},data:{status:apptStatus}});
      return q;
    });
    res.json(updated);
  } catch(e) { next(e); }
});
export default router;
