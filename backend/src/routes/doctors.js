import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
router.get("/", async (req,res,next) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { available:true, ...(req.query.department ? { department:{ name:{ contains:String(req.query.department), mode:"insensitive" } } } : {}) },
      include:{ user:{ select:{ name:true,email:true } }, department:true },
      orderBy:{ user:{ name:"asc" } }
    });
    res.json(doctors);
  } catch(e) { next(e); }
});
export default router;
