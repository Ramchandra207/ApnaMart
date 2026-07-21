import { Router } from "express";
import Coupon from "../models/Coupon.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

r.get("/", authRequired, requireRole("admin"), async (_req, res) => {
  const items = await Coupon.find().sort({ createdAt: -1 });
  res.json(items);
});

r.post("/", authRequired, requireRole("admin"), async (req, res) => {
  const c = await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() });
  res.json(c);
});

r.put("/:id", authRequired, requireRole("admin"), async (req, res) => {
  const c = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(c);
});

r.delete("/:id", authRequired, requireRole("admin"), async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

r.post("/apply", authRequired, async (req, res) => {
  const { code, subtotal } = req.body;
  const c = await Coupon.findOne({ code: code?.toUpperCase(), status: "active" });
  if (!c) return res.status(404).json({ error: "Invalid coupon" });
  if (c.validTo && new Date(c.validTo) < new Date()) return res.status(400).json({ error: "Coupon expired" });
  if (subtotal < (c.minOrder || 0)) return res.status(400).json({ error: `Minimum order ₹${c.minOrder}` });
  const discount = c.type === "percent" ? (subtotal * c.value) / 100 : c.value;
  res.json({ code: c.code, discount, type: c.type, value: c.value });
});

export default r;
