import { Router } from "express";
import slugify from "slugify";
import Category from "../models/Category.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

r.get("/", async (_req, res) => {
  const cats = await Category.find().sort({ order: 1, name: 1 });
  res.json(cats);
});

r.get("/:slug", async (req, res) => {
  const c = await Category.findOne({ slug: req.params.slug });
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json(c);
});

r.post("/", authRequired, requireRole("admin"), async (req, res) => {
  const { name, image, parent, sector, featured, order } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const c = await Category.create({ name, slug, image, parent, sector, featured, order });
  res.json(c);
});

r.put("/:id", authRequired, requireRole("admin"), async (req, res) => {
  const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(c);
});

r.delete("/:id", authRequired, requireRole("admin"), async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default r;
