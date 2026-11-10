import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
const router = Router();
const registerSchema = z.object({
  name: z.string().min(2), email: z.string().email(),
  password: z.string().min(8), phone: z.string().optional()
});
router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const { password, ...profile } = data;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { ...profile, passwordHash }, select: { id:true,name:true,email:true,role:true } });
    res.status(201).json({ user });
  } catch (e) { next(e); }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = z.object({ email:z.string().email(), password:z.string().min(1) }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ id:user.id, role:user.role, name:user.name }, process.env.JWT_SECRET, { expiresIn:"8h" });
    res.json({ token, user:{ id:user.id,name:user.name,email:user.email,role:user.role } });
  } catch (e) { next(e); }
});
export default router;
