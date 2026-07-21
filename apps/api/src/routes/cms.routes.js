import { Router } from "express";
import CmsPage from "../models/CmsPage.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

r.get("/pages", async (_req, res) => {
  const pages = await CmsPage.find().sort({ slug: 1 });
  res.json(pages);
});

r.get("/pages/:slug", async (req, res) => {
  const p = await CmsPage.findOne({ slug: req.params.slug });
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

r.put("/pages/:slug", authRequired, requireRole("admin"), async (req, res) => {
  const p = await CmsPage.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true, upsert: true });
  res.json(p);
});

r.delete("/pages/:slug", authRequired, requireRole("admin"), async (req, res) => {
  await CmsPage.findOneAndDelete({ slug: req.params.slug });
  res.json({ ok: true });
});

export default r;
